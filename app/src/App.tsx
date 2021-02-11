import { useAuth0 } from '@auth0/auth0-react';
import algoliasearch from 'algoliasearch/lite';
import "leaflet-defaulticon-compatibility";
import React, { useEffect } from "react";
import { InstantSearch } from 'react-instantsearch-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import { users } from './api';
import './App.scss';
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";
import ProtectedRoute from "./auth/protected-route";
import Footer from './components/Footer';
import Nav from "./components/Nav";
import RouteLogContext from "./components/RouteLogContext";
import About from './pages/about/About';
import Area from './pages/area/Area';
import Crag from './pages/crag/Crag';
import CragsMap from "./pages/crags-map/CragsMap";
import Crags from './pages/crags/Crags';
import CreateArea from "./pages/create-area/CreateArea";
import CreateCrag from "./pages/create-crag/CreateCrag";
import CreateRoute from "./pages/create-route/CreateRoute";
import CreateTopo from "./pages/create-topo/CreateTopo";
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import RoutePage from './pages/route/Route';
import Search from "./pages/search/Search";

const searchClient = algoliasearch(
  `${process.env.REACT_APP_ALGOLIA_APP_ID}`,
  `${process.env.REACT_APP_ALGOLIA_SEARCH_KEY}`
);
const algoliaIndexName = `${process.env.REACT_APP_ALGOLIA_INDEX}`;

function OnLogin() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // When the page first loads, check for an auth token and make POST 'login' request
    // to the server if the token exists
    //
    // Weird to have this in a compoenent, but I couldn't find a way to access the
    // auth token in any 'on login' callbacks
    if (isLoading === true || isAuthenticated === false) {
      return;
    }

    getAccessTokenSilently()
      .then(token => {
        users.login(token);
      })
      .catch(error => {
        console.error("Error loading access token", error);
      });
  }, [isAuthenticated, isLoading, getAccessTokenSilently])

  return <span></span>
}

function App() {
  return (
    <>
      <Router>
        <Auth0ProviderWithHistory>
          <OnLogin />
          <InstantSearch searchClient={ searchClient } indexName={ algoliaIndexName }>
            <RouteLogContext>
              <Nav />
              <Switch>
                <ProtectedRoute
                  path="/profile"
                  component={ Profile }
                />
                <ProtectedRoute
                  path='/crags/:cragSlug/areas/:areaSlug/create-topo'
                  component={ CreateTopo }
                />
                <ProtectedRoute
                  path='/crags/:cragSlug/areas/:areaSlug/topos/:topoSlug/create-route'
                  component={ CreateRoute }
                />
                <Route path="/crags/:cragSlug/areas/:areaSlug/topo/:topoSlug/routes/:routeSlug">
                  <RoutePage />
                </Route>
                <Route path='/crags/:cragSlug/areas/:areaSlug'>
                  <Area />
                </Route>
                <ProtectedRoute
                  path="/crags/:cragSlug/create-area"
                  component={ CreateArea }
                />
                <Route path='/crags/:cragSlug'>
                  <Crag />
                </Route>
                <Route path='/crags'>
                  <Crags />
                </Route>
                <Route path="/crags-map">
                  <CragsMap />
                </Route>
                <ProtectedRoute
                  path="/create-crag"
                  component={ CreateCrag }
                />
                <Route path='/about'>
                  <About />
                </Route>
                <Route path='/search'>
                  <Search />
                </Route>
                <Route path='/'>
                  <Home />
                </Route>
              </Switch>
              <Footer />
            </RouteLogContext>
          </InstantSearch>
        </Auth0ProviderWithHistory>
      </Router>
    </>
  );
}

export default App;
