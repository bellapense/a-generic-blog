import React, {useEffect, useState} from "react"
import {useHistory, useLocation} from "react-router-dom";
import {fetchDraftFromDocID} from "../../article-creation/standard/standardArticleLogic";
import CreateArticle from "../../article-creation/standard/CreateArticle";

function EditExistingDraft () {
    const { pathname } = useLocation()
    const history = useHistory()

    const [draft, setDraft] = useState(null)

    /* Runs on component mount to make sure that the article draft ID is valid */
    useEffect(() => {
        if (!draft) {
            // Pull the docID off of the pathname and try to match it to an article.
            const path = pathname.split("/")
            const docID = path.pop()
            fetchDraftFromDocID(docID).then((draft) => {
                // If it exists then save the data
                setDraft([docID, draft])
            }, () => {
                // If the draft doesn't exist then redirect
                history.push("/cms-dashboard/create-classic")
            })
        }
    }, [])

    return (draft ?
        <CreateArticle
            existingDraftID={draft[0]}
            existingDraft={draft[1]}
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

export default EditExistingDraft