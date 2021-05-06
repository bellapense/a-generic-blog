/**
 * THIS FILE CONTAINS COMMON FUNCTIONS AND LOGIC USED THROUGHOUT THE CMS
 */

import firebase from "firebase";

/**
 * Returns the URL pathname for a new article from the article's title by filtering out unsafe & reserved
 * characters that may be in the articles title
 * @param title
 * @returns {string}
 */
const getArticlePathname = (title) => {
    const safeChars = /(^[a-zA-Z0-9_-]*$)/
    let pathname = ''
    title.trim().split('').forEach(char => {
        if (safeChars.test(char)) {
            pathname += char
        } else {
            if (char === " "){
                pathname += "-"
            }
        }
    })
    return pathname.toLocaleLowerCase()
}

/**
 * Returns a dateTime stamp in the format that it is saved in the database for.
 * @returns {string}
 */
const getDateTime = () => {
    const time = new Date().toLocaleTimeString([], { hour12: false })
    let date = new Date().toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })
    const [month, day, year] = date.split("/")
    return year + "-" + month + "-" + day + "@" + time
}

/**
 * Uploads an image to path specified in imagePathName and returns the download url as a promise after it is uploaded
 * @param imagePathName
 * @param image
 * @returns {Promise<string>}
 */
const uploadImage = (imagePathName, image) => {
    // Root reference to Cloud Storage
    const storageRef = firebase.storage().ref()

    // Upload task to upload image under path name in storage
    return new Promise((resolve) => {
        // Upload task to upload image under path name in storage
        const uploadTask = storageRef.child(imagePathName).put(image)
        //Update progress bar
        uploadTask.on('state_changed',
            (snapshot) => {
                // We can do something with the upload progress if we want to.
                //const percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
            },
            (error) => {
                switch (error.code) {
                    case 'storage/quota-exceeded':
                        // Quota on your Cloud Storage bucket has been exceeded. Upgrade to paid plan.
                        console.log("Quota on your Cloud Storage bucket has been exceeded. Upgrade to paid plan.")
                        break;
                    case 'storage/unauthorized':
                        // User is not authorized to upload
                        console.log("Quota on your Cloud Storage bucket has been exceeded. Upgrade to paid plan.")
                        break;
                }
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL)
                });
            }
        );
    });
}

/**
 * Will delete the file in Firebase Storage matching the pathname given.
 * @param imagePathName
 * @returns {Promise<unknown>}
 */
const deleteImage = (imagePathName) => {
    const imageRef = firebase.storage().ref().child(imagePathName)
    // Delete the cover photo
    return new Promise((resolve, reject) => {
        imageRef.delete().then(() => {
            resolve()
        }).catch((error) => {
            console.error("Error removing document: ", error)
            reject("Error removing cover photo.")
        })
    })
}

export {
    getArticlePathname,
    getDateTime,
    uploadImage,
    deleteImage,
}