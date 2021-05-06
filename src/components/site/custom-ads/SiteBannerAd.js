import React from "react"
import {withStore} from "../../../hocs/dataStore";

/**
 * The custom banner ad.
 * @param props
 * Expected props:
 *      imageURL = the link for the ad image
 *      linkURL = the link that user will be directed to if ad is clicked
 *      desc = description on hovering over the ad
 * @returns {JSX.Element}
 * @constructor
 */
function SiteBannerAd (props) {
    let siteBannerAd = null
    if (props.store["site-banner"]) {
        const adData = props.store["site-banner"]
        if (adData.imageURL) {
            siteBannerAd = {
                imageURL:adData.imageURL,
                linkURL: adData.linkURL,
                desc: adData.desc,
            }
        }
    }

    return (siteBannerAd ?
            <div className="custom-site-banner">
                <a href={siteBannerAd.linkURL} target="_blank" rel="noreferrer">
                    <img src={siteBannerAd.imageURL} alt={siteBannerAd.desc} />
                </a>
            </div> : <></>
    )
}

export default withStore(SiteBannerAd)