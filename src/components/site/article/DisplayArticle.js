import React, {useEffect, useState} from "react";
import {withStore} from "../../../hocs/dataStore";
import {useLocation, Redirect} from "react-router-dom";

import Article from "./Article";
import ArticleTile from "./ArticleTile";

/**
 * Component that handles displaying a standard article and related previews based on the current pathname.
 * Redirects to 404 if no article exists.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function DisplayArticle(props) {
    /* Get the current pathname */
    const { pathname } = useLocation()

    /* States that store article data, related articles, or if the page should redirect */
    const [matchedArticle, setMatchedArticle] = useState(null)
    const [relatedArticles, setRelatedArticles] = useState([])
    const [shouldRedirect, setShouldRedirect] = useState(false)

    /* Function that handles requesting article data from the data store. */
    const getArticle = () => {
        // Request getting the article from URL from the datastore
        props.store.getArticleFromURL(pathname, "classic-posts").then((match) => {
            // If we found a match, grab the related articles for it
            if (match) {
                let related = []
                props.store[match.category.path].mostRecent.forEach(article => {
                    if (article.articleURL !== match.articleURL) {
                        related.push(article)
                    }
                })
                // Set matched article, related previews to re-render & replace placeholder or previous article
                setMatchedArticle(match)
                setRelatedArticles(related)
            } else {
                // If no article was matched, then set the redirect to true
                setShouldRedirect(true)
            }
        })
    }

    /* This effect runs when the pathname changes, or the store updates with data. */
    useEffect(() => {
        // If initial data has been loaded, then attempt to get the article
        if (props.store["/most-recent"]) {
            getArticle()
        }
    }, [pathname, props.store])


    // Convert related articles to list of previews
    let relatedArticlePreviews = null
    if (relatedArticles.length) {
        relatedArticlePreviews = relatedArticles.map((article, index) => {
            return (<div key={`related-article-${index}`}>
                <ArticleTile
                    coverPhoto={article.coverPhotoURL}
                    coverPhotoDesc={article.coverPhotoDesc}
                    isFeatured={article.isFeatured}
                    articleTitle={article.title}
                    author={article.author}
                    posted={article.dateTime.split("@")[0]}
                    previewText={article.abstract}
                    articleURL={article.articleURL}
                />
            </div>)
        })
    }

    /* Set the custom ad if one exists
    *
    let articleAd = null
    if (props.store["/most-recent"]) {
        if (props.store["article"].imageURL) {
            articleAd = {
                imageURL: props.store["article"].imageURL,
                linkURL: props.store["article"].linkURL,
                desc: props.store["article"].desc,
            }
        }
    }
    * */


    return (
        <>
            {matchedArticle ?
                <div>
                    <Article
                        articleTitle={matchedArticle.title}
                        isFeatured={matchedArticle.isFeatured}
                        coverPhoto={matchedArticle.coverPhotoURL}
                        coverPhotoDesc={matchedArticle.coverPhotoDesc}
                        author={matchedArticle.author}
                        posted={matchedArticle.originalCreationDate}
                        updated={matchedArticle.dateTime.split("@")[0]}
                        editorsNote={matchedArticle.editorsNote}
                        articleBody={matchedArticle.articleBody}
                        authorInfo={matchedArticle.authorInfo}
                        coverPhotoInfo={matchedArticle.coverPhotoInfo}
                        category={matchedArticle.category}
                    />
                    <div className="related-article-previews">
                        <hr/>
                        <h2>Related Articles</h2>
                        <hr/>
                        {relatedArticlePreviews}
                    </div>
                </div> : shouldRedirect ? <Redirect to="/error-404-page-not-found" /> : <Article placeholder={true}/>
            }
        </>
    )
}

export default withStore(DisplayArticle);