import React, {useEffect} from "react";
import CMSHeader from "./CMSHeader";

import "../../../styles/cms-styles.css"

/* Wrapper for the constant components of the cms Dashboard */
function CMSWrapper(props) {
    /* Runs on component mount to scroll it into view */
    useEffect(() => {
        document.getElementById("content-view").scrollIntoView();
    }, [])

    return (
        <>
            {/* Lazy button
            <div className="site-button" onClick={(() => {
                createNewStandardArticle("bella.pense@gmail.com")
            })}>
                <p>Create Article</p>
            </div>
            */}
            <CMSHeader />
            <div id="cms-content">
                {props.content}
            </div>
        </>
    )
}
export default CMSWrapper;
