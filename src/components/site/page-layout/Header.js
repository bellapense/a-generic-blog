import React from "react"

import {SITE_NAME} from "../../../constants"

import SocialMedia from "../misc/SocialMedia"
import Navigation from "./Navigation";
import {Link} from "react-router-dom";

const Header = () => {
    return (
        <header className="site-header">
            <h1 className="site-name">
                <Link to="/">
                    {SITE_NAME}
                </Link>
            </h1>
            <SocialMedia />
            <Navigation />
        </header>
    )
}

export default Header