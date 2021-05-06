import React, {useEffect} from "react"
import {appendTwitterScript, setLinkAttributes} from "../siteLogic";

import ReactHtmlParser from "react-html-parser";
import {withStore} from "../../../hocs/dataStore";

import "../../../styles/site-page.css"

const SitePage = (props) => {
    let pageContent
    // Fetch content if needed
    if (!props.isPreview) {
        if (!props.store[props.page.path]) {
            props.store.getPageData(props.page.path)
        } else {
            pageContent = props.store[props.page.path]
        }
    } else {
        pageContent = props.pageContent
    }

    // When page content updates
    useEffect(() => {
        if (pageContent) {
            const body = document.getElementById("page-body")
            // Add script for embedded tweets
            appendTwitterScript(body)
            // Set links to open in new tab
            setLinkAttributes(body)
        }
    }, [pageContent])

    return (
        <div className="site-page">
            <div className="page-header">
                <h1>{props.page.name}</h1>
            </div>
            <div className="page-content" id="page-body">
                {pageContent ? ReactHtmlParser(pageContent) :
                    <>
                        {props.isPreview ?
                            <h2>Use the editor below to add content to the page! <i className="fas fa-wrench"/></h2> :
                            <div className="loading-content">
                                <h2>Loading content...</h2>
                                <div className="lds-ellipsis">
                                    <div/>
                                    <div/>
                                    <div/>
                                    <div/>
                                </div>
                            </div>
                        }
                    </>
                }
            </div>
        </div>
    );
}

export default withStore(SitePage)