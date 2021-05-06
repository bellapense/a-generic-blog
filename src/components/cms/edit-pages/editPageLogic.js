/**
 * THIS FILE CONTAINS COMMON FUNCTIONS AND LOGIC USED FOR EDITING PAGE CONTENT IN THE CMS
 */

import firebase from "firebase";
import {getDateTime} from "../cmsLogic";

/**
 * Function that returns the current page data and doc ID for a given page based on its URL.
 * @param path
 * @returns {Promise<unknown>}
 */
const getCurrentPageContent = async (path) => {
    // Firebase resources
    const db = firebase.firestore()

    return new Promise((resolve) => {
        db.collection("site-pages").where("path", "==", path).limit(1)
            .get()
            .then(async (querySnapshot) => {
                if (querySnapshot.docs.length) {
                    resolve({
                        docID: querySnapshot.docs[0].id,
                        content: querySnapshot.docs[0].data()})
                } else {
                    const lastModified = getDateTime()
                    const content = ""
                    const docID = await db.collection("site-pages").add({
                        lastModified,
                        content,
                        path
                    }).then((docRef) => {
                        return docRef.id
                    })
                    resolve({
                        docID: docID,
                        content: {lastModified, content, path}})
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error)
            })
    })
}

const publishContentChanges = (docID, updatedPageContent) => {
    // Firebase resources
    const db = firebase.firestore()
    // The date time for updated modification date
    const modifiedOn = getDateTime()

    return new Promise((resolve, reject) => {
        db.collection("site-pages").doc(docID)
            .update({
                content: updatedPageContent,
                lastModified: modifiedOn,
            })
            .then(() => {
                resolve()
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
                reject()
            })
    })
}

export {
    getCurrentPageContent,
    publishContentChanges
}