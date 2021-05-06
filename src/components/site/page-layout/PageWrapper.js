import React, {useEffect} from "react"
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import { withStore } from "../../../hocs/dataStore";

import Header from "./Header";

function PageWrapper(props) {
    /* Effect to load initial data on component mount */
    useEffect(() => {
        // Checking to see if "/most-recent" articles have been pulled because those are only pulled on
        // the initial data fetch - so if they don't exist then that hasn't been done yet.
        if (!props.store["/most-recent"]) {
             props.store.fetchInitial()
        }
    }, [])

    /* Set the most recent and featured posts */
    let mostRecentPosts = []
    let featuredPosts= []
    if (props.store["/most-recent"]) {
        mostRecentPosts = props.store["/most-recent"].mostRecent
        featuredPosts = props.store["/featured"].mostRecent
    }

    return(
        <>
            <Header />
            <div className="two-col-layout">
                <div className="content">
                    {props.pageContent}
                </div>
                <Sidebar
                    mostRecentArticles={mostRecentPosts}
                    featuredPosts={featuredPosts}
                />
            </div>
            <Footer />
        </>)
}

export default withStore(PageWrapper);