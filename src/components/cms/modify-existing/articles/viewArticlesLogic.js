/**
 * THIS FILE CONTAINS COMMON FUNCTIONS AND LOGIC USED FOR VIEW EXISTING ARTICLES
 */

import firebase from "firebase";

/**
 * Function that fetches up to 5 of the most recent articles for the specified collection
 * and then sets those articles based on the previous loaded articles and indicates whether or
 * not more articles can be loaded.
 * @param collection
 * @param setCollection
 */
const fetchMostRecent = (collection, setCollection) => {
    // Firebase resources
    const db = firebase.firestore()

    // Build query
    let query = db.collection(collection.name).orderBy("dateTime", "desc")
    if (collection.lastVisible) {
        query = query.startAt(collection.lastVisible)
    }

    // Fetch most recent articles
    query.limit(6).get().then((querySnapshot) => {
        let articles = []
        querySnapshot.forEach((doc) => {
            articles.push([doc.id, doc.data()])
        })
        let canLoadMore = false
        if (articles.length === 6){
            canLoadMore = true
            articles.pop()
        }
        setCollection(prevState => ({
            ...prevState,
            mostRecent: [...prevState.mostRecent, ...articles],
            lastVisible: querySnapshot.docs[querySnapshot.docs.length-1],
            canLoadMore: canLoadMore,
        }))
    })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

export {
    fetchMostRecent
}