import React from "react";
import {Link} from "react-router-dom";

/* Styles */
import '../../../styles/article.css';

/**
 * Component that displays 3 article tiles for the specified category and links to the category page at the bottom
 * with the "See All" link.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function ArticleCategory(props) {
    return (
        <div className="article-category">
            <h2>{props.categoryName}</h2>
            {props.tile1}
            {props.tile2}
            {props.tile3}
            <div className="site-button">
                <Link to={props.link}>See All</Link>
            </div>
        </div>
    );
}

export default ArticleCategory;