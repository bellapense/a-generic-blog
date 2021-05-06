import React, { useEffect } from "react";

/* Styles */
import "../../../styles/sidebar.css";
import {Link} from "react-router-dom";
import SidebarAd from "../custom-ads/SidebarAd";

import {getCategoryIcon} from "../siteLogic";

/**
 * The Sidebar component is the sidebar that appears on every page of the main website. It houses the sections that
 * display the most recent articles, custom sidebar ad, social media widgets, and in the future GoogleAds.
 */
function Sidebar (props) {
    useEffect(() => {
        const twitterScript = document.createElement("script");
        twitterScript.setAttribute("async", "")
        twitterScript.setAttribute("defer", "")
        twitterScript.setAttribute("crossOrigin", "none")
        twitterScript.setAttribute("src", "https://platform.twitter.com/widgets.js");
        document.getElementById("twitter-widget").appendChild(twitterScript)
    }, [])

    /* Display tile links for recent posts */
    const mostRecentPosts = (
        props.mostRecentArticles.map((article, index) => (
            <div className="article-link" key={`recent-headline-${index}`}>
                <Link to={article.articleURL}>{getCategoryIcon(article.category.path)} {article.title}</Link>
            </div>
        ))
    )

    /* Display tile links for featured posts */
    const featuredPosts = (
        props.featuredPosts.map((article, index) => (
            <div className="article-link" key={`recent-headline-${index}`}>
                <Link to={article.articleURL}>{getCategoryIcon(article.category.path)} {article.title}</Link>
            </div>
        ))
    )

    /* Placeholder headlines */
    let placeholderHeadlines = []
    for (let i = 0; i < 8; i++) {
        placeholderHeadlines.push(
            <div className="placeholder-link" key={`placeholder-headline-${i}`}>
                <p/>
                <p className="half"/>
            </div>
        )
    }

    return (
        <div className="sidebar">
            {/* Most Recent Posts */}
            <div className="most-recent">
                <h2>Recent Posts</h2>
                <hr/>
                {mostRecentPosts.length ? mostRecentPosts : placeholderHeadlines}
            </div>
            {/* Featured Posts */}
            <div className="featured">
                <h2>Featured Posts</h2>
                <hr/>
                {featuredPosts.length ? featuredPosts : placeholderHeadlines}
            </div>
            {/* Sidebar custom ad */}
            <SidebarAd />
            {/* Facebook TODO: Requires a developer account.

            <div className="facebook">
                <h2>Follow us on Facebook</h2>
                <hr/>
                <p>Requires a facebook developer account.</p>
            </div>
            */}
            {/* Twitter */}
            <div className="twitter">
                <h2>Follow us on Twitter</h2>
                <hr/>
                <div id="twitter-widget">
                    <a className="twitter-timeline" data-width="340" data-height="500"
                       href="https://twitter.com/Twitter?ref_src=twsrc%5Etfw">Our Tweets</a>
                </div>
            </div>
            {/* Instagram TODO: Requires account credentials / replace with placeholder.
            <div className="instagram">
                <h2>Follow us on Instagram</h2>
                <hr/>
                <p>Requires a facebook developer account.</p>
            </div>
            */}

        </div>
    );
}

export default Sidebar;