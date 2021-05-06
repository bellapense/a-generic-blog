import React, { createContext } from 'react';

import {
    fetchAllInitialArticles,
    fetchArticleFromURL, fetchCategoryArticles,
    fetchPageContent
} from "../components/site/siteFetchDataLogic";
import {CATEGORIES} from "../constants";

/* Initially create the empty context object for the datastore. */
const StoreContext = createContext({})

/**
 * HOC that creates the datastore context. Contains all the functions needed to handle requests for data and storing
 * the data returned from the request. The component wrapped will initialize the store for all components it
 * renders - this should only be done once, otherwise there will be multiple instances of the store and data
 * could get out of sync.
 * @param WrappedComponent
 */
const createStore = WrappedComponent => {
    return class extends React.Component {
        state = {
            /**
             * Function used only to fetch all initial data when the app initializes or is refreshed. Will
             * overwrite all previously saved data.
             */
            fetchInitial: () => {
                /*  Initialize an empty object for creating the store (page wrapper will rerender every time state is
                 *  updated, so we only want to do this once at the end).
                 */
                const initialState = {}
                // Fetch all initial articles
                fetchAllInitialArticles().then((promises) => {
                    promises.forEach(({category, articles, lastVisible, canLoadMore}) => {
                        initialState[category] = {
                            mostRecent: articles,
                            lastVisible: lastVisible,
                            canLoadMore: canLoadMore,
                        }
                    })
                    // Set initial state now that all initial data has been fetched and saved
                    this.setState(initialState)
                    /*
                    // Fetch data for custom ads
                    fetchCustomAds().then((promises) => {
                        promises.forEach(({ad}) => {
                            initialState[ad.type] = {
                                imageURL: ad.imageURL,
                                desc: ad.desc,
                                linkURL: ad.linkURL
                            }
                        })

                    })
                     */
                })
            },
            /**
             * Function that will attempt to get an article from the specified collection (such as "standard-articles")
             * for an article matching articleURL. If a match is found, article data will be returned in a promise, if
             * not, the promise will be empty.
             * @param articleURL
             * @param collection
             * @returns {Promise<>}
             */
            getArticleFromURL: async (articleURL, collection) => {
                // Category identifiers for article data currently in the datastore
                const categories = CATEGORIES.map(category => {
                    return category.path
                })

                // Check all article categories to check if article is already in the datastore
                categories.forEach(category => {
                    this.state[category].mostRecent.forEach((article) => {
                        if (article.articleURL === articleURL) {
                            return article
                        }
                    })
                })

                // If the article is not already in the store, then attempt to fetch it
                return await fetchArticleFromURL(articleURL, collection)
            },
            /**
             * Function that will fetch page data for the specified pageURL and save it to the datastore.
             * @param path
             */
            getPageData: (path) => {
                fetchPageContent(path).then((content) => {
                    this.setState(prevState => ({
                        ...prevState,
                        [path]: content,
                    }))
                })
            },
            /**
             * Function that will fetch up to the next 10 articles for the specified category and save them to the
             * entry for that category in the datastore, along with updated information for whether more articles
             * exist to be loaded.
             * @param category
             */
            fetchMoreArticles: (category) => {
                fetchCategoryArticles(category, this.state[category].lastVisible).then(
                    ({category, articles, lastVisible, canLoadMore}) => {
                        this.setState(prevState => ({
                            ...prevState,
                            [category]: {
                                mostRecent: [...prevState[category].mostRecent, ...articles],
                                lastVisible: lastVisible,
                                canLoadMore: canLoadMore
                            },
                        }))
                    })
            }
        };

        /**
         * Render method that provides the store state as the context, which can be accessed in the props of the wrapped
         * component.
         * @returns {JSX.Element}
         */
        render() {
            return (
                <StoreContext.Provider value={this.state}>
                    <WrappedComponent {...this.props} />
                </StoreContext.Provider>
            )
        }
    }
}

/**
 * HOC that grants wrapped component access to the datastore context. Datastore must first be initialized by the parent
 * component.
 * @param WrappedComponent
 */
const withStore = WrappedComponent => {
    return class extends React.Component {
        render() {
            return (
                <StoreContext.Consumer>
                    {context => <WrappedComponent store={context} {...this.props} />}
                </StoreContext.Consumer>
            )
        }
    }
}

export { createStore, withStore }