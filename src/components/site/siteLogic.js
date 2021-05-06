import firebase from "firebase";
import {getArticlePathname, getDateTime} from "../cms/cmsLogic";
import {CATEGORIES} from "../../constants";

/**
 * THIS FILE CONTAINS COMMON SITE FUNCTIONS / LOGIC TO BE REUSED.
 */

/**
 * Appends twitter script to element param to properly render tweets it contains.
 * @param element
 */
const appendTwitterScript = (element) => {
    // Check if element is not null (it may be)
    if (element) {
        // Create the script
        const twitterScript = document.createElement("script")
        twitterScript.setAttribute("async", "")
        twitterScript.setAttribute("src", "https://platform.twitter.com/widgets.js")
        // Append the script
        element.appendChild(twitterScript) // Tweet will be transformed by script
        // Remove the script
        element.removeChild(twitterScript) // Removing script so that multiple scripts are not added + COA security
    }
}

/**
 * Sets the attribute of all links contained in element param to open in a new tab.
 * @param element
 */
const setLinkAttributes = (element) => {
    // Check if element is not null (it may be)
    if (element) {
        // Get all links (<a>) contained in element
        const links = element.getElementsByTagName("a")
        let i
        // Set attributes for each link
        for (i = 0; i < links.length; i++) {
            links[i].setAttribute("target", "_blank")
            links[i].setAttribute("rel", "noreferrer")
        }
    }
}

const addArticleAd = (element, ad) => {
    // Remove a previous ad if there is one
    if (element) {
        const prevAd = document.getElementById("custom-in-article")
        if (prevAd) {
            element.removeChild(prevAd)
        }
    }
    // If the article body has been mounted and there is an ad to add
    if (element && ad) {
        // We want to add the ad to as close as the middle of the article that we can.
        const paragraphs = element.getElementsByTagName("p")
        // Assume even length
        let middle = paragraphs.length / 2
        // If length is odd
        if (paragraphs.length % 2 !== 0) {
            middle = (paragraphs.length + 1) / 2
        }
        const adElement = document.createElement("div")
        adElement.id = "custom-in-article"
        adElement.className = "custom-in-article"
        adElement.innerHTML = `<a href=${ad.linkURL} rel="noreferrer" target="_blank"><img src=${ad.imageURL} alt=${ad.desc}/></a>`
        paragraphs[middle - 1].insertAdjacentElement("afterend", adElement)
    }
}

/**
 * Takes a date in the format "YYYY-MM-DD" and returns a string displaying the date.
 * @param date
 * @returns {string}
 */
const getDisplayDate = (date) => {
    if (date) {
        const splitDate = date.split("-")
        const months = ["", "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return `${months[parseInt(splitDate[1])]} ${parseInt(splitDate[2])}, ${parseInt(splitDate[0])}`
    }
    return ""
}

/**
 * Takes a string of HTML and turns emails into mailto links.
 * @param content
 * @returns {*}
 */
const findAndReplaceEmail = (content) => {
    const email_regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    return content.replace(email_regex, '<a href="mailto:$1">$1</a>');
}

/**
 * Returns the icon for the given category.
 * @param path
 * @returns {null}
 */
const getCategoryIcon = (path) => {
    let icon = null
    CATEGORIES.forEach((category) => {
        if (category.path === path) {
            icon = category.icon
        }
    })
    return icon
}

/**
 * I am so tired of making articles by hand. This function will create a new standard for testing.
 * When we are done developing we can delete this function and also uninstall the JS random words getter I'm using:
 * https://www.npmjs.com/package/random-words
 */
const createNewStandardArticle = (username) => {
    // Firebase Resources
    const db = firebase.firestore();

    // For random words generating
    const randomWords = require('random-words')

    // Article abstract
    let abstract = randomWords({ exactly: ((Math.floor(Math.random() * 100) % 10) + 15), join: ' ' })
    abstract = abstract.charAt(0).toUpperCase() + abstract.slice(1) + "."

    // Article body
    let articleBody = ""
    let i = 0
    // Create paragraphs
    for (i; i < ((Math.floor(Math.random() * 100) % 5) + 5); i++) {
        // Create sentences
        let j = 0
        articleBody += "<p>"
        for (j; j < 3; j++) {
            let sentence = randomWords({ exactly: ((Math.floor(Math.random() * 100) % 10) + 5), join: ' ' })
            sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ". "

            articleBody += sentence
        }
        articleBody += "</p>"
    }

    // Author
    const authors = ["Penny Marshall", "Mara Smith", "Jon Aurora", "Phoebe Belle", "Sean David", "Elliott Rose"]
    const author = authors[(Math.floor(Math.random() * 100) % authors.length)]

    // Author info
    let sentence = randomWords({ exactly: ((Math.floor(Math.random() * 100) % 10) + 5), join: ' ' })
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + "."
    const authorInfo = author + " is a correspondent for this fine publication. " + sentence + " " + author +
        " can be reached at email@emailprovider.com."

    // dateTime
    const [today, time] = getDateTime().split("@")
    let month = ((Math.floor(Math.random() * 100) % 12) + 1).toString()
    if (month.length === 1) {
        month = "0" + month
    }
    let day = ((Math.floor(Math.random() * 100) % 28) + 1).toString()
    if (day.length === 1) {
        day = "0" + day
    }
    const [tY, tM, tD] = today.split("-")
    let year = tY
    if (tM <= month) {
        if (tD < day) {
            year = "2020"
        }
    }
    let date = year + "-" + month + "-" + day
    const dateTime = date + "@" + time

    // Title
    let title = randomWords({ exactly: ((Math.floor(Math.random() * 100) % 5) + 6), join: ' ' })
    title = title.charAt(0).toUpperCase() + title.slice(1)

    // Get a random category
    let category = CATEGORIES[(Math.floor(Math.random() * 100) % CATEGORIES.length)]
    category = {name: category.name, path: category.path}

    // Randomized for is featured
    const isFeatured = (!(Math.floor(Math.random() * 100) % 2))

    const imageURL = `https://picsum.photos/1000/500/?random&t=${time}`
    // Article URL
    const articleURL = category.path + "/" + date + "/" + getArticlePathname(title)
    db.collection("classic-posts").add({
        abstract,
        articleBody,
        articleURL,
        author,
        authorInfo,
        category,
        coverPhotoPathName: "",
        coverPhotoURL: imageURL,
        coverPhotoDesc: "A randomly generated cover photo courtesy of Picsum.",
        coverPhotoInfo: "Cover photo is randomly genterated courtesy of Picsum.",
        editorsNote: null,
        isFeatured,
        originalCreationDate: date,
        title,
        dateTime,
        username
    }).then(() => {
        alert("Your article has been created!")
    });
}

export {
    appendTwitterScript,
    setLinkAttributes,
    addArticleAd,
    getDisplayDate,
    findAndReplaceEmail,
    getCategoryIcon,
    createNewStandardArticle,
}