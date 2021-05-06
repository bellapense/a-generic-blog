import React from "react";
import {Link} from "react-router-dom";
import {getDisplayDate} from "../siteLogic";

/* Styles */
import '../../../styles/article.css';

/**
 * ArticleTile responsively displays a preview for an article. The article tile will either be in the "Large" size
 * or the "Medium" size. For multimedia articles, tile should have "multimedia" css class added.
 * @param props
 * Expected props
 */
function ArticleTile (props) {
    // Get the display date from the format stored in the database
    let displayDate
    if (!props.placeholder) {
        displayDate = getDisplayDate(props.updated ? props.updated : props.posted)
    }

    // Placeholder loading version of the large article tile (rectangle shape)
    const placeholderTileLarge = (<div className="placeholder article-tile large">
        <div className="article-preview">
            <div className="tile-image-container">
                <div className="placeholder-image"/>
            </div>
            <div className="preview-content">
                <h2/>
                <h2 className="half"/>
                <p className="author-date"/>
                <p/>
                <p/>
                <p className="half"/>
            </div>
        </div>
    </div>)

    // Placeholder loading version of the large article tile (square shape)
    const placeholderTileMedium = (<div className="placeholder article-tile medium">
        <div className="preview-header">
            <h2/>
            <h2 className="half"/>
        </div>
        <div className="article-preview">
            <div className="tile-image-container">
                <div className="placeholder-image"/>
            </div>
            <div className="preview-content">
                <p className="author-date"/>
                <p/>
                <p/>
                <p className="half"/>
            </div>
        </div>
    </div>)

    // Large tile to display if data has loaded
    const largeTile = (<div className="article-tile large">
        <Link to={props.articleURL ? props.articleURL : "/"} onClick={ (event) => {
            if(!props.articleURL) {
                event.preventDefault()
            }
        }}>
        <div className="article-preview">
            <div className="tile-image-container">
                <img src={props.coverPhoto} alt={props.coverPhotoDesc}/>
                {props.numberPhotos ? <div className="number-photos">
                    <p>{props.numberPhotos} <i className="far fa-images"/></p>
                </div> : null}
            </div>
            <div className="preview-content">
                <h2>{props.articleTitle}</h2>
                <p className="author-date">{props.author ? "By " + props.author + " - Updated" : ""} {displayDate}</p>
                <p className="preview-text">{props.previewText}</p>
            </div>
        </div>
        </Link>
    </div>)

    // Medium tile if data has been loaded
    const mediumTile = (<div className="article-tile medium">
        <Link to={props.articleURL ? props.articleURL : "/"} onClick={ (event) => {
            if(!props.articleURL) {
                event.preventDefault()
            }
        }}>
        <div className="preview-header">
            <h2>{props.articleTitle}</h2>
        </div>
        <div className="article-preview">
            <div className="tile-image-container">
                <img src={props.coverPhoto} alt={props.coverPhotoDesc}/>
                {props.numberPhotos ? <div className="number-photos">
                    <p>{props.numberPhotos} <i className="far fa-images"/></p>
                </div> : null}
            </div>
            <div className="preview-content">
                <p className="author-date">{props.author ? "By " + props.author + " - Updated" : ""} {displayDate}</p>
                <p className="preview-text">{props.previewText}</p>
            </div>
        </div>
        </Link>
    </div>)

    // Group the "real" tiles
    const tiles = <>
        {largeTile}
        {mediumTile}
    </>

    // Group the placeholder tiles
    const placeholderTiles = <>
        {placeholderTileLarge}
        {placeholderTileMedium}
    </>

    return (
        <>
            {props.placeholder ? placeholderTiles : tiles}
        </>
    );
}

export default ArticleTile;