/**
 * THIS FILE CONTAINS COMMON FUNCTIONS AND LOGIC USED FOR MANAGING CUSTOM ADS IN THE CMS
 */

import {getDateTime, uploadImage, deleteImage} from "../cmsLogic";

import firebase from "firebase";

/**
 * Fetches the current ad data for an adType and returns it in a promise
 * @param adType
 * @returns {Promise<Object>}
 */
const fetchCurrentAd = (adType) => {
    // Firebase resources
    const db = firebase.firestore()

    // Fetch article draft that matches the title
    return new Promise((resolve) => {
        db.collection("custom-site-ads").where("type", "==", adType).limit(1)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.docs.length) {
                    resolve({
                        docID: querySnapshot.docs[0].id,
                        ad: querySnapshot.docs[0].data()
                    })
                }
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            })
    })
}

/**
 * Function that handles publishing updates for a custom ad on the site.
 * @param ad
 * @param initialAd
 * @param adType
 * @param username
 * @returns {Promise<unknown>}
 */
const updateCustomAd = async (ad, initialAd, adType, username) => {
    // Handle changes in ad file from previous version
    let adImageURL = initialAd.imageURL        // Assume that the image has not been changed.
    let adImagePath = initialAd.imagePath
    let desc = ad.desc
    let link = ad.link
    if (ad.imageURL !== initialAd.imageURL) {
        // Delete the initial (old) ad's file if it exists
        if (initialAd.imagePath) {
            // Delete the old file
            await deleteImage(initialAd.imagePath)
            adImageURL = ""
            adImagePath = ""
            desc = ""
            link = ""
        }
        // Upload new ad file if it exists
        if (ad.file) {
            adImagePath = "custom-site-ads/" + adType + "/" + ad.file.name
            await uploadImage(adImagePath, ad.file).then((downloadURL) => {
                adImageURL = downloadURL
            })
        } else {
            // If there is no new file, then we can clear the description as well
            desc = ""
            link = ""
        }
    }

    // Update ad data to Firebase
    const db = firebase.firestore()
    const modified = getDateTime()

    await db.collection("custom-site-ads").doc(initialAd.documentID).update({
        desc: desc,
        imagePath: adImagePath,
        imageURL: adImageURL,
        linkURL: link,
        lastModified: modified,
        username: username
    })

    return new Promise((resolve) => {
        resolve()
    })
}

export {
    fetchCurrentAd,
    updateCustomAd
}