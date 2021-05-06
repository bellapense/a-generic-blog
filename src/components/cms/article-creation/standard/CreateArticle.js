import React, {useEffect, useState} from "react";
import { useBeforeunload } from 'react-beforeunload';

import {useAuth} from "../../../../contexts/AuthContext";

import {
    createNewDraft,
    modifyPublishedStandardArticle,
    publishNewStandardArticle,
    updateDraft,
    validateStandardArticleFields
} from "./standardArticleLogic";
import CreateArticleFields from "./CreateArticleFields";
import _ from "lodash"
import SiteAlert from "../../misc/SiteAlert";

/* Styles */
import "../../../../styles/create-classic.css";
import AskBeforeLeaving from "../../misc/AskBeforeLeaving";

/**
 * Component for creating a new standard article. To props.existingDraft to load existing
 * draft data to the form to continue editing a draft.
 * @param props
 */
function CreateArticle(props) {
    /* Store the current user's email/username */
    const { currentUser } = useAuth();
    const username = currentUser.email;

    /* State that holds article field information */
    const [article, setArticle] = useState({
        title: "",
        author: "",
        authorInfo: "",
        category: {},
        isFeatured: false,
        coverPhotoInfo: "",
        coverPhotoDesc: "",
        coverPhotoFile: null,
        file: null,
        abstract: "",
        articleBody: "",
    })

    /* State that holds the last saved draft version of the article */
    const [articleDraft, setArticleDraft] = useState({
        documentID: "",
        title: "",
        author: "",
        authorInfo: "",
        category: {},
        isFeatured: false,
        coverPhotoInfo: "",
        coverPhotoDesc: "",
        coverPhotoFile: null,
        coverPhotoPathName: "",
        coverPhotoURL: "",
        file: null,
        abstract: "",
        articleBody: "",
        lastUpdated: "",
    })

    /* State if existing article is being updated */
    const [publishedArticle, setPublishedArticle] = useState(null)
    const [prevPublishedArticle, setPrevPublishedArticle] = useState(null)

    /* State to hold field validation errors */
    const [fieldErrors, setFieldErrors] = useState({
        title: '',
        author: '',
        category: '',
        abstract: '',
        articleBody: '',
        authorInfo: '',
        coverPhotoDesc: '',
        coverPhotoFile: ''
    })

    /* State to determine if warnings should be shown */
    const [showWarnings, setShowWarnings] = useState(true)

    /* Site alert state for displaying custom popup/prompt */
    const [alertPopup, setAlertPopup] = useState({
        showAlert: false,
        alertType: 'loading',
        isLoading: true,
        alertTitle: "",
        alertMessage: "",
    })

    /* Function to clear/reset field alerts */
    const resetFieldAlerts = () => {
        setFieldErrors({
            title: '',
            author: '',
            category: '',
            abstract: '',
            articleBody: '',
            authorInfo: '',
            coverPhotoDesc: '',
            coverPhotoFile: ''
        })
    }

    /* Shows warning before page is reloaded if there are unsaved changes */
    useBeforeunload(() => {
        if (hasUnsavedChanges() && showWarnings) {
            return "Unsaved changes will be lost, would you like to continue?"
        }
    });

    /* Function that checks to see if there are any unsaved changes */
    const hasUnsavedChanges = () => {
        if (props.publishedArticle) {
            return !(_.isEqual(publishedArticle, prevPublishedArticle))
        }
        const prevSave = (({ documentID, coverPhotoPathName, coverPhotoURL, lastUpdated, ...o }) => o)(articleDraft)
        return !(_.isEqual(prevSave, article))
    }

    /* Function that will set loading alert */
    const setLoadingAlert = (alertTitle) => {
        setAlertPopup({
            showAlert: true,
            alertType: "loading",
            isLoading: true,
            alertTitle: alertTitle,
            alertMessage: ""
        })
    }

    /* Function that handles publishing an article */
    const handlePublishArticle = () => {
        // Close the confirmation popup
        document.getElementById("popup-close-button").click()
        // Attempt to publish article & show loading alert
        setLoadingAlert("Publishing article...")
        // Validate input
        if (validateStandardArticleFields(setFieldErrors, article)) {
            // Fields have been validated and the article can be published now
             publishNewStandardArticle(article, articleDraft, username).then(() => {
                 setShowWarnings(false)
                 setAlertPopup((prevState => ({
                     ...prevState,
                     showAlert: false
                 })))
                 window.location.href = "/cms-dashboard/publish-content-success"
            })
        } else {
            // Field validation failed
            setAlertPopup((prevState => ({
                ...prevState,
                isLoading: false,
                alertTitle: "Error",
                alertMessage: "Please fill out all required fields."
            })))
        }
    }

    /* Function that handles publishing changes to an already published article */
    const handlePublishArticleChanges = () => {
        // Close the confirmation popup
        document.getElementById("popup-close-button").click()
        // Check if changes have actually been made
        if (_.isEqual(prevPublishedArticle, publishedArticle)) {
            setAlertPopup((prevState => ({
                ...prevState,
                showAlert: true,
                alertType: "alert",
                alertTitle: "No changes to publish",
                alertMessage: ""
            })))
            return
        }
        // Attempt to publish article & show loading alert
        setLoadingAlert("Publishing changes...")
        // Validate input
        if (validateStandardArticleFields(setFieldErrors, publishedArticle)) {
            // Fields have been validated and the article can be published now
            modifyPublishedStandardArticle(publishedArticle.documentID, publishedArticle, username).then(() => {
                setShowWarnings(false)
                setAlertPopup((prevState => ({
                    ...prevState,
                    showAlert: false
                })))
                window.location.href = "/cms-dashboard/publish-content-success"
            })
        } else {
            // Field validation failed
            setAlertPopup((prevState => ({
                ...prevState,
                isLoading: false,
                alertTitle: "Error",
                alertMessage: "Please fill out all required fields."
            })))
        }
    }

    /* Function that handles missing title error for drafts */
    const handleMissingTitleError = () => {
        setFieldErrors(prevState => ({
            ...prevState,
            title: 'Title is required to save an article as a draft.'
        }))
        setAlertPopup((prevState => ({
            ...prevState,
            showAlert: true,
            alertType: "alert",
            alertTitle: "Error",
            alertMessage: "The article must have a title to be saved as a draft."
        })))
    }

    /* Function that handles when there is a title clash error for saving drafts! */
    const handleTitleClashError = () => {
        // Stretch goal: give user option to overwrite/delete this existing draft
        setAlertPopup((prevState => ({
            ...prevState,
            isLoading: false,
            alertTitle: "Error saving draft",
            alertMessage: "An article draft already exists with this title."
        })))

        setFieldErrors(prevState => ({
            ...prevState,
            title: `Another draft already exists with this title.
            ${articleDraft.title ? `Previous article title for this draft was: ${articleDraft.title}` : "" }`
        }))
    }

    /* Function that updates the article draft */
    const handleUpdateArticleDraft = (draftID, coverPhotoPathName, coverPhotoURL, dateTime, alertMessage) => {
        setAlertPopup((prevState => ({
            ...prevState,
            isLoading: false,
            alertTitle: "Draft saved",
            alertMessage: alertMessage
        })))
        setArticleDraft({
            documentID: draftID,
            title: article.title.trim(),
            author: article.author,
            authorInfo: article.authorInfo,
            category: article.category,
            isFeatured: article.isFeatured,
            coverPhotoInfo: article.coverPhotoInfo,
            coverPhotoDesc: article.coverPhotoDesc,
            coverPhotoFile: article.coverPhotoFile,
            coverPhotoPathName: coverPhotoPathName,
            coverPhotoURL: coverPhotoURL,
            file: article.file,
            abstract: article.abstract,
            articleBody: article.articleBody,
            lastUpdated: dateTime,
        })
    }

    /* Function that handles saving an article as draft */
    const handleSaveDraft = async () => {
        // Close the popup button now
        document.getElementById("popup-close-button").click()
        // Check if changes have actually been made
        if (!hasUnsavedChanges()) {
            setAlertPopup((prevState => ({
                ...prevState,
                showAlert: true,
                alertType: "alert",
                alertTitle: "No changes to save",
                alertMessage: ""
            })))
            return
        }
        // Clear existing field errors
        resetFieldAlerts()
        // Validate that the article has a title
        if (!article.title.trim()) {
            // Notify user that they must enter title for the article and close popup
            handleMissingTitleError()
            return
        }
        // Attempt to save the draft now & show loading alert
        setLoadingAlert("Saving draft...")
        // If a previous version of a draft exists - then it will be updated
        if (articleDraft.documentID) {
            // Update the existing draft - fails if the title is changed to an existing one.
            updateDraft(article, articleDraft, username).then(([coverPhotoPathName, coverPhotoURL, dateTime]) => {
                // Update the state of articleDraft
                handleUpdateArticleDraft(articleDraft.documentID, coverPhotoPathName, coverPhotoURL,
                    dateTime, "Article draft has been updated.")
            }, (reason) => {
                if (reason.name === "title") {
                    // Stretch goal: give user option to overwrite/delete this existing draft
                    // DraftID of existing is in reason.value
                    handleTitleClashError()
                } else {
                    // A different error occurred
                    setAlertPopup((prevState => ({
                        ...prevState,
                        isLoading: false,
                        alertTitle: "Error saving draft",
                        alertMessage: `Draft could not be saved due to: ${reason.value}`
                    })))
                }
            })
        } else {
            // Create a new draft
            createNewDraft(article, username).then(([draftID, coverPhotoPathName, coverPhotoURL, dateTime]) => {
                // Update the state of articleDraft
                handleUpdateArticleDraft(draftID, coverPhotoPathName, coverPhotoURL,
                    dateTime, "Article draft has been created.")
            }, (reason) => {
                if (reason.name === "title") {
                    // Stretch goal: give user option to overwrite/delete this existing draft from here
                    // DraftID of existing is in reason.value
                    handleTitleClashError()
                } else {
                    // A different error occurred
                    setAlertPopup((prevState => ({
                        ...prevState,
                        isLoading: false,
                        alertTitle: "Error saving draft",
                        alertMessage: `Draft could not be saved due to: ${reason.value}`
                    })))
                }
            })
        }
    }

    /* Runs on component mount to scroll it into view */
    useEffect(() => {
        // Brings fields from existing draft into the form
        if (props.existingDraft) {
            setArticle({
                title: props.existingDraft.title,
                author: props.existingDraft.author,
                authorInfo: props.existingDraft.authorInfo,
                category: props.existingDraft.category,
                isFeatured: props.existingDraft.isFeatured,
                coverPhotoInfo: props.existingDraft.coverPhotoInfo,
                coverPhotoDesc: props.existingDraft.coverPhotoDesc,
                coverPhotoFile: props.existingDraft.coverPhotoURL ? props.existingDraft.coverPhotoURL : null,
                file: props.existingDraft.coverPhotoURL ? props.existingDraft.coverPhotoURL : null,
                abstract: props.existingDraft.abstract,
                articleBody: props.existingDraft.articleBody,
            })
            setArticleDraft({
                documentID: props.existingDraftID,
                title: props.existingDraft.title,
                author: props.existingDraft.author,
                authorInfo: props.existingDraft.authorInfo,
                category: props.existingDraft.category,
                isFeatured: props.existingDraft.isFeatured,
                coverPhotoInfo: props.existingDraft.coverPhotoInfo,
                coverPhotoDesc: props.existingDraft.coverPhotoDesc,
                coverPhotoFile: props.existingDraft.coverPhotoURL ? props.existingDraft.coverPhotoURL : null,
                coverPhotoPathName: props.existingDraft.coverPhotoPathName,
                coverPhotoURL: props.existingDraft.coverPhotoURL,
                file: props.existingDraft.coverPhotoURL ? props.existingDraft.coverPhotoURL : null,
                abstract: props.existingDraft.abstract,
                articleBody: props.existingDraft.articleBody,
                lastUpdated: props.existingDraft.dateTime,
            })
        } else if (props.publishedArticle) {
            setPublishedArticle({
                documentID: props.publishedArticleID,
                editorsNote: props.publishedArticle.editorsNote ? props.publishedArticle.editorsNote : "",
                originalCreationDate: props.publishedArticle.originalCreationDate,
                title: props.publishedArticle.title,
                author: props.publishedArticle.author,
                authorInfo: props.publishedArticle.authorInfo,
                category: props.publishedArticle.category,
                isFeatured: props.publishedArticle.isFeatured,
                coverPhotoInfo: props.publishedArticle.coverPhotoInfo,
                coverPhotoDesc: props.publishedArticle.coverPhotoDesc,
                coverPhotoURL: props.publishedArticle.coverPhotoURL,
                abstract: props.publishedArticle.abstract,
                articleBody: props.publishedArticle.articleBody,
            })
            setPrevPublishedArticle({
                documentID: props.publishedArticleID,
                editorsNote: props.publishedArticle.editorsNote ? props.publishedArticle.editorsNote : "",
                originalCreationDate: props.publishedArticle.originalCreationDate,
                title: props.publishedArticle.title,
                author: props.publishedArticle.author,
                authorInfo: props.publishedArticle.authorInfo,
                category: props.publishedArticle.category,
                isFeatured: props.publishedArticle.isFeatured,
                coverPhotoInfo: props.publishedArticle.coverPhotoInfo,
                coverPhotoDesc: props.publishedArticle.coverPhotoDesc,
                coverPhotoURL: props.publishedArticle.coverPhotoURL,
                abstract: props.publishedArticle.abstract,
                articleBody: props.publishedArticle.articleBody,
            })
        }
    }, [])

    return (
        <div className="create-classic" id="create-classic">

            <AskBeforeLeaving hasUnsavedChanges={hasUnsavedChanges}/>
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
            {publishedArticle ?
                <>
                    <h1>Edit Published Classic Post</h1>
                    <CreateArticleFields
                        article={publishedArticle}
                        setArticle={setPublishedArticle}
                        handlePublishArticle={handlePublishArticleChanges}
                        modifyExisting={true}
                        fieldErrors={fieldErrors}
                    />
                </> :
                <>
                    <h1>Create a Classic Post</h1>
                    <CreateArticleFields
                        article={article}
                        draftFileName={articleDraft.coverPhotoPathName}
                        setArticle={setArticle}
                        handleSaveDraft={handleSaveDraft}
                        handlePublishArticle={handlePublishArticle}
                        fieldErrors={fieldErrors}
                    />
                </>
            }
        </div>
    );
}

export default CreateArticle;