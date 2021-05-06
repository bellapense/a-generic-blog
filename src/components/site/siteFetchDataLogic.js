/**
 * THIS FILE CONTAINS COMMON FUNCTIONS AND LOGIC FOR FETCHING DATA ON THE SITE
 */

import firebase from "firebase"
import {fetchCurrentAd} from "../cms/manage-advertising/manageAdvertisingLogic";
import {CATEGORIES} from "../../constants";

/**
 * Fetches articles for the specified article, starting at the last pulled article for that category (if one exists).
 * @param category
 * @param prevLastVisible
 * @returns {Promise<unknown>}
 */
const fetchCategoryArticles = (category, prevLastVisible) => {
    // Connect to Firebase
    const db = firebase.firestore()
    let query = db.collection("classic-posts").where("category.path", "==", category)

    // Sort by most recent
    query = query.orderBy("dateTime", "desc")

    // Start at last visible article if there is one
    if (prevLastVisible) {
        query = query.startAt(prevLastVisible)
    }

    // Return query result in promise
    return new Promise((resolve) => {
        query.limit(11).get().then((querySnapshot) => {
            let articles = []
            querySnapshot.forEach((doc) => {
                articles.push(doc.data())
            })
            // Note the last visible article
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1]
            // Determine if more articles can be loaded
            let canLoadMore = false
            if (articles.length === 11){
                canLoadMore = true
                articles.pop()
            }
            // Resolve query with the articles, lastVisible, and canLoadMore
            resolve({category, articles, lastVisible, canLoadMore})
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    })
}

/**
 * Fetches the 8 most recent articles for displaying them in the sidebar. This query is important for a number of
 * reasons - mainly that all data fetches are based off of it as it is a unique query that only runs once during the
 * initial data fetch for the application. So many other queries/data requests are dependent on its existence.
 * @returns {Promise<unknown>}
 */
const fetchMostRecent = () => {
    // Connect to Firebase
    const db = firebase.firestore()
    let query = db.collection("classic-posts").orderBy("dateTime", "desc")

    // Return query result in promise
    return new Promise((resolve) => {
        query.limit(8).get().then((querySnapshot) => {
            let articles = []
            querySnapshot.forEach((doc) => {
                articles.push(doc.data())
            })

            // Resolve query with the articles, lastVisible, and canLoadMore
            resolve({category: "/most-recent", articles, lastVisible: null, canLoadMore: false})
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    })
}

const fetchFeatured = () => {
    // Connect to Firebase
    const db = firebase.firestore()
    let query = db.collection("classic-posts").where("isFeatured", "==", true).orderBy("dateTime", "desc")

    // Return query result in promise
    return new Promise((resolve) => {
        query.limit(8).get().then((querySnapshot) => {
            let articles = []
            querySnapshot.forEach((doc) => {
                articles.push(doc.data())
            })

            // Resolve query with the articles, lastVisible, and canLoadMore
            resolve({category: "/featured", articles, lastVisible: null, canLoadMore: false})
        })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    })
}

/**
 * Master query runner to fetch all initial articles that runs when page wrapper first mounts and populates the
 * data store with its initial data.
 * @returns {Promise<unknown[]>}
 */
const fetchAllInitialArticles = () => {
    const categories = CATEGORIES.map(category => {
        return category.path
    })

    let promises = []
    for (let i = 0; i < categories.length; i++) {
        promises.push(fetchCategoryArticles(categories[i], null))
    }
    // Add featured posts
    promises.push(fetchMostRecent())
    promises.push(fetchFeatured())
    return Promise.all(promises)
}

/**
 * Function that handles fetching an article from its URL from the database.
 * @param articleURL
 * @param collection
 * @returns {Promise<unknown>}
 */
const fetchArticleFromURL = (articleURL, collection) => {
    const db = firebase.firestore()
    const queryArticles = db.collection(collection)
    /* Fetch article matching the URL */
    return new Promise((resolve => {
        queryArticles.where("articleURL", "==", articleURL).limit(1)
            .get()
            .then((querySnapshot) => {
                let matchedArticle = null
                if (querySnapshot.docs.length) {
                    matchedArticle = querySnapshot.docs[0].data()
                }
                resolve(matchedArticle)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }))
}

/**
 * Query that fetches the content for one of the "static" site site-pages.
 * @param path
 * @returns {Promise<unknown>}
 */
const fetchPageContent = (path) => {
    const db = firebase.firestore()

    /* Fetch page content matching the URL */
    return new Promise((resolve => {
        db.collection("site-pages").where("path", "==", path).limit(1)
            .get()
            .then((querySnapshot) => {
                let content = null
                if (querySnapshot.docs.length) {
                    content = querySnapshot.docs[0].data().content
                }
                resolve(content)
            })
            .catch((error) => {
                console.log("Error getting documents: ", error)
            })
    }))
}

/**
 * Function for fetching data for custom ads to be displayed on the site. Returns ad data for all 3 ads in an array
 * of promises to the data store.
 * @returns {Promise<unknown[]>}
 */
const fetchCustomAds = () => {
    // Current ad data will be returned in promise
    let promises = []

    promises.push(fetchCurrentAd("site-banner"))
    promises.push(fetchCurrentAd("article"))
    promises.push(fetchCurrentAd("sidebar"))

    return Promise.all(promises)
}

export {
    fetchCategoryArticles,
    fetchAllInitialArticles,
    fetchArticleFromURL,
    fetchPageContent,
    fetchCustomAds,
}