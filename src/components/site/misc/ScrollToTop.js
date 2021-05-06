import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Smooth scrolls window to the top when the current pathname changes.
 * @constructor
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scroll({
                top: 0,
                behavior: 'smooth'
            });
    }, [pathname])

    return null
}

export default ScrollToTop