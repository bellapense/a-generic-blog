import React from "react";
import Popup from "reactjs-popup";

import "../../../styles/site-alert.css"

/**
 * Returns a SiteAlert component.
 *
 * Required props:
 *  1. showAlert (bool) - true to show alert
 *  2. alertTitle (string) - the title of the alert
 *  3. onConfirm (function) - function to execute on click of confirm button (should at least setShowAlert(false))
 *  4. alertType (string) - the type/style of alert:
 *          a) "loading"
 *              -> additional required props: isLoading (bool) - true if currently loading
 *          b) "confirmation"
 *              -> additional required props: onCancel (function) - on click of cancel button
 *          c) "alert"
 *
 * Optional props for all alerts:
 *  1. alertMessage (string) - displays below the alert title.
 *
 * --
 * (If you add an alert type then be sure to document it here)
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function SiteAlert (props) {
    let typeContent
    switch (props.alertType) {
        case "loading":
            typeContent = (<>
                <div className="status">
                    {props.isLoading ?
                        <div className="lds-ellipsis">
                            <div/><div/><div/><div/>
                        </div> : <div className="success">
                            <div
                                className="site-button"
                                onClick={props.onConfirm}
                            >
                                <p>Okay</p>
                            </div>
                        </div>}
                </div>
                </>
            )
            break;
        case "confirmation":
            typeContent = (
                <div className="options">
                    <div
                        className="site-button confirm" onClick={props.onConfirm}
                    >
                        <p>{props.confirmText ? props.confirmText : "Confirm"}</p>
                    </div>
                    <div
                        className="site-button cancel" onClick={props.onCancel}
                    >
                        <p>{props.cancelText ? props.cancelText : "Cancel"}</p>
                    </div>
                </div>
            )
            break
        case "alert":
            typeContent = (
                <div className="confirm">
                    <div
                        className="site-button" onClick={props.onConfirm}
                    >
                        <p>Okay</p>
                    </div>
                </div>
            )
            break
        default:
            typeContent = (
                <div className="confirm">
                    <div
                        className="site-button" onClick={props.onConfirm}
                    >
                        <p>Okay</p>
                    </div>
                </div>
            )
    }
    return (
        <div>
            <Popup open={props.showAlert} closeOnDocumentClick={false}>
                <div className="site-alert-popup">
                    <div>
                        <div className="site-alert-content">
                            <h1>{props.alertTitle}</h1>
                            <hr/>
                            <p className="alert-message">{props.message}</p>
                            {typeContent}
                        </div>
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default SiteAlert