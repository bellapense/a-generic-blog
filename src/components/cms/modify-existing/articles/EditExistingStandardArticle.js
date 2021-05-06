import React, {useEffect, useState} from "react"
import {useHistory, useLocation} from "react-router-dom";
import {fetchStandardArticleFromDocID} from "../../article-creation/standard/standardArticleLogic";
import CreateArticle from "../../article-creation/standard/CreateArticle";

function EditExistingStandardArticle() {
    const { pathname } = useLocation()
    const history = useHistory()

    const [publishedArticle, setPublishedArticle] = useState(null)

    /* Runs on component mount to make sure that the article draft ID is valid */
    useEffect(() => {
        if (!publishedArticle) {
            // Pull the docID off of the pathname and try to match it to an article.
            const path = pathname.split("/")
            const docID = path.pop()
            fetchStandardArticleFromDocID(docID).then((article) => {
                // If it exists then save the data
                setPublishedArticle([docID, article])
            }, () => {
                // If the draft doesn't exist then redirect
                history.push("/cms-dashboard/create-classic")
            })
        }
    }, [])

    return (publishedArticle ?
            <CreateArticle
                publishedArticleID={publishedArticle[0]}
                publishedArticle={publishedArticle[1]}
            />
            : <div>
                <div className="loading">
                    <div className="lds-ellipsis">
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                    </div>
                </div>
            </div>
    )
}

export default EditExistingStandardArticle