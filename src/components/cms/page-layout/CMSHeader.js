import React from 'react';

import {useAuth} from "../../../contexts/AuthContext";
import {useHistory} from "react-router-dom";
import {Link} from "react-router-dom";
import {SITE_NAME} from "../../../constants";

const CMSHeader = () => {
    const history = useHistory()
    const { currentUser } = useAuth()
    const username = currentUser.email;

    return (
        <>
        <header id="cms-header" className="cms-header">
            <div>
                <h1 className="site-name">
                    <Link to="/cms-dashboard">
                        {SITE_NAME}
                    </Link>
                    <span className="sub-heading">Content Management System</span>
                </h1>
            </div>
            <div>
                <p className="username">Welcome, {username}!</p>
                <div
                    onClick={() => {
                        history.push('/logout')
                    }}
                    className="site-button"
                >
                    <p>Logout</p>
                </div>
                <div
                    onClick={() => {
                        history.push('/cms-dashboard')
                    }}
                    className={`site-button ${history.location.pathname === '/cms-dashboard' ? 'active' : ''}`}
                >
                    <p>Dashboard</p>
                </div>
            </div>
        </header>
        {/*content-view is a marker for scrolling cms content into view while still leaving a strip of the header visible*/}
        <div id="content-view"/>
        </>
    )
}

export default CMSHeader