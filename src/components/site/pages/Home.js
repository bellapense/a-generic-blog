import React from "react";
import ArticleCategory from "../article/ArticleCategory";
import ArticleTile from "../article/ArticleTile";
import {withStore} from "../../../hocs/dataStore";
import {CATEGORIES} from "../../../constants";
import BannerCarousel from "../page-layout/BannerCarousel";

/**
 * The content that appears on the home page. Takes in props for articles.
 * @returns {JSX.Element}
 */
function Home (props) {
    /* Placeholder tile to use when tile data is loading */
    const placeholderTile = (
        <ArticleTile
            placeholder={true}
        />
    )

    /* Build Article categories */
    const postCategories = CATEGORIES.map((category, index) => {
        let posts = []
        if (props.store["/most-recent"]) {
            posts = props.store[category.path].mostRecent
        }
        const tiles = posts.map(post => {
            return (<ArticleTile
                coverPhoto={post.coverPhotoURL}
                coverPhotoDesc={post.coverPhotoDesc}
                isFeatured={post.isFeatured}
                articleTitle={post.title}
                author={post.author}
                posted={post.dateTime.split("@")[0]}
                previewText={post.abstract}
                articleURL={post.articleURL}
            />)
        })
        return (
            <div key={`${category.path}-${index}`}>
                <ArticleCategory
                    categoryName={category.name}
                    tile1={tiles[0] ? tiles[0] : placeholderTile}
                    tile2={tiles[1] ? tiles[1] : placeholderTile}
                    tile3={tiles[2] ? tiles[2] : placeholderTile}
                    link={category.path}
                />
            </div>
        )
    })

    /* The featured posts for carousel */
    let featuredPosts = []
    if (props.store["/featured"]) {
        featuredPosts = props.store["/featured"].mostRecent
    }

    return (
        <div className="home">
            <BannerCarousel
                featuredPosts={featuredPosts}
            />
            {postCategories}
        </div>
    )
}

export default withStore(Home);