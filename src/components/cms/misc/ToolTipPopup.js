import React from "react";
import Popup from "reactjs-popup";

/* Styles */
import "../../../styles/tooltip-popup.css"

/**
 * Tool tip popup that appears when the trigger prop is clicked.
 * @param props
 * @returns {JSX.Element}
 */
const ToolTipPopup = (props) => {
    return (
        <span>
            <Popup trigger={props.triggerIcon} position="top center"
            >
                {close => (
                    <div className={`tooltip-popup ${props.danger ? "danger" : ""}`}>
                        <div className="popup-container">
                            <div className="popup-body">
                                <div className="close" id="popup-close-button" onClick={close}>
                                    &times;
                                </div>
                                <h1>{props.prompt}</h1>
                                {props.danger ? <p>This action is permanent and <i>cannot</i> be undone.</p> : null}
                                    <div
                                        onClick={props.onClickAction}
                                        className="site-button"
                                    >
                                        <p>Confirm</p>
                                    </div>
                            </div>
                        </div>
                    </div>
                )}
            </Popup>
            <p>{props.triggerIconText}</p>
        </span>
    )
}

export default ToolTipPopup