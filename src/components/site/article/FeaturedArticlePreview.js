import React from "react"

import {Link} from "react-router-dom"
import "../../../styles/featured-article-preview.css"
import {getCategoryIcon, getDisplayDate} from "../siteLogic";

function FeaturedArticlePreview(props) {
    const placeholderPreview = (
        <div className="featured-article-preview article-tile placeholder">
            <div>
                <div className="image-container">
                    <div className="placeholder-image"/>
                </div>
            </div>
            <div className="preview-content">
                <p className="author-date"/>
                <p/>
                <p/>
                <p className="half"/>
            </div>
        </div>
    )
    let preview = null
    if (props.featuredPreview) {
        const displayDate = getDisplayDate(props.featuredPreview.dateTime.split("@")[0])
        preview = (
            <>
            <div className="featured-article-preview">
                <Link to={props.featuredPreview.articleURL}>
                    <div className="image-container">
                        <h2>{getCategoryIcon(props.featuredPreview.category.path)} {props.featuredPreview.title}</h2>
                        <img src={props.featuredPreview.coverPhotoURL} alt="placeholder"/>
                        {props.featuredPreview.numberPhotos ? <div className="number-photos">
                            <p>{props.featuredPreview.numberPhotos} <i className="far fa-images"/></p>
                        </div> : null}
                    </div>
                </Link>
                <div className="preview-content">
                    <p className="author-date">{props.featuredPreview.author ? "By " + props.featuredPreview.author + " - Updated" : ""} {displayDate}</p>
                    <p className="preview-text">{props.featuredPreview.abstract}</p>
                    <div className="site-button">
                        <Link to={props.featuredPreview.articleURL}>
                            {props.featuredPreview.buttonText ? props.featuredPreview.buttonText : "Read more"} <i className="fas fa-arrow-right"/>
                        </Link>
                    </div>
                </div>
            </div>
            </>
        )
    }
    return (
        props.featuredPreview ? preview : placeholderPreview
    )
}

export default FeaturedArticlePreview;