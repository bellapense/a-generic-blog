/* Licensing for GNU General Public License 2.0 or greater */
/*  The South End is a Website and CMS to publish news articles
    Copyright (C) 2021  The South End

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import React, {useEffect, useState} from "react"
import {useBeforeunload} from "react-beforeunload";

import {getCurrentPageContent, publishContentChanges} from "./editPageLogic";
import {getDisplayDate} from "../../site/siteLogic";

import AdvancedEditor from "../article-creation/AdvancedEditor";
import ToolTipPopup from "../misc/ToolTipPopup";
import SiteAlert from "../misc/SiteAlert";

import SitePage from "../../site/pages/SitePage";

import "../../../styles/edit-page.css"

/**
 * All the business logic for editing page content. Takes in the pageURL for the page to be modified.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const EditPageContent = (props) => {

    /* States for page content */
    const [currentPageData, setCurrentPageData] = useState(null)
    const [updatedPageContent, setUpdatedPageContent] = useState(null)

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

    /* Function that returns true if there are unsaved changes on the page */
    const hasUnsavedChanges = () => currentPageData[1].content !== updatedPageContent

    /* Shows warning before page is reloaded if there are unsaved changes */
    useBeforeunload(() => {
        if (hasUnsavedChanges() && showWarnings) {
            return "Unsaved changes will be lost, would you like to continue?"
        }
    })

    /* Handles publishing changes made to the page */
    const handlePublishChanges = () => {
        // Close the popup button
        document.getElementById("popup-close-button").click()

        if (!hasUnsavedChanges()) {
            // If there are no unsaved changes then there are no changes to publish
            setAlertPopup((prevState => ({
                ...prevState,
                showAlert: true,
                alertType: "alert",
                alertTitle: "No changes to publish.",
                alertMessage: ""
            })))
        } else {
            if (currentPageData[0]) {
                // Make sure page content is not set to be empty
                if (!updatedPageContent.trim().length) {
                    setAlertPopup((prevState => ({
                        ...prevState,
                        isLoading: false,
                        alertTitle: "Error",
                        alertMessage: "Page content cannot be empty."
                    })))
                }
                // Set loading alert
                setAlertPopup({
                    showAlert: true,
                    alertType: "loading",
                    isLoading: true,
                    alertTitle: "Publishing changes...",
                    alertMessage: ""
                })
                // Update changes
                publishContentChanges(currentPageData[0], updatedPageContent).then(() => {
                    setAlertPopup((prevState => ({
                        ...prevState,
                        showAlert: false
                    })))
                    setShowWarnings(false)
                    window.location.href = '/cms-dashboard/publish-content-success'
                }, () => {
                    setAlertPopup((prevState => ({
                        ...prevState,
                        isLoading: false,
                        alertTitle: "Error",
                        alertMessage: "An error occurred when attempting to update page content."
                    })))
                })
            }
        }
    }

    /* Handles reverting changes that have been made */
    const handleRevert = () => {
        document.getElementById("popup-close-button").click()
        if (currentPageData[1].content === updatedPageContent) {
            setAlertPopup((prevState => ({
                ...prevState,
                showAlert: true,
                alertType: "alert",
                alertTitle: "No changes have been made.",
                alertMessage: ""
            })))
        } else {
            setUpdatedPageContent(currentPageData[1].content)
            setAlertPopup((prevState => ({
                ...prevState,
                showAlert: true,
                alertType: "alert",
                alertTitle: "Changes have been reverted.",
                alertMessage: ""
            })))
            window.scroll({
                top: 275,
                behavior: 'smooth'
            });
        }
    }

    /* Get current page data when the component mounts */
    useEffect(() => {
        if (!currentPageData) {
            getCurrentPageContent(props.page.path).then(({docID, content}) => {
                setCurrentPageData([docID, content])
            })
        }
    }, [])

    /* Set the updated page content if the currentPage data is modified */
    useEffect(() => {
        if (!updatedPageContent && currentPageData) {
            setUpdatedPageContent(currentPageData[1].content)
        }
    }, [currentPageData])

    /* Returns display date for the lastModified date */
    function lastModifiedDate() {
        if (currentPageData) {
            const [date] = currentPageData[1].lastModified.split("@")
            return getDisplayDate(date)
        }
        return ""
    }

    return (
        currentPageData ? (
            <>
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
                <div className="edit-page-content">
                    <h1>Edit {props.page.name}</h1>
                    <div className='update-info'>
                        <p>
                            <i className="fas fa-info-circle"/>
                            <span className="info"> Last Updated on {lastModifiedDate()}</span>
                        </p>
                    </div>
                    <SitePage
                        isPreview={true}
                        page={props.page}
                        pageContent={updatedPageContent}
                    />
                    <div className="editor">
                        <AdvancedEditor
                            setContent={setUpdatedPageContent}
                            initialContent={updatedPageContent}
                            helpText={"The content of a page can contain images, Tweets, YouTube videos, and more."}
                        />
                    </div>
                    <hr/>
                    <h2>Finished?</h2>
                    <div className="options-section">
                        <div className="revert-changes">
                            <ToolTipPopup
                                triggerIcon={<div
                                    id="revert-icon"
                                    className="icon"
                                >
                                    <i className="fas fa-history fa-7x"/>
                                </div>}
                                prompt={"Revert changes?"}
                                triggerIconText={"Revert Changes"}
                                onClickAction={handleRevert}
                            />
                        </div>
                        <div className="publish-changes">
                            <ToolTipPopup
                                triggerIcon={<div
                                    id="publish-icon"
                                    className="icon"
                                >
                                    <i className="far fa-newspaper fa-7x"/>
                                </div>}
                                prompt={"Publish changes?"}
                                triggerIconText={"Publish Changes"}
                                onClickAction={handlePublishChanges}
                            />
                        </div>
                    </div>
                </div>
            </>) :
            <div className="loading">
                <h2>Fetching current page data...</h2>
                <div className="lds-ellipsis">
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>
            </div>
    );
}

export default EditPageContent