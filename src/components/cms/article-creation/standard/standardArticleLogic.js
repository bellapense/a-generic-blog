/**
 * THIS FILE CONTAINS COMMON FUNCTIONS AND LOGIC USED WHEN CREATING/MANAGING STANDARD ARTICLES IN THE CMS
 */

import {deleteImage, getArticlePathname, getDateTime, uploadImage} from "../../cmsLogic";

import firebase from "firebase";

/**
 * Function that validates the necessary fields to publish a standard article.
 * @param setFieldErrors
 * @param title
 * @param author
 * @param category
 * @param abstract
 * @param articleBody
 * @param authorInfo
 * @param coverPhotoDesc
 * @param coverPhotoFile
 * @returns {boolean}
 */
const validateStandardArticleFields = (setFieldErrors, {
    title, author, category, abstract, articleBody, authorInfo, coverPhotoDesc, coverPhotoFile}) => {
    // All fields required to be published - Exit if any are missing
    const validator = [{
        key: 'title',
        value: title,
        validator: val => val.trim() !== "",
        message: "Title is required."
    }, {
        key: 'author',
        value: author,
        validator: val => val !== "",
        message: "Author is required."
    }, {
        key: 'category',
        value: category,
        validator: val => {
            return val.path
        },
        message: "Category is required."
    }, {
        key: 'abstract',
        value: abstract,
        validator: val => val !== "",
        message: "Article abstract is required."
    }, {
        key: 'articleBody',
        value: articleBody,
        validator: val => val !== "",
        message: "Article body is required."
    }, {
        key: 'authorInfo',
        value: authorInfo,
        validator: val => val !== "",
        message: "Author information is required."
    },{
        key: 'coverPhotoDesc',
        value: coverPhotoDesc,
        validator: val => val !== "",
        message: "Cover photo description is required."
    },{
        key: 'coverPhotoFile',
        value: coverPhotoFile,
        validator: val => val !== null,
        message: "Cover photo image is required."
    }]

    let fieldsValid = true
    validator.forEach(field => {
        if (field.validator(field.value)) {
            setFieldErrors(v => ({...v, [field.key]: ""}))
        } else {
            setFieldErrors(v => ({...v, [field.key]: field.message}))
            fieldsValid = false
        }
    })

    return fieldsValid
}

/**
 * If a draft already exists for an article title, function returns document ID of that article draft in the promise
 * @param title
 * @returns {Promise<string>}
 */
const fetchExistingDraftFromTitle = (title) => {
    // Firebase resources - firestore
    const db = firebase.firestore()

    // Fetch the first article draft that matches the title
    return new Promise((resolve) => {
        // Resolve is populated with doc.id when the article is found, else it is empty.
        db.collection("classic-post-drafts").where("title", "==", title).limit(1)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.docs.length) {
                    resolve(querySnapshot.docs[0].id)
                } else {
                    resolve("")
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            })
    })
}

/**
 * If a draft for the docID exists, will return the docData in the promise.
 * @param docID
 * @returns {Promise<>}
 */
const fetchDraftFromDocID = (docID) => {
    // Firebase resources
    const db = firebase.firestore()

    // Fetch article draft that matches the docID, resolve populated with doc information and is rejected if no data exists.
    return new Promise((resolve, reject) => {
        db.collection("classic-post-drafts").doc(docID)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.data()) {
                    resolve(querySnapshot.data())
                } else {
                    reject()
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
                reject()
            })
    })
}

/**
 * If an article for the docID exists, will return the docData in the promise.
 * @param docID
 * @returns {Promise<>}
 */
const fetchStandardArticleFromDocID = (docID) => {
    // Firebase resources
    const db = firebase.firestore()

    // Fetch article that matches the docID, resolve populated with doc information and is rejected if no data exists.
    return new Promise((resolve, reject) => {
        db.collection("classic-posts").doc(docID)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.data()) {
                    resolve(querySnapshot.data())
                } else {
                    reject()
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
                reject()
            })
    })
}

/**
 * Creates a new article draft and returns the document ID, coverPhotoPathName, and dateTime in the resolved Promise.
 * On rejection, will return an error object {name: "errorType", value: "Reason for the error"}
 *  -> ex: for title clash, promise will be {name: "title", value: "existingDocID"}
 *
 * @param article
 * @param username
 * @returns {Promise<>}
 */
