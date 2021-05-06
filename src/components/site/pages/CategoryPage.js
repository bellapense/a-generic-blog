import React, {useEffect} from "react";
import FeaturedArticlePreview from "../article/FeaturedArticlePreview";
import ArticleTile from "../article/ArticleTile";

/* Styles */
import "../../../styles/category-page.css"

import {withStore} from "../../../hocs/dataStore";

function CategoryPage(props) {

    useEffect(() => {

    }, [])

    const placeholderArticles = (
        <>
            <ArticleTile placeholder={true} />
            <ArticleTile placeholder={true} />
            <ArticleTile placeholder={true} />
            <ArticleTile placeholder={true} />
            <ArticleTile placeholder={true} />
        </>
    )

    let articlesData = []
    let handleLoadMore = () => {}
    let canLoadMore = false
    if (props.store["/most-recent"]) {
        articlesData = props.store[props.category.path].mostRecent
        canLoadMore = props.store[props.category.path].canLoadMore
        canLoadMore ? handleLoadMore = () => {
            props.store.fetchMoreArticles(props.category.path)
        } : handleLoadMore = () => {}
    }

    let featuredPreview = null
    const articles = (
        articlesData.map((article, index) => {
            if (index === 0) {
                featuredPreview = article
            } else {
                return (
                    <div key={`additional-article-${index}`}>
                        <ArticleTile
                            coverPhoto={article.coverPhotoURL}
                            coverPhotoDesc={article.coverPhotoDesc}
                            isFeatured={article.isFeatured}
                            articleTitle={article.title}
                            author={article.author}
                            updated={article.dateTime.split("@")[0]}
                            posted={article.originalCreationDate}
                            previewText={article.abstract}
                            articleURL={article.articleURL}
                        />
                    </div>
                )
            }
        })
    )

    return (
        <div className="category-page">
            <div className="page-header">
                <h1>{props.category.name}</h1>
                <FeaturedArticlePreview featuredPreview={featuredPreview}/>
            </div>

            <div className="page-content">
                <div className="article-preview-tiles">
                    <h2>Recent in {props.category.name}</h2>
                    {articles.length ? articles : placeholderArticles}
                    <div className={`site-button ${canLoadMore ? "" : "hidden"}`} onClick={() => handleLoadMore()}>
                        <p>Load More</p>
                    </div>
                </div>
            </div>
        </div>)
}

export default withStore(CategoryPage)