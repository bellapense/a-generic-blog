import React, {useEffect, useState} from "react";

import {useLocation, Redirect} from "react-router-dom";

import DisplayArticle from "./article/DisplayArticle";
import {CATEGORIES} from "../../constants";

/* Valid paths for articles */
const VALID_PATHS = CATEGORIES.map(category => {
    return category.path
})

/* The base valid length of a pathname for articles. Length is based on "/" within the pathname. */
const VALID_PATH_LENGTH = 4

/**
 * This component's purpose is to start the process of resolving dynamic path names, which covers all article URLs.
 * In this component the pathname will be assessed to see if it is a potentially valid pathname for an article.
 * If it determines that the pathname could not be valid, it will automatically redirect to the 404 Error page. If
 * it determines that the pathname could be valid, pass the process on to the display component based on the type
 * of article the pathname is for.
 *
 * @returns {JSX.Element|JSX.Element}
 * @constructor
 */
function ResolvePathnameWrapper() {
    const { pathname } = useLocation()
    // State to redirect to the 404 error page if the pathname cannot be resolved/is not formatted correctly
    const [redirectTo, setRedirectTo] = useState(null)

    /*
    Function that destructs the current pathname and rebuilds it to determine if the pathname is potentially valid for
    an article.
    */
    function resolvePathname() {
        // Separate the pathname between '/'
        let path = pathname.split("/")
        // Valid paths "/category/date/article-title"
        let validLength = VALID_PATH_LENGTH

        // path[0] should always be empty string
        if (path[0]) {
            setRedirectTo("/error-404-page-not-found")
            return
        }

        // path[1] should be an article category
        let articlePathname = "/" + path[1]

        // Now the articlePathname build should be contained within the list of valid path names
        if (!VALID_PATHS.includes(articlePathname)) {
            // If not, then redirect to the 404
            setRedirectTo("/error-404-page-not-found")
            return
        }

        // Check the rest of the path - valid paths "/category/date/article-title"
        if (path.length === validLength) {
            // Light check to see if date is formatted correctly "yyyy-mm-dd"
            if (path[path.length - 2].split("-").length !== 3) {
                setRedirectTo("/error-404-page-not-found")
            }
        } else {
            setRedirectTo("/error-404-page-not-found")
        }
    }

    /* This effect will run when the pathname is updated and then attempt to redirect it. */
    useEffect(() => {
        setRedirectTo(null)
        resolvePathname()
    }, [pathname])

    /* This effect will reset the redirect value when it unmounts. */
    useEffect(() => {
        return () => {
            setRedirectTo(null)
        }
    }, [])

    // If the component should redirect, then redirect, otherwise go to the next step of displaying the article.
    return ( redirectTo ? <Redirect to={redirectTo}/> : <DisplayArticle />)
}

export default ResolvePathnameWrapper;