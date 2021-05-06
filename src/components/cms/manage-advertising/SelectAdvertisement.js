import React, {useEffect} from "react"

import {Link} from "react-router-dom";

/* Styles */
import "../../../styles/configure-advertising.css"

/**
 * Component for the page where user selects which of the custom ad spots they'd like to configure.
 * @returns {JSX.Element}
 * @constructor
 */
function SelectAdvertisement() {
    /* Runs on component mount to scroll it into view */
    useEffect(() => {
        document.getElementById("content-view").scrollIntoView();
    }, [])

    return (
        <div className="select-advertisement">
            <h1>Configure Advertising</h1>
            <h2>Select an Ad Spot</h2>
            <div className="option-list">
                <div> This can all be changed :)</div>
            </div>
            <Link to={"/cms-home"}>Cancel</Link>
        </div>
    )
}

export default SelectAdvertisement