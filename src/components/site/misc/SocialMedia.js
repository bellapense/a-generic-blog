import React from "react"

/**
 * Component that displays the social media links for the blog.
 * @returns {JSX.Element}
 * @constructor
 */
const SocialMedia = () => {
    return (
        <div id="site-social-media">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
                <i className="fab fa-facebook fa-3x"/>
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noreferrer">
                <i className="fab fa-twitter fa-3x"/>
            </a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
                <i className="fab fa-instagram fa-3x"/>
            </a>
        </div>
    )
}

export default SocialMedia