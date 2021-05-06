import React from "react"
import ArticleListItem from "./ArticleListItem"
import {getDisplayDate} from "../../site/siteLogic";
import placeholder from "../../../images/default-image.png"
import {Link} from "react-router-dom";

/**
 * Component that holds a list of <ArticleListItem /> components. Displays placeholders while they are loading
 * can be used for all article types and drafts.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function ArticleListContainer(props) {
    // Placeholder loading articles list items
    const loadingArticles = (
        <div className="placeholder">
            <ArticleListItem placeholder={true} canEdit={!!props.handleEdit}/>
            <ArticleListItem placeholder={true} canEdit={!!props.handleEdit}/>
            <ArticleListItem placeholder={true} canEdit={!!props.handleEdit}/>
            <ArticleListItem placeholder={true} canEdit={!!props.handleEdit}/>
            <ArticleListItem placeholder={true} canEdit={!!props.handleEdit}/>
        </div>
    )

    // Array for storing the article list items.
    let articles = []

    // For standard articles
    if (props.articles) {
        articles = props.articles.map(([docID, article], index) => {
            return (
                <div key={`article-${index}`}>
                    <ArticleListItem
                        coverPhotoURL={article.coverPhotoURL}
                        coverPhotoDesc={article.coverPhotoDesc}
                        title={article.title}
                        updatedDate={getDisplayDate(article.dateTime.split("@")[0])}
                        author={article.author}
                        handleEdit={() => props.handleEdit(docID)}
                        handleDelete={() => props.handleDelete(docID, article)}
                    />
                </div>
            )
        })
    }

    // For article drafts
    if (props.drafts) {
        articles = props.drafts.map(([docID, articleDraft], index) => {
            return (
                <div key={`article-draft-${index}`}>
                    <ArticleListItem
                        coverPhotoURL={articleDraft.coverPhotoURL ? articleDraft.coverPhotoURL : placeholder}
                        coverPhotoDesc={articleDraft.coverPhotoDesc ? articleDraft.coverPhotoDesc : "no image uploaded"}
                        title={articleDraft.title}
                        updatedDate={getDisplayDate(articleDraft.dateTime.split("@")[0])}
                        author={articleDraft.author}
                        isDraft={true}
                        handleEdit={() => props.handleEdit(docID)}
                        handleDelete={() => props.handleDelete(docID, articleDraft)}
                    />
                </div>
            )
        })
    }

    // Displays this when none exist
    const noneExist = (<div className="none-exist">
        <p>None exist.</p>
        <div className="site-button">
            <Link to="/cms-dashboard/create-classic">
                Create a new post <i className="fas fa-pencil-alt"/>
            </Link>
        </div>
    </div>)

    return (
        <div className="article-list-container">
            {articles.length ? articles : props.canLoadMore ? loadingArticles : noneExist}
            {props.canLoadMore ?
                <div className="site-button" onClick={props.handleLoadMore}>
                    <p>Load More</p>
                </div> :
                <></>
            }
        </div>
    )
}

export default ArticleListContainer