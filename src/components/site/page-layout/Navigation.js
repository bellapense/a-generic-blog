import React, {useState} from "react";
import { Link } from "react-router-dom";

import {CATEGORIES, NAV_PAGES, SITE_NAME} from "../../../constants";

const Navigation = () => {
    /* State to control when to show mobile */
    const [showMobileNav, setShowMobileNav] = useState(false)

    /* For showing which page is active */
    const activePage = window.location.pathname

    /* Create a link for each category in the site */
    const categoryLinks = CATEGORIES.map((category, index) => {
        return (
            <div className={`nav-item ${activePage === category.path ? "active" : ""}`} key={`cat-${index}`}>
                <Link to={category.path}>
                    {category.name}
                </Link>
            </div>
        )
    })

    /* Create a link for site pages */
    const sitePages = NAV_PAGES.map((page, index) => {
        return (
            <div className={`nav-item ${activePage === page.path ? "active" : ""}`} key={`cat-${index}`}>
                <Link to={page.path}>
                    {page.name}
                </Link>
            </div>
        )
    })

    /* The navigation */
    const navigation = (
        <nav id="navigation">
            <div className={`nav-item ${activePage === "/" ? "active" : ""}`}>
                <Link to="/">
                    Home
                </Link>
            </div>
            {categoryLinks}
            {sitePages}
        </nav>
    )

    return (
        <>
            <div className="site-navigation">
                {navigation}
            </div>
            <div className="mobile-navigation">
                <div className="mobile-menu">
                    <i className={showMobileNav ? "fas fa-times fa-3x" : "fas fa-bars fa-3x"} onClick={() => setShowMobileNav(prevState => !prevState)}/>
                    <h1 className="site-name">
                        <Link to="/">
                            {SITE_NAME}
                        </Link>
                    </h1>
                </div>
                {showMobileNav ? navigation : null}
            </div>
        </>

    )
}

export default Navigation