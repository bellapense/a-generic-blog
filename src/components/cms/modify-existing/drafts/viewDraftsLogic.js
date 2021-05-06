/**
 * THIS FILE CONTAINS COMMON FUNCTIONS AND LOGIC USED FOR VIEW EXISTING ARTICLE DRAFTS
 */

import firebase from "firebase";

/**
 * Function that fetches up to 5 of the most recent standard article drafts for the specified user
 * and then sets those drafts based on the previous loaded drafts and indicates whether or
 * not more drafts can be loaded.
 * @param drafts
 * @param setDrafts
 */
const fetchMostRecentDrafts = (drafts, setDrafts) => {
    // Firebase resources
    const db = firebase.firestore()

    // Set query
    let queryDrafts = db.collection("classic-post-drafts").orderBy("dateTime", "desc")

    // If previous drafts have been pulled start at the last one
    if (drafts.lastVisible) {
        queryDrafts = queryDrafts.startAt(drafts.lastVisible)
    }

    // Fetch most recent drafts
    queryDrafts.limit(6).get().then((querySnapshot) => {
        let moreDrafts = []
        querySnapshot.forEach((doc) => {
            moreDrafts.push([doc.id, doc.data()])
        })
        let canLoadMore = false
        if (moreDrafts.length === 6){
            canLoadMore = true
            moreDrafts.pop()
        }
        setDrafts(prevState => ({
            ...prevState,
            mostRecent: [...prevState.mostRecent, ...moreDrafts],
            lastVisible: querySnapshot.docs[querySnapshot.docs.length-1],
            canLoadMore: canLoadMore,
        }))
    })
        .catch((error) => {
            console.log("Error getting documents: ", error)
        })
}

export {
    fetchMostRecentDrafts
}