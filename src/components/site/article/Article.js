import React, {useEffect} from "react"

import ReactHtmlParser from "react-html-parser"
import {appendTwitterScript, setLinkAttributes, getDisplayDate, findAndReplaceEmail} from "../siteLogic"
import {Link} from "react-router-dom";

/* Styles */
import "../../../styles/article.css"
import {CATEGORIES} from "../../../constants";
import SharePostOptions from "./SharePostOptions";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Article (props) {
    /* Effect runs on mount */
    useEffect(() => {
            const article = document.getElementById("article")
            // Append script for displaying tweets
            appendTwitterScript(article)
            // Add attributes to links that force them to open in a new tab
            setLinkAttributes(article)
    }, [])

    /* Effect runs when article body is initialized and ads the the article ad if one exists
    useEffect(() => {
        if (props.articleAd) {
            // If there is an article ad to add then add the ad
            const articleBody = document.getElementById("article-body")
            addArticleAd(articleBody, props.articleAd)
        }
    }, [props.articleBody, props.articleAd])
    * */


    // Converts the date to display form off of the format stored in the database
    let displayPostDate
    let displayUpdatedDate
    if (!props.placeholder) {
        displayUpdatedDate = getDisplayDate(props.updated)
        displayPostDate = getDisplayDate(props.posted)
    }

    let postCategory = null
    if (props.category && props.category.name) {
        CATEGORIES.forEach((category) => {
            if (category.path === props.category.path) {
                postCategory = (<div className="article-category">
                    {props.isPreview ? <p>{category.icon} {category.name}</p>
                        : <Link to={category.path}>{category.icon} {category.name}</Link>}
                </div>)
            }
        })
    }



    // The placeholder article that displays when the article is loading
    const placeholderArticle = (<div className="placeholder article" id="article">
            <h1/>
            <h1 className="half"/>
            <div className="article-header">
                <p className="author-date"/>
                <div className="cover-image section">
                    <div className="placeholder-image"/>
                    <p className="half"/>
                </div>
                <div className="share-links section">
                    <span><i className="fab fa-facebook fa-2x"/></span>
                    <span><i className="fab fa-twitter fa-2x"/></span>
                    <span><i className="far fa-envelope fa-2x"/></span>
                </div>
            </div>
            <hr/>
            <div className="article-body">
                <p/>
                <p/>
                <p/>
                <p/>
                <p/>
                <p className="half"/>
            </div>
            <hr/>
            <div className="article-footer">
                <div className="info section">
                    <p/>
                    <p/>
                </div>
                <SharePostOptions isPlaceholder={true}/>
            </div>
        </div>)

    // The article itself
    const article = (<div className="article" id="article">
        <h1>{props.articleTitle}</h1>
        <div className="article-header">
            {postCategory}
            <p className="section author">
                By {props.author} on {displayPostDate}
                {props.updated !== props.posted ? ` - Updated ${displayUpdatedDate}` : ''}
            </p>
            <div className="cover-image section">
                <img src={props.coverPhoto} alt={props.coverPhotoDesc} id="article-cover-photo"/>
                <p>{props.coverPhotoDesc}</p>
            </div>
            <SharePostOptions isPlaceholder={props.placeholder}/>
        </div>
        <hr/>
        <div className="article-body" id="article-body">
            {props.editorsNote ? <div className="editors-note">{props.editorsNote}</div> : null}
            {ReactHtmlParser(props.articleBody)}
        </div>
        <hr/>
        <div className="article-footer">
            <div className="info section">
                <p dangerouslySetInnerHTML={{__html: props.authorInfo ? findAndReplaceEmail(props.authorInfo) : props.authorInfo}} />
                {props.coverPhotoInfo ?  <p dangerouslySetInnerHTML={{__html: props.coverPhotoInfo ? findAndReplaceEmail(props.coverPhotoInfo) : ""}} /> : null}
            </div>
            <SharePostOptions isPlaceholder={props.placeholder}/>
        </div>
    </div>)

    return (
        <>
            {props.placeholder ? placeholderArticle : article}
        </>
    )
}

export default Article