const createNewDraft = async (article, username) => {
    // Will reject with an existing draftID & accept with new draft ID
    return new Promise((async (resolve, reject) => {
        const existingDraftID = await fetchExistingDraftFromTitle(article.title.trim()).then((existingDraftID) => {
            return existingDraftID
        })
        if (existingDraftID) {
            reject({name: "title", value: existingDraftID})
        } else {
            // Get the original creation date & dateTime
            const [originalCreationDate] = getDateTime().split("@")
            const dateTime = getDateTime()

            // If there is a cover photo then upload it
            let coverPhotoPathName = ""
            let coverPhotoURL = ""
            if (article.file) {
                coverPhotoPathName = "classic-post-drafts/" + originalCreationDate + "/" + getArticlePathname(article.title) + "/" + article.file.name
                await uploadImage(coverPhotoPathName, article.file).then(async (downloadUrl) => {
                    coverPhotoURL = downloadUrl
                })
            }

            // Firebase resources
            const db = firebase.firestore()

            // Save the new draft to Firebase
            const draftID = await db.collection("classic-post-drafts").add({
                abstract: article.abstract,
                articleBody: article.articleBody,
                author: article.author,
                authorInfo: article.authorInfo,
                category: article.category,
                coverPhotoPathName,
                coverPhotoURL,
                coverPhotoDesc: article.coverPhotoDesc,
                coverPhotoInfo: article.coverPhotoInfo,
                isFeatured: article.isFeatured,
                originalCreationDate,
                title: article.title.trim(),
                dateTime,
                username,
            }).then((docRef) => {
                // Draft has been created successfully - return the draft ID
                return docRef.id
            })
            resolve([draftID, coverPhotoPathName, coverPhotoURL, dateTime])
        }
    }))
}

/**
 * Updates an existing draft version if one has been previously saved.
 * @param article
 * @param articleDraft
 * @param username
 * @returns {Promise<>}
 */
const updateDraft = async (article, articleDraft, username) => {
    // Check if the title has been changed
    if (article.title.trim() !== articleDraft.title.trim()) {
        // If another article with the same title exists
        await fetchExistingDraftFromTitle(article.title.trim()).then((existingDraftID) => {
            if (existingDraftID) {
                return new Promise((resolve, reject) => {
                    reject({name: "title", value: existingDraftID})
                })
            }
        })
    }

    // Get the original creation date & dateTime
    const [updatedCreationDate] = getDateTime().split("@")
    const dateTime = getDateTime()

    // If the cover photo has been updated or deleted then these will be updated
    let coverPhotoURL = articleDraft.coverPhotoURL
    let coverPhotoPathName = articleDraft.coverPhotoPathName

    // If the cover photo has been changed since the last draft
    if (article.file !== articleDraft.file) {
        // If a previous cover photo upload exists, then delete it
        if (articleDraft.file) {
            await deleteImage(articleDraft.coverPhotoPathName).then(() => {
                coverPhotoURL = ""
                coverPhotoPathName = ""
            }, (errorMessage) => {
                return new Promise((resolve, reject) => {
                    reject({name: "coverPhotoDelete", value: errorMessage})
                })
            })
        }
        // If a new file has been added, then upload it
        if (article.file) {
            coverPhotoPathName = "classic-post-drafts/" + updatedCreationDate + "/" + getArticlePathname(article.title) + "/" + article.file.name
            await uploadImage(coverPhotoPathName, article.file).then(async (downloadUrl) => {
                coverPhotoURL = downloadUrl
            })
        }
    }

    // Firebase resources
    const db = firebase.firestore()

    // Update the draft in Firebase
    await db.collection("classic-post-drafts").doc(articleDraft.documentID).update({
        abstract: article.abstract,
        articleBody: article.articleBody,
        author: article.author,
        authorInfo: article.authorInfo,
        category: article.category,
        coverPhotoPathName,
        coverPhotoURL,
        coverPhotoDesc: article.coverPhotoDesc,
        coverPhotoInfo: article.coverPhotoInfo,
        isFeatured: article.isFeatured,
        title: article.title.trim(),
        dateTime,
        username,
    })

    return new Promise((resolve) => {
        resolve([coverPhotoPathName, coverPhotoURL, dateTime])
    })
}

/**
 * Deletes an article draft.
 * @param draftDocID
 * @param draft
 * @returns {Promise<unknown>}
 */
const deleteDraft = async (draftDocID, draft) => {
    // Connect to firebase
    const db = firebase.firestore()

    await db.collection('classic-post-drafts').doc(draftDocID).delete().then(() => {
        // Delete cover photo if there is one
        if (draft.coverPhotoPathName) {
            const storageRef = firebase.storage().ref()
            const coverPhotoRef = storageRef.child(draft.coverPhotoPathName)
            coverPhotoRef.delete().then(() => {
            }).catch((error) => {
                console.error("Error removing document: ", error)
                return new Promise((resolve, reject) => {
                    reject({name: "error", value: "Error deleting cover photo."})
                })
            })
        }
    })
    return new Promise((resolve) => {
        resolve()
    })
}

const deleteDraftDocument = async (draftDocID) => {
    // Connect to firebase
    const db = firebase.firestore()

    await db.collection('classic-post-drafts').doc(draftDocID).delete()
    return new Promise((resolve) => {
        resolve()
    })
}

/**
 * Publishes a new standard article - returns Promise on publish completion.
 * @param article
 * @param username
 * @param articleDraft
 * @returns {Promise<void>}
 */
const publishNewStandardArticle = async (article, articleDraft, username) => {
    // Firebase resources
    const db = firebase.firestore();

    // For handling cover photo
    let coverPhotoPathName
    let coverPhotoURL

    // If an article draft exists, then delete it
    if (articleDraft.documentID) {
        // If the cover photo has not been changed then we just want to delete the document
        if (article.file === articleDraft.file) {
            await deleteDraftDocument(articleDraft.documentID)
            coverPhotoPathName = articleDraft.coverPhotoPathName
            coverPhotoURL = articleDraft.coverPhotoURL
        } else {
            await deleteDraft(articleDraft.documentID, articleDraft)
        }
    }

    // Use today's date for the article
    const dateTime = getDateTime()
    const originalCreationDate = dateTime.split("@")[0]

    // The URL for the article in format of "/category/date/title"
    const articleURL = article.category.path + "/" + originalCreationDate + "/" + getArticlePathname(article.title)

    // If the cover photo needs to be uploaded
    if (!coverPhotoURL) {
        // Create new pathname for the cover photo in storage -> "classic-post/date/article-title/file-name.ext"
        coverPhotoPathName = "classic-post/" + originalCreationDate + "/" + getArticlePathname(article.title) + "/" + article.file.name

        // Upload the cover photo
        await uploadImage(coverPhotoPathName, article.file).then(async (downloadUrl) => {
            coverPhotoURL = downloadUrl
        })
    }

    // Save the article
    await db.collection("classic-posts").add({
        abstract: article.abstract,
        articleBody: article.articleBody,
        articleURL,
        author: article.author,
        authorInfo: article.authorInfo,
        category: article.category,
        coverPhotoPathName,
        coverPhotoURL,
        coverPhotoDesc: article.coverPhotoDesc,
        coverPhotoInfo: article.coverPhotoInfo,
        dateTime,
        editorsNote: null,
        isFeatured: article.isFeatured,
        originalCreationDate,
        title: article.title.trim(),
        username,
    })

    return new Promise((resolve) => {
        resolve()
    })
}

/**
 * Function to delete an article that has already been published.
 * @param collection
 * @param docID
 * @param article
 * @returns {Promise<unknown>}
 */
const deletePublishedArticle = async (collection, docID, article) => {
    // Connect to Firebase
    const db = firebase.firestore()

    await db.collection(collection.name).doc(docID).delete().then(() => {
        // Delete images from storage
        const storageRef = firebase.storage().ref()
        if (collection.name === "classic-posts" && article.coverPhotoPathName) {
            const coverPhotoRef = storageRef.child(article.coverPhotoPathName)
            // Delete the cover photo
            coverPhotoRef.delete().then(() => {
                console.log("File deleted")
            }).catch((error) => {
                console.error("Error removing document: ", error)
            })
        }
    })
    return new Promise((resolve) => {
        resolve()
    })
}

const modifyPublishedStandardArticle = async (articleID, article, username) => {
    // Firebase resources
    const db = firebase.firestore();

    // Use today's date for the article
    const dateTime = getDateTime()

    // Update the article fields
    await db.collection("classic-posts").doc(articleID).update({
        abstract: article.abstract,
        articleBody: article.articleBody,
        author: article.author,
        authorInfo: article.authorInfo,
        coverPhotoDesc: article.coverPhotoDesc,
        coverPhotoInfo: article.coverPhotoInfo,
        dateTime,
        editorsNote: article.editorsNote,
        isFeatured: article.isFeatured,
        username,
    })

    return new Promise((resolve) => {
        resolve()
    })
}

export {
    validateStandardArticleFields,
    fetchDraftFromDocID,
    fetchStandardArticleFromDocID,
    createNewDraft,
    updateDraft,
    deleteDraft,
    publishNewStandardArticle,
    deletePublishedArticle,
    modifyPublishedStandardArticle,
}