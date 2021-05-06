import React from 'react';

import CMSOption from "./misc/CMSOption";

/**
 * Component for the CMS Dashboard.
 * @returns {JSX.Element}
 * @constructor
 */
const CMSDashboard = () => {
    return (
        <div className="cms-dashboard">
            <CMSOption
                link="/cms-dashboard/create-classic"
                icon={<i className="fas fa-plus-square fa-5x"/>}
                text="Create"
            />
            <CMSOption
                link="/cms-dashboard/view-drafts"
                icon={<i className="fas fa-pencil-ruler fa-5x"/>}
                text="Drafts"
            />
            <CMSOption
                link="/cms-dashboard/view-posts"
                icon={<i className="fas fa-edit fa-5x"/>}
                text="Modify"
            />
            <CMSOption
                link="/cms-dashboard/edit-page"
                icon={<i className="fas fa-file fa-5x"/>}
                text="Pages"
            />
            {/* Keeping custom ad code, but tabling this functionality for now.
                 <CMSOption
                link="/cms-dashboard"
                icon={<i className="fas fa-ad fa-5x"/>}
                text="Ads"
            />
            */}
        </div>
    )
}

export default CMSDashboard