/* Licensing for GNU General Public License 2.0 or greater */
/*  The South End is a Website and CMS to publish news articles
    Copyright (C) 2021  The South End

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import React, {useEffect, useState} from "react"
import {CATEGORIES} from "../../../../constants";

import defaultImage from "../../../../images/default-image.png";
import AdvancedEditor from "../AdvancedEditor";
import ToolTipPopup from "../../misc/ToolTipPopup";
import {getDateTime} from "../../cmsLogic";

import Article from "../../../site/article/Article";


function CreateArticleFields(props) {
    /* State to determine if the preview should be shown or hidden */
    const [isPreviewOn, setIsPreviewOn] = useState(false)

    /* Build category options from the list of categories */
    const categoryIcons = CATEGORIES.map((category, index) => {
        return (
            <span className={`icon ${props.article.category.path === category.path ? 'on' : 'off'}`} key={`cat-${index}`}>
                <div
                    className={`icon ${props.article.category.path === category.path ? 'on' : 'off'}`}
                    onClick={()=> {
                        if (!props.modifyExisting) {
                            props.setArticle(prevState => ({
                                ...prevState,
                                category: {
                                    path: category.path,
                                    name: category.name
                                }
                            }))
                        }
                    }}
                >
                    {category.icon}
                </div>
                <p>{category.name}</p>
            </span>
        )
    })

    /* To generate the preview */
    let articlePreview = null
    if (isPreviewOn) {
        const [todayDate] = getDateTime().split("@")
        articlePreview = (
            <Article
                key="article"
                isPreview={true}
                articleTitle={!props.article.title.trim() ? <span className="warning">** This Article Needs a Title **</span> : props.article.title}
                isFeatured={props.article.isFeatured}
                category={props.article.category}
                coverPhoto={props.article.coverPhotoFile ? props.article.coverPhotoFile : props.modifyExisting ? props.article.coverPhotoURL : defaultImage}
                coverPhotoDesc={!props.article.coverPhotoDesc.trim() ?
                    <span className="warning">** Cover photo missing description. **</span> : props.article.coverPhotoDesc}
                author={!props.article.author.trim() ? <span className="warning">** Article authors missing. **</span> : props.article.author}
                updated={todayDate}
                posted={props.modifyExisting ? props.article.originalCreationDate : todayDate}
                editorsNote={props.modifyExisting ? props.article.editorsNote : null}
                articleBody={props.article.articleBody ? props.article.articleBody : "<div class='warning'><p>** Article missing body. **</p></div>"}
                authorInfo={!props.article.authorInfo.trim() ?
                    '<span class="warning">** Author information missing. **</span>' : props.article.authorInfo}
                coverPhotoInfo={props.article.coverPhotoInfo}
                mode="create"
            />
        );
    }

    /* Scrolls the preview into view when it is activated */
    useEffect(() => {
        if (isPreviewOn) {
            document.getElementById("submit-section").scrollIntoView();
        }
    }, [isPreviewOn])

    /* Scrolls to first field error when the field errors are updated */
    useEffect(() => {
        const errorFields = document.querySelector(".error-text")
        if (errorFields) {
            const error = errorFields.closest(".section")
            if (error) {
                error.scrollIntoView()
            }
        }
    }, [props.fieldErrors])

    return (<>
        <div className="creation-form">
            <hr/>
            {/* Article Title */}
            {props.modifyExisting ?
                <>
                    <div className="section article-title">
                        <label>Article Title</label>
                        <h1>{props.article.title}</h1>
                        <p className="help-text">The title of the post cannot be changed after being published.</p>
                    </div>
                </>
            : <div className="section">
                <label htmlFor="article-title">Title</label>
                <input
                    type="text"
                    name="article-title"
                    id="article-title"
                    value={props.article.title}
                    onChange={event => {
                        props.setArticle(prevState => ({
                            ...prevState,
                            title: event.target.value.trimLeft()
                        }))
                    }}
                />
                <p className="help-text">The title of the post.</p>
                {props.fieldErrors.title && <p className="error-text">
                    {props.fieldErrors.title}
                </p>}
            </div>}
            <hr/>
            {/* Article Category */}
            <div className={`section with-icons ${props.modifyExisting ? "hide-inactive" : ""}`} id="category-selection">
                <label>Post Category</label>
                <span>
                    <div
                        id="favorite-icon"
                        className={`star ${props.article.isFeatured ? 'on' : ''}`}
                        onClick={() => props.setArticle(prevState => ({
                            ...prevState,
                            isFeatured: !prevState.isFeatured
                        }))}
                    >
                        {props.article.isFeatured ? <i className="fas fa-star fa-7x"/> : <i className="far fa-star fa-7x"/> }
                    </div>
                    <p>Featured</p>
                </span>
                {categoryIcons}
                <div className="help-text">
                    {props.modifyExisting ?
                        "Post category cannot be changed for posts that are already published, but featured status can be changed."
                    : "Marking the post as featured is optional, but selecting a category is required."}
                </div>
                <br/>
                {props.fieldErrors.category && <div style={{width: '100%', margin: '0 auto', textAlign: 'center'}} className="error-text">
                    {props.fieldErrors.category}
                </div>}
            </div>
            <hr/>
            {/* Article Cover Photo */}
            {!props.modifyExisting ?
                <div className="section center">
                    <label htmlFor="cover-photo">Cover Photo</label>
                    <img src={props.article.coverPhotoFile ? props.article.coverPhotoFile : defaultImage} alt="upload preview"/>
                    <span className="set-image">
                        <input
                            type="file"
                            name="cover-photo"
                            id="upload-cover-photo"
                            accept="image/*"
                            style={{display: "none"}}
                            onChange={(event) => {
                                if (event.target.files[0]) {
                                    props.setArticle(prevState => ({
                                        ...prevState,
                                        coverPhotoFile: URL.createObjectURL(event.target.files[0]),
                                        file: event.target.files[0],
                                    }))
                                }
                            }}
                        />
                        <div className="upload-image">
                            <div className="site-button" onClick={() => {
                                document.getElementById("upload-cover-photo").click()
                            }}>
                                <p>Upload Image</p>
                            </div>
                            <p className="file-name">{props.article.file ? props.article.file.name ? props.article.file.name : props.draftFileName.split("/").pop() : "No file uploaded."}</p>
                        </div>
                        {props.article.file ? <ToolTipPopup
                            triggerIcon={<div
                                id="delete-icon"
                                className="icon"
                            >
                                <i className="fas fa-trash-alt fa-2x"/>
                            </div>}
                            prompt={"Delete image?"}
                            triggerIconText={""}
                            onClickAction={() => {
                                props.setArticle(prevState => ({
                                    ...prevState,
                                    coverPhotoFile: null,
                                    file: null,
                                }))
                                document.getElementById("popup-close-button").click()
                            }}
                        /> : null}
                    </span>
                    {props.fieldErrors.coverPhotoFile && <p className="error-text">
                        {props.fieldErrors.coverPhotoFile}
                    </p>}
                </div> : <div className="section center">
                    <label>Cover Photo</label>
                    <img src={props.article.coverPhotoURL} alt={props.article.coverPhotoDesc}/>
                    <p className="help-text">
                        Cover photo for a published article cannot be modified.
                    </p>
                </div>
            }
            {/* Article Cover Photo Description */}
            <div className="section center">
                <label htmlFor="article-cover-photo-desc">Cover Photo Description</label>
                <textarea
                    name="article-cover-photo-desc"
                    id="article-cover-photo-desc"
                    value={props.article.coverPhotoDesc}
                    onChange={event => {
                        props.setArticle(prevState => ({
                            ...prevState,
                            coverPhotoDesc: event.target.value.trimLeft()
                        }))
                    }}
                >
                </textarea>
                <p className="help-text">
                    This brief description will appear directly underneath the image and also
                    be utilized for those using a screen-reader.
                </p>
                {props.fieldErrors.coverPhotoDesc && <p className="error-text">
                    {props.fieldErrors.coverPhotoDesc}
                </p>}
            </div>
            {/* Article Cover Photo Information */}
            <div className="section center">
                <label htmlFor="article-cover-photo-info">Cover Photo Information</label>
                <textarea
                    name="article-cover-photo-info"
                    id="article-cover-photo-info"
                    value={props.article.coverPhotoInfo}
                    onChange={event => {
                        props.setArticle(prevState => ({
                            ...prevState,
                            coverPhotoInfo: event.target.value.trimLeft()
                        }))
                    }}>
                </textarea>
                <p className="help-text">
                    Optional information about the cover photo photographer to appear at the bottom of the post.
                    <br/>
                    <i>
                        EX: Cover photo by Photographer Name, they can be reached at emailaddress@email.com.
                    </i>
                </p>
            </div>
            <hr/>
            {/* Article Authors */}
            <div className="section center">
                <label htmlFor="article-authors">Author(s)</label>
                <textarea
                    name="article-authors"
                    id="article-authors"
                    value={props.article.author}
                    onChange={event => {
                        props.setArticle(prevState => ({
                            ...prevState,
                            author: event.target.value.trimLeft()
                        }))
                    }}>
                </textarea>
                <p className="help-text">
                    Name of the post author, for multiple authors see example below.
                    <br/>
                    <i>
                        EX: Author One and Author Two.
                    </i>
                </p>
                {props.fieldErrors.author && <p className="error-text">
                    {props.fieldErrors.author}
                </p>}
            </div>
            {/* Article Authors Information */}
            <div className="section center">
                <label htmlFor="article-author-info">Author Information</label>
                <textarea
                    name="article-author-info"
                    id="article-author-info"
                    value={props.article.authorInfo}
                    onChange={event => {
                        props.setArticle(prevState => ({
                            ...prevState,
                            authorInfo: event.target.value.trimLeft()
                        }))
                    }}>
                </textarea>
                <p className="help-text">
                    Information about the post author to appear at the end of the post, for multiple authors
                    separate descriptions on a new line.
                    <br/>
                    <i>
                        EX: By Author Name, they can be reached at emailaddress@email.com.
                    </i>
                </p>
                {props.fieldErrors.authorInfo && <p className="error-text">
                    {props.fieldErrors.authorInfo}
                </p>}
            </div>
            <hr/>
            {/* Article Abstract */}
            <div className="section center large">
                <label htmlFor="article-abstract">Article Abstract</label>
                <textarea
                    name="article-abstract"
                    id="article-abstract"
                    value={props.article.abstract}
                    onChange={event => {
                        props.setArticle(prevState => ({
                            ...prevState,
                            abstract: event.target.value.trimLeft()
                        }))
                    }}>
                </textarea>
                <p className="help-text">
                    A short abstract of the post to appear in post previews. It can be the same as first
                    paragraph of the post and will not appear in the post itself.
                </p>
                {props.fieldErrors.abstract && <p className="error-text">
                    {props.fieldErrors.abstract}
                </p>}
            </div>
            <hr/>
            {/* Editors note */}
            {props.modifyExisting ? <>
                <div className="section center large">
                    <label htmlFor="article-abstract">Editor's Note</label>
                    <textarea
                        name="editors-note"
                        id="editors-note"
                        value={props.article.editorsNote}
                        onChange={event => {
                            props.setArticle(prevState => ({
                                ...prevState,
                                editorsNote: event.target.value.trimLeft()
                            }))
                        }}>
                </textarea>
                    <p className="help-text">
                        Add an optional editor's note to appear at the top of the post for a significant edit
                        made to the post.
                    </p>
                </div>
                <hr/>
            </> : null}
            {/* Article Body */}
            <div className="section center large">
                <label htmlFor="article-body">Post Body</label>
                <AdvancedEditor
                    setContent={(content) => {
                        props.setArticle(prevState => ({
                            ...prevState,
                            articleBody: content,
                        }))
                    }}
                    initialContent={props.article.articleBody}
                    helpText={"The body of the post can contain images, Tweets, YouTube videos, and more."}
                />
                {props.fieldErrors.articleBody && <p className="error-text">
                    {props.fieldErrors.articleBody}
                </p>}
            </div>
            <hr/>
            {/* Submit Section */}
            <label className="center">Finished?</label>
            <div className="section with-icons" id="submit-section">
                {!props.modifyExisting ? <ToolTipPopup
                    triggerIcon={<div
                        id="save-icon"
                        className="icon"
                    >
                        <i className="far fa-save fa-7x"/>
                    </div>}
                    triggerIconText={"Save Draft"}
                    prompt={"Save draft?"}
                    onClickAction={props.handleSaveDraft}
                /> : null}
                <span>
                    <div
                        id="preview-icon"
                        className="icon"
                        onClick={() => {
                            setIsPreviewOn((prevState => !prevState))
                        }}
                    >
                        {isPreviewOn ? <i className="far fa-eye-slash fa-7x"/> : <i className="far fa-eye fa-7x"/>}
                    </div>
                    <p>{isPreviewOn ? "Hide Preview" : "Show Preview"}</p>
                </span>
                <ToolTipPopup
                    triggerIcon={<div
                        id="publish-icon"
                        className="icon"
                    >
                        <i className="far fa-newspaper fa-7x"/>
                    </div>}
                    prompt={"Publish post?"}
                    triggerIconText={"Publish"}
                    onClickAction={props.handlePublishArticle}
                />
            </div>
        </div>
        <div id="preview" className={`section center ${isPreviewOn ? "visible" : "hidden"}`}>
            <hr/>
            <h2>Full Article Preview</h2>
            <div className="full-article">
                {articlePreview}
            </div>
            <hr/>
        </div>
        </>)
}

export default CreateArticleFields