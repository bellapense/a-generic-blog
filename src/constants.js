/** This file contains constants for site config */
/* Site Specific */
const SITE_NAME = "A Generic Blog."

/* Post Categories */
const CATEGORY_1 = {
    name: "Category 1",
    path: "/category-1",
    icon: <i className="fas fa-seedling fa-7x" />
}
const CATEGORY_2 = {
    name: "Category 2",
    path: "/category-2",
    icon: <i className="fas fa-globe-americas fa-7x" />
}
const CATEGORY_3 = {
    name: "Category 3",
    path: "/category-3",
    icon: <i className="fas fa-air-freshener fa-7x" />
}
const CATEGORY_4 = {
    name: "Category 4",
    path: "/category-4",
    icon: <i className="fas fa-comment-dots fa-7x" />
}

const CATEGORIES = [CATEGORY_1, CATEGORY_2, CATEGORY_3, CATEGORY_4]

/* Site Pages */
const PAGE_1 = {
    name: "Page 1",
    path: "/page-1"
}
const PAGE_2 = {
    name: "Page 2",
    path: "/page-2"
}
const PAGE_3 = {
    name: "Page 3",
    path: "/page-3"
}

/* Privacy Policy Page */
const PRIVACY_PAGE = {
    name: "Privacy Policy",
    path: "/privacy-policy"
}

const ALL_PAGES = [PAGE_1, PAGE_2, PAGE_3, PRIVACY_PAGE]

const NAV_PAGES = [PAGE_1, PAGE_2, PAGE_3]

export {
    SITE_NAME,
    CATEGORY_1,
    CATEGORY_2,
    CATEGORY_3,
    CATEGORY_4,
    CATEGORIES,
    PAGE_1,
    PAGE_2,
    PAGE_3,
    PRIVACY_PAGE,
    ALL_PAGES,
    NAV_PAGES,
}