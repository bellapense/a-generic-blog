import React from "react"

import ToolTipPopup from "../misc/ToolTipPopup";

/**
 * Component for a multimedia or standard article that appears with the edit and/or delete button for that article.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function ArticleListItem(props) {
    return (props.placeholder ?
            <div className="article-list-item">
                <div className="item-image">
                    <div className="image"/>
                </div>
                <div className="item-info">
                    <div className="content">
                        <h3/>
                        <h3 className="half"/>
                        <p/>
                    </div>
                </div>
                <div className="item-actions">
                    {props.canEdit ? <i className="fas fa-pencil-alt fa-3x"/> : null }
                    <i className="fas fa-trash-alt fa-3x"/>
                </div>
            </div>
        : <div className="article-list-item">
            <div className="item-image">
                <img src={props.coverPhotoURL} alt={props.coverPhotoDesc} />
                {props.numberPhotos ? <div className="number-photos">
                    <p>{props.numberPhotos} <i className="far fa-images"/></p>
                </div> : null}
            </div>
            <div className="item-info">
                <div className="content">
                    <h3>{props.title}</h3>
                    <p>{props.updatedDate}{props.author ? ` - ${props.author}` : ""}</p>
                </div>
            </div>
            <div className="item-actions">
                {props.handleEdit ?
                <ToolTipPopup
                    triggerIcon={<div
                        id="edit-icon"
                        className="icon"
                    >
                        <i className="fas fa-pencil-alt fa-3x"/>
                    </div>}
                    prompt={`${props.isDraft ? "Edit draft?": "Edit article?"}`}
                    triggerIconText={""}
                    onClickAction={props.handleEdit}
                /> : null }
                <ToolTipPopup
                    triggerIcon={<div
                        id="delete-icon"
                        className="icon"
                    >
                        <i className="fas fa-trash-alt fa-3x"/>
                    </div>}
                    prompt={`${props.isDraft ? "Delete draft?": "Delete article?"}`}
                    triggerIconText={""}
                    onClickAction={props.handleDelete}
                    danger={true}
                />
            </div>
        </div>
    )
}

export default ArticleListItem