import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

import {deletePublishedArticle} from "../../article-creation/standard/standardArticleLogic";
import {fetchMostRecent} from "./viewArticlesLogic";

import ArticleListContainer from "../ArticleListContainer";
import SiteAlert from "../../misc/SiteAlert";

/* Styles */
import "../../../../styles/modify-existing.css"

/**
 * Component that handles displaying the most recently published articles for each article type.
 * User can filter between the articles with the article filter buttons on the page. More articles
 * can be loaded until all existing articles are displayed on the page.
 * @returns {JSX.Element}
 * @constructor
 */
const ViewArticles = () => {
    const history = useHistory()

    /* State to hold the most recent for standard article collection */
    const [standardCollection, setStandardCollection] = useState({
        name: 'classic-posts',
        mostRecent: [],
        lastVisible: null,
        canLoadMore: true,
    })

    /* State for showing alert popup */
    const [alertPopup, setAlertPopup] = useState({
        showAlert: false,
        alertType: 'loading',
        isLoading: true,
        alertTitle: "",
        alertMessage: "",
    })

    /* Handle editing an articles */
    const handleEdit = (docID) => {
        history.push(`/cms-dashboard/edit-published-article/${docID}`)
    }

    /* Handle deleting a multimedia or standard article */
    const handleDelete = (collection, setCollection, docID, article) => {
        // Close the popup
        document.getElementById("popup-close-button").click()
        // Show the loading alert
        setAlertPopup({
            showAlert: true,
            alertType: "loading",
            isLoading: true,
            alertTitle: "Deleting article...",
            alertMessage: ""
        })
        // Delete the article
        deletePublishedArticle(collection, docID, article).then(() => {
            // Remove the article from the list of articles
            const updatedArticles = collection.mostRecent.filter((article) => article[0] !== docID)
            setCollection(prevState => ({
                ...prevState,
                mostRecent: updatedArticles,
            }))
            // If the deleted article was the last one, then load more.
            if (!updatedArticles.length) {
                fetchMostRecent(collection, setCollection)
            }
            // Update the loading alert
            setAlertPopup(prevState => ({
                ...prevState,
                isLoading: false,
                alertTitle: "Article deleted.",
                alertMessage: ""
            }))
        }, (reason) => {
            // Update the loading alert and alert user of failure
            setAlertPopup(prevState => ({
                ...prevState,
                isLoading: false,
                alertTitle: "Error deleting article.",
                alertMessage: `Article could not be deleted due to: ${reason.value}`
            }))
        })
    }

    /* On component mount fetch the initial most recent articles. */
    useEffect(() => {
        if (!standardCollection.mostRecent.length) {
            fetchMostRecent(standardCollection, setStandardCollection)
        }
        document.getElementById("content-view").scrollIntoView()
    }, [])

    return(
        <div className="modify-existing">
            <SiteAlert
                showAlert={alertPopup.showAlert}
                alertType={alertPopup.alertType}
                isLoading={alertPopup.isLoading}
                alertTitle={alertPopup.alertTitle}
                message={alertPopup.alertMessage}
                onConfirm={() => setAlertPopup(prevState => ({
                    ...prevState,
                    showAlert: false
                }))}
            />
            <h1>Existing Posts</h1>
            <hr/>
            <div className="page-container">
                <ArticleListContainer
                    articles={standardCollection.mostRecent}
                    handleLoadMore={() => fetchMostRecent(standardCollection, setStandardCollection)}
                    handleEdit={(docID) => handleEdit(docID)}
                    handleDelete={(docID, article) => handleDelete(standardCollection, setStandardCollection, docID, article)}
                    canLoadMore={standardCollection.canLoadMore}
                />
            </div>
        </div>
    );
}

export default ViewArticles;