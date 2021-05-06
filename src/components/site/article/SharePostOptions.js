import React from "react"
import {SITE_NAME} from "../../../constants";

// TODO: Needs to be build out - FB dev account required and I don't feel like doing that

const ShareOptions = (props) => {
    const placeholderOptions = (
        <div className="share-links section">
            <span><i className="fab fa-facebook fa-2x"/></span>
            <span><i className="fab fa-twitter fa-2x"/></span>
            <span><i className="fab fa-pinterest fa-2x"/></span>
            <span><i className="far fa-envelope fa-2x"/></span>
            <span><i className="fas fa-share-alt fa-2x"/></span>
        </div>
    )

    const handleEmail = () => {
        const subject = "I think you'd like this post!"
        const body = `Check out this post on '${SITE_NAME}': ${window.location.href}`
        window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    }

    const handleTwitter = () => {
        const subject = "I think you'd like this post!"
        window.open(`https://twitter.com/intent/tweet/?text=${encodeURIComponent(subject)}&url=${encodeURIComponent(window.location.href)}`
        )
    }

    const shareOptions = (
        <div className="share-links section">
            <span><i className="fab fa-facebook fa-2x"/></span>
            <span onClick={handleTwitter}><i className="fab fa-twitter fa-2x"/></span>
            <span><i className="fab fa-pinterest fa-2x"/></span>
            <span onClick={handleEmail}><i className="far fa-envelope fa-2x"/></span>
            <span><i className="fas fa-share-alt fa-2x"/></span>
        </div>
    )


    return (props.isPlaceholder ? placeholderOptions : shareOptions)
}

export default ShareOptions