import React from "react";
import {Link} from "react-router-dom";

/* Styles */
import "../../styles/error-404-page.css";

function Error404Page() {
    return (
        <div className="error-404-page" id="error-404-page">
            <h1>Oh, no <i className="far fa-frown"/></h1>
            <p>We're sorry, we couldn't find the page you're looking for.</p>
            <div className="site-button">
                <Link to="/">Return Home</Link>
            </div>
        </div>
    )
}

export default Error404Page;