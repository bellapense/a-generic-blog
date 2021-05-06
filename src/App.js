import React from "react";
import './styles/App.css';

/* Contexts */
import {AuthProvider} from "./contexts/AuthContext";
import {createStore} from "./hocs/dataStore"

/* Other Components */
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import PrivateRoute from "./components/login/PrivateRoute";
import ScrollToTop from "./components/site/misc/ScrollToTop";

/* Site */
import PageWrapper from "./components/site/page-layout/PageWrapper";
import ResolvePathnameWrapper from "./components/site/ResolvePathnameWrapper";

/* Pages */
import Home from "./components/site/pages/Home";
import CategoryPage from "./components/site/pages/CategoryPage";
import SitePage from "./components/site/pages/SitePage";
import Error404Page from "./components/site/Error404Page";

/* Login Pages */
import Login from "./components/login/Login";
import Logout from "./components/login/Logout";

/* CMS */
import CMSWrapper from "./components/cms/page-layout/CMSWrapper";
import CMSDashboard from "./components/cms/CMSDashboard";
import PublishSuccess from "./components/cms/misc/PublishSuccess";

/* CMS Article Creation */
import CreateArticle from "./components/cms/article-creation/standard/CreateArticle";

/* CMS Modify Existing */
import ViewArticles from "./components/cms/modify-existing/articles/ViewArticles";
import ViewDrafts from "./components/cms/modify-existing/drafts/ViewDrafts";
import EditExistingDraft from "./components/cms/modify-existing/drafts/EditExistingDraft";
import EditExistingStandardArticle from "./components/cms/modify-existing/articles/EditExistingStandardArticle";

/* CMS Edit Pages */
import SelectPage from "./components/cms/edit-pages/SelectPage";
import EditPageContent from "./components/cms/edit-pages/EditPageContent";

/* Site Constants / Config */
import {ALL_PAGES, CATEGORIES} from "./constants";


function App() {
    /* Routes for Categories */
    const categoryRoutes = CATEGORIES.map((category, index) => {
        return (
            <Route key={`cat-route-${index}`}
                   exact path={category.path}
                   component={() => <PageWrapper pageContent={<CategoryPage category={category}/>}/>}
            />
        )
    })

    /* Routes for Pages */
    const pageRoutes = ALL_PAGES.map((page, index) => {
        return (
            <Route key={`page-route-${index}`}
                   exact path={page.path}
                   component={() => <PageWrapper pageContent={<SitePage page={page}/>}/>}
            />
        )
    })

    /* Routes for CMS Edit Pages */
    const editPageRoutes = ALL_PAGES.map((page, index) => {
        return (
            <PrivateRoute
                key={`edit-page-${index}`}
                exact path={`/cms-dashboard/edit-page${page.path}`}
                component={() => <CMSWrapper content={<EditPageContent pageURL={page.path} page={page}/>}/>}
            />
        )
    })

  return (
    <div className="App">
        <Router>
            <ScrollToTop />
            <AuthProvider>
                <Switch>
                    {/* Home page */}
                    <Route exact path={"/"} component={() => <PageWrapper
                        pageContent={<Home />}
                    />}/>
                    {/* Category pages */}
                    {categoryRoutes}
                    {/* Site pages */}
                    {pageRoutes}
                    {/* Login site-pages */}
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/logout" component={Logout} />
                    {/* 404 Page */}
                    <Route exact path={"/error-404-page-not-found"} component={() => <PageWrapper
                        pageContent={<Error404Page />}
                    />}/>
                    {/* CMS Pages */}
                    <PrivateRoute exact path="/cms-dashboard" component={() => <CMSWrapper
                        content={<CMSDashboard />}
                    />}/>
                    <PrivateRoute exact path="/cms-dashboard/create-classic" component={() => <CMSWrapper
                        content={<CreateArticle />}
                    />}/>
                    {/* Modify existing articles */}
                    <PrivateRoute exact path="/cms-dashboard/view-posts" component={() => <CMSWrapper
                        content={<ViewArticles />}
                    />}/>
                    <PrivateRoute path="/cms-dashboard/edit-published-article/" component={() => <CMSWrapper
                        content={<EditExistingStandardArticle />}
                    />}/>
                    {/* Modify existing drafts */}
                    <PrivateRoute exact path="/cms-dashboard/view-drafts" component={() => <CMSWrapper
                        content={<ViewDrafts />}
                    />}/>
                    <PrivateRoute path="/cms-dashboard/create-classic/" component={() => <CMSWrapper
                        content={<EditExistingDraft />}
                    />}/>
                    {/* Edit site page content */}
                    <PrivateRoute exact path="/cms-dashboard/edit-page" component={() => <CMSWrapper
                        content={<SelectPage />}
                    />}/>
                    {/* Editable pages */}
                    {editPageRoutes}
                    {/* Successfully published content */}
                    <PrivateRoute exact path="/cms-dashboard/publish-content-success" component={() => <CMSWrapper
                        content={<PublishSuccess />}
                    />}/>
                    {/* Resolve Article Routes - THIS NEEDS TO BE THE VERY LAST ROUTE */}
                    <Route component={() => <PageWrapper
                        pageContent={<ResolvePathnameWrapper />}
                    />}/>
                </Switch>
            </AuthProvider>
        </Router>
    </div>
  );
}

export default createStore(App)
