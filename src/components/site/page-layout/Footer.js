import React from 'react';
import {SITE_NAME, CATEGORIES, NAV_PAGES} from "../../../constants";
import SocialMedia from "../misc/SocialMedia";

import { Link } from "react-router-dom";

const Footer = () => {
    /* Category links */
    const categoryLinks = CATEGORIES.map((category, index) => {
        return (
            <div className="footer-link" key={`cat-link-${index}`}>
                <Link to={category.path}>
                    {category.name}
                </Link>
            </div>
        )
    })

    /* Page links*/
    const pageLinks = NAV_PAGES.map((page, index) => {
        return (
            <div className="footer-link" key={`page-link-${index}`}>
                <Link to={page.path}>
                    {page.name}
                </Link>
            </div>
        )
    })

    return (
        <footer className="site-footer">
            <div className="site-info">
                <div>
                    <h1 className="site-name">
                        {SITE_NAME}
                    </h1>
                    <SocialMedia />
                </div>
                <div>
                    <h2>Categories</h2>
                    {categoryLinks}
                </div>
                <div>
                    <h2>Pages</h2>
                    {pageLinks}
                </div>
            </div>
            <div className="bottom">
                <p>
                    <Link to="/privacy-policy">Privacy Policy</Link> - No gods. No masters. No copyright. - <Link to="/login">Login</Link>
                </p>
            </div>
        </footer>
    )
}

export default Footer;