import React from "react";

import {Link} from "react-router-dom";
import CMSOption from "../misc/CMSOption";
import {ALL_PAGES} from "../../../constants";

/**
 * Component that displays options of all the editable pages and lets the admin select a page to edit.
 * Links to the pathname for the selected page's edit page.
 * @returns {JSX.Element}
 * @constructor
 */
const SelectPage = () => {
    /* Build options based on editable pages */
    const options = ALL_PAGES.map((page, index) => {
        return (
            <CMSOption
                key={`option-${index}`}
                link={`/cms-dashboard/edit-page${page.path}`}
                rectangular={true}
                text={page.name}
            />
        )
    })

    /* Display each edit page as a rectangular option tile */
    return (<div className="select-page" id="select-page">
            <h1>Select a Page</h1>
            <div className="row-list">
                {options}
            </div>
            <div className="site-button">
                <Link to="/cms-dashboard">Back</Link>
            </div>
        </div>
    )
}

export default SelectPage;