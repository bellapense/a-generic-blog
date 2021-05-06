import React from "react";
import {withStore} from "../../../hocs/dataStore";

/**
 * The custom sidebar ad.
 * @param props
 * Expected props:
 *      imageURL = the link for the ad image
 *      linkURL = the link that user will be directed to if ad is clicked
 *      desc = description on hovering over the ad
 * @returns {JSX.Element}
 * @constructor
 */
function SidebarAd (props) {
    let sidebarAd = null
    if (props.store["sidebar"]) {
        const adData = props.store["sidebar"]
        if (adData.imageURL) {
            sidebarAd = {
                imageURL:adData.imageURL,
                linkURL: adData.linkURL,
                desc: adData.desc,
            }
        }
    }

    return (sidebarAd ?
        <div className="custom-sidebar">
            <a href={sidebarAd.linkURL} target="_blank" rel="noreferrer" >
                <img src={sidebarAd.imageURL} alt={sidebarAd.desc} />
            </a>
        </div> : <></>
    )
}

export default withStore(SidebarAd);