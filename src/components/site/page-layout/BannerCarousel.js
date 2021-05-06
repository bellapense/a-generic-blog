import React from "react"
import Carousel from "react-elastic-carousel";
import "../../../styles/banner-carousel.css"
import {Link} from "react-router-dom";
import {getCategoryIcon} from "../siteLogic";


const BannerCarousel = (props) => {
    let gallerySlides = (
        props.featuredPosts.map((post, index) =>
            <div className="item-container" key={`post-${index}`}>
                <div className="item">
                    <div className="img-container">
                        <div className="img-caption">
                            <h2>{getCategoryIcon(post.category.path)} {post.title}</h2>
                            <div className="site-button">
                                <Link to={post.articleURL}>
                                    Read Now <i className="fas fa-arrow-right"/>
                                </Link>
                            </div>
                        </div>
                        <img src={post.coverPhotoURL} alt={post.coverPhotoDesc}/>
                    </div>
                </div>
            </div>
        )
    )

    return (
        <div id="banner-carousel" className={`banner-carousel ${props.featuredPosts.length ? "" : "placeholder"}`}>
            <Carousel
                isRTL={false}
                enableSwipe={true}
                enableMouseSwipe={false}
                key={new Date().getTime()}
            >
                {gallerySlides}
            </Carousel>
        </div>
    )
}

export default BannerCarousel