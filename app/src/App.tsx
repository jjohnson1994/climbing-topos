import algoliasearch from "algoliasearch/lite";
import "leaflet-defaulticon-compatibility";
import { InstantSearch } from "react-instantsearch-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.scss";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import RouteLogContext from "./components/RouteLogContext";
import Area from "./pages/area/Area";
import About from "./pages/about/About";
import Crag from "./pages/crag/Crag";
import CragsMap from "./pages/crags-map/CragsMap";
import Crags from "./pages/crags/Crags";
import CreateArea from "./pages/create-area/CreateArea";
import CreateCrag from "./pages/create-crag/CreateCrag";
import CreateRoute from "./pages/create-route/CreateRoute";
import CreateTopo from "./pages/create-topo/CreateTopo";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import RoutePage from "./pages/route/Route";
import Search from "./pages/search/Search";
import Login from "./pages/login/Login";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoutes";
import Signup from "./pages/signup/Signup";
import SignupConfirm from "./pages/signup-confirm/SignupConfirm";
import { AppContext } from "./components/AppContext";
import { useState } from "react";

const searchClient = algoliasearch(
  `${process.env.REACT_APP_ALGOLIA_APP_ID}`,
  `${process.env.REACT_APP_ALGOLIA_SEARCH_KEY}`
);

const algoliaIndexName = `${process.env.REACT_APP_ALGOLIA_INDEX}`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [userAttributes, setUserAttributes] = useState<null | any>();

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isAuthenticating,
        setIsAuthenticating,
        userAttributes,
        setUserAttributes
      }}
    >
      <BrowserRouter>
        <InstantSearch searchClient={searchClient} indexName={algoliaIndexName}>
          <RouteLogContext>
            <Nav />
            <Switch>
              <UnauthenticatedRoute exact path="/login">
                <Login />
              </UnauthenticatedRoute>
              <UnauthenticatedRoute exact path="/signup">
                <Signup />
              </UnauthenticatedRoute>
              <UnauthenticatedRoute exact path="/signup-confirm">
                <SignupConfirm />
              </UnauthenticatedRoute>
              <AuthenticatedRoute exact path="/profile">
                <Profile />
              </AuthenticatedRoute>
              <AuthenticatedRoute
                exact
                path="/crags/:cragSlug/areas/:areaSlug/create-topo"
              >
                <CreateTopo />
              </AuthenticatedRoute>
              <AuthenticatedRoute
                exact
                path="/crags/:cragSlug/areas/:areaSlug/topos/:topoSlug/create-route"
              >
                <CreateRoute />
              </AuthenticatedRoute>
              <Route
                exact
                path="/crags/:cragSlug/areas/:areaSlug/topo/:topoSlug/routes/:routeSlug"
              >
                <RoutePage />
              </Route>
              <Route
                exact
                path="/crags/:cragSlug/areas/:areaSlug"
              >
                <Area />
              </Route>
              <AuthenticatedRoute exact path="/crags/:cragSlug/create-area">
                <CreateArea />
              </AuthenticatedRoute>
              <Route exact path="/crags/:cragSlug">
                <Crag />
              </Route>
              <Route exact path="/crags">
                <Crags />
              </Route>
              <Route exact path="/crags-map">
                <CragsMap />
              </Route>
              <AuthenticatedRoute exact path="/create-crag">
                <CreateCrag />
              </AuthenticatedRoute>
              <Route exact path="/about">
                <About />
              </Route>
              <Route exact path="/search">
                <Search />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
            </Switch>
            <Footer />
          </RouteLogContext>
        </InstantSearch>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
