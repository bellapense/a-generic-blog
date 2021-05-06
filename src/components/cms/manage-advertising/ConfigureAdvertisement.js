import React, {useEffect, useState} from "react"

import {useBeforeunload} from "react-beforeunload";
import {useAuth} from "../../../contexts/AuthContext";
import ToolTipPopup from "../misc/ToolTipPopup";
import SiteAlert from "../misc/SiteAlert";
import {fetchCurrentAd, updateCustomAd} from "./manageAdvertisingLogic";

/* Placeholder Images */
import placeholderSquare from "../../../images/default-image-square.png"
import placeholderBanner from "../../../images/default-image-banner.jpg"

/* Styles */
import "../../../styles/configure-advertising.css"

/**
 * Component for configuring one of the custom ads in the CMS. Takes the ad type as a prop.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function ConfigureAdvertisement(props) {
    /* Store the current user's email/username */
    const { currentUser } = useAuth();
    const username = currentUser.email;

    /* State for the ad */
    const [ad, setAd] = useState({
        file: null,
        imageURL: "",
        desc: "",
        link: "",
    })

    /* Initial ad for diffing changes made */
    const [initialAd, setInitialAd] = useState({
        documentID: "",
        imagePath: "",
        imageURL: "",
        desc: "",
        link: "",
    })

    /* Site alert state for displaying custom popup/prompt */
    const [alertPopup, setAlertPopup] = useState({
        showAlert: false,
        alertType: 'loading',
        isLoading: true,
        alertTitle: "",
        alertMessage: "",
        confirm: () => {
            setAlertPopup(prevState => ({
                ...prevState,
                showAlert: false
            }))
        },
        cancel: () => {
            setAlertPopup(prevState => ({
                ...prevState,
                showAlert: false
            }))
        }
    })

    /* State to determine if warnings should be shown */
    const [showWarnings, setShowWarnings] = useState(true)

    /* Shows warning before page is reloaded if there are unsaved changes */
    useBeforeunload(() => {
        if (hasUnsavedChanges() && showWarnings) {
            return "Unsaved changes will be lost, would you like to continue?"
        }
    });

    /* Variables specific to the ad type */
    let adType
    let placeholderAd
    switch (props.advertisement) {
        case "site-banner":
            adType = "Site Banner Ad"
            placeholderAd = placeholderBanner
            break
        case "article":
            adType = "Article Ad"
            placeholderAd = placeholderBanner
            break
        case "sidebar":
            adType = "Sidebar Ad"
            placeholderAd = placeholderSquare
    }

    /* Function that determines if there are unsaved changes */
    const hasUnsavedChanges = () => {
        return (
            initialAd.desc !== ad.desc || initialAd.imageURL !== ad.imageURL || initialAd.link !== ad.link)
    }

    /* Function that validates that an ad has a description and a link */
    const validateAd = () => {
        if (ad.file) {
            return (ad.desc.trim().length && ad.link.trim().length)
        } else {
            return true
        }
    }

    /* Function to publish ad changes */
    const handlePublish = () => {
        setAlertPopup(prevState => ({
            ...prevState,
            showAlert: true,
            alertType: "loading",
            isLoading: true,
            alertTitle: "Publishing ad changes...",
            alertMessage: ""
        }))
        updateCustomAd(ad, initialAd, props.advertisement, username).then(() => {
            setShowWarnings(false)
            setAlertPopup((prevState => ({
                ...prevState,
                showAlert: false
            })))
            window.location.href = '/cms-home/publish-content-success'
        })
    }

    /* Function to handle publishing ad changes */
    const confirmPublish = () => {
        // Close popup
        document.getElementById("popup-close-button").click()
        if (!hasUnsavedChanges() || (!initialAd.imageURL && !ad.file)) {
            // No changes to publish
            setAlertPopup((prevState => ({
                ...prevState,
                showAlert: true,
                alertType: "alert",
                alertTitle: "No changes to publish",
                alertMessage: "",
                confirm: () => {
                    setAlertPopup(prevState => ({
                        ...prevState,
                        showAlert: false
                    }))
                }
            })))
        } else if (!validateAd()) {
            // Ad is not valid
            setAlertPopup((prevState => ({
                ...prevState,
                showAlert: true,
                alertType: "alert",
                alertTitle: "Error",
                alertMessage: "Ad description and ad link are required.",
                confirm: () => {
                    setAlertPopup(prevState => ({
                        ...prevState,
                        showAlert: false
                    }))
                }
            })))
        } else if (!ad.file) {
            // The ad spot is set to be empty
            setAlertPopup((prevState => ({
                ...prevState,
                showAlert: true,
                alertType: "confirmation",
                alertTitle: "Set ad spot to be empty?",
                alertMessage: "",
                confirm: () => {
                    handlePublish()
                }
            })))
        } else {
            handlePublish()
        }
    }

    /* Runs on component mount to scroll it into view */
    useEffect(() => {
        document.getElementById("content-view").scrollIntoView();
    }, [])

    /* Gets ad data if it is needed */
    useEffect(() => {
        if (props.advertisement && !initialAd.documentID) {
            fetchCurrentAd(props.advertisement).then((currentData) => {
                setInitialAd({
                    documentID: currentData.docID,
                    imagePath: currentData.ad.imagePath,
                    imageURL: currentData.ad.imageURL,
                    desc: currentData.ad.desc,
                    link: currentData.ad.linkURL,
                })
                setAd({
                    file: currentData.ad.imagePath,
                    imageURL: currentData.ad.imageURL,
                    desc: currentData.ad.desc,
                    link: currentData.ad.linkURL,
                })
            })
        }
    }, [props.advertisement, initialAd.documentID])

    // Get the current ads
    return (
        <div className="configure-advertisement">
            <SiteAlert
                showAlert={alertPopup.showAlert}
                alertType={alertPopup.alertType}
                isLoading={alertPopup.isLoading}
                alertTitle={alertPopup.alertTitle}
                message={alertPopup.alertMessage}
                onConfirm={alertPopup.confirm}
                onCancel={alertPopup.cancel}
            />
            <h1>Configure {adType}</h1>
            <hr/>
            <div className="current-advertisement">
                {/* Ad image */}
                <div className="section center">
                    <h2>{adType}</h2>
                    <img className={`${props.advertisement}-ad`} src={ad.imageURL ? ad.imageURL : placeholderAd} alt={"placeholder for ad"} />
                    <hr />
                    <span className="set-image">
                    <input
                        style={{display: "none"}}
                        type="file"
                        name="ad-image"
                        id="upload-ad-image"
                        accept="image/*"
                        onChange={(event) => {
                            if (event.target.files[0]) {
                                setAd(prevState => ({
                                    ...prevState,
                                    file: event.target.files[0],
                                    imageURL: URL.createObjectURL(event.target.files[0]),
                                }))
                            }
                        }}
                    />
                    <div>
                        <div className="site-button" onClick={() => {
                            document.getElementById("upload-ad-image").click()
                        }}>
                            <p>Upload Image</p>
                        </div>
                        <p className="file-name">{ad.file ? ad.file.name ? ad.file.name : ad.file : "No file uploaded."}</p>
                    </div>
                    <ToolTipPopup
                        triggerIcon={<div
                            id="delete-icon"
                            className="icon"
                        >
                            <i className="fas fa-trash-alt fa-2x"/>
                        </div>}
                        prompt={"Delete ad image?"}
                        triggerIconText={""}
                        onClickAction={() => {
                            setAd(prevState => ({
                                ...prevState,
                                file: null,
                                imageURL: "",
                            }))
                            document.getElementById("popup-close-button").click()
                        }}
                    />
                    </span>
                    <p className="help-text">
                        <i>
                            Tip: To ensure the ad will not be blocked by AdBlockers, do not include the word "ad" in
                            the image file name.
                        </i>
                    </p>
                </div>
                {/* Description for the ad */}
                <div className="section center">
                    <label htmlFor="ad-desc">Ad Description</label>
                    <input
                        type="text"
                        name="ad-desc"
                        id="ad-desc"
                        value={ad.desc}
                        onChange={event => {
                            setAd(prevState => ({
                                ...prevState,
                                desc: event.target.value,
                            }))
                        }}
                    />
                    <p className="help-text">
                        Description of the ad, this text will be used for those using a screen-reader.
                        <br/>
                        <i>
                            EX: Ad for WSU Athletics.
                        </i>
                    </p>
                </div>
                {/* Link for the ad */}
                <div className="section center">
                    <label htmlFor="ad-link">Ad Link</label>
                    <input
                        type="text"
                        name="ad-link"
                        id="ad-link"
                        value={ad.link}
                        onChange={event => {
                            setAd(prevState => ({
                                ...prevState,
                                link: event.target.value,
                            }))
                        }}
                    />
                    <p className="help-text">
                        Link that the user will be taken to when they click on the advertisement.
                    </p>
                </div>
                <hr />
                {/* Publish changes */}
                <div className="submit-section">
                    <ToolTipPopup
                        triggerIcon={<div
                            id="publish-icon"
                            className="icon"
                        >
                            <i className="far fa-newspaper fa-7x"/>
                        </div>}
                        prompt={"Publish changes?"}
                        triggerIconText={"Publish"}
                        onClickAction={confirmPublish}
                    />
                </div>
            </div>
        </div>
    );
}

export default ConfigureAdvertisement;