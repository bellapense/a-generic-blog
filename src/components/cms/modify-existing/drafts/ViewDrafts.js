import React, {useEffect, useState} from "react";
import {useAuth} from "../../../../contexts/AuthContext";
import {useHistory} from "react-router-dom";

import {deleteDraft} from "../../article-creation/standard/standardArticleLogic";
import {fetchMostRecentDrafts} from "./viewDraftsLogic";

import ArticleListContainer from "../ArticleListContainer";
import SiteAlert from "../../misc/SiteAlert";

/* Styles */
import "../../../../styles/modify-existing.css"

/**
 * Component that handles displaying the most recently saved standard article drafts for either
 * the current user or all other users. More drafts can be loaded if more exist.
 * @returns {JSX.Element}
 * @constructor
 */
function ViewDrafts () {
    const history = useHistory()

    /* Store the current user */
    const { currentUser } = useAuth()
    const username = currentUser.email

    /* State to store the user's drafts */
    const [currentUserDrafts, setCurrentUserDrafts] = useState({
        name: 'current-user',
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

    /* Function to delete a draft */
    const handleDeleteDraft = (docID, draft, drafts, setDrafts) => {
        // Close the popup
        document.getElementById("popup-close-button").click()
        // Show the loading alert
        setAlertPopup({
            showAlert: true,
            alertType: "loading",
            isLoading: true,
            alertTitle: "Deleting draft...",
            alertMessage: ""
        })

        // Delete the draft
        deleteDraft(docID, draft).then(() => {
            // Remove the draft from its list
            const updatedDrafts = drafts.mostRecent.filter((draft) => draft[0] !== docID)
            setDrafts(prevState => ({
                ...prevState,
                mostRecent: updatedDrafts,
            }))
            // If the deleted draft was the last one, then load more.
            if (!updatedDrafts.length) {
                fetchMostRecentDrafts(drafts, setDrafts, username)
            }
            // Update the loading alert
            setAlertPopup(prevState => ({
                ...prevState,
                isLoading: false,
                alertTitle: "Draft deleted.",
                alertMessage: ""
            }))
        }, (reason) => {
            // If the draft could not be deleted inform the user of the error
            setAlertPopup((prevState => ({
                ...prevState,
                isLoading: false,
                alertTitle: "Error deleting draft.",
                alertMessage: `Draft could not be deleted due to: ${reason.value}`
            })))
        })
    }

    /* Handles editing a draft */
    const handleEdit = (docID) => {
        history.push(`/cms-dashboard/create-classic/${docID}`)
    }

    useEffect(() => {
        if (!currentUserDrafts.mostRecent.length) {
            fetchMostRecentDrafts(currentUserDrafts, setCurrentUserDrafts)
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
            <h1>Existing Drafts</h1>
            <hr/>
            <div className="page-container">
                <ArticleListContainer
                    drafts={currentUserDrafts.mostRecent}
                    handleLoadMore={() => fetchMostRecentDrafts(currentUserDrafts, setCurrentUserDrafts)}
                    handleEdit={(docID) => handleEdit(docID)}
                    handleDelete={(docID, draft) => handleDeleteDraft(docID, draft, currentUserDrafts, setCurrentUserDrafts)}
                    canLoadMore={currentUserDrafts.canLoadMore}
                />
            </div>
        </div>
    );
}

export default ViewDrafts;