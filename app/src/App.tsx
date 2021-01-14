import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch } from 'react-instantsearch-dom';

import Area from './pages/area/Area';
import Crag from './pages/crag/Crag';
import Crags from './pages/crags/Crags';
import CragsMap from "./pages/crags-map/CragsMap";
import CreateArea from "./pages/create-area/CreateArea";
import CreateCrag from "./pages/create-crag/CreateCrag";
import CreateRoute from "./pages/create-route/CreateRoute";
import CreateTopo from "./pages/create-topo/CreateTopo";
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import RoutePage from './pages/route/Route';
import Search from "./pages/search/Search";

import './App.scss';
import Nav from "./components/Nav";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";
import ProtectedRoute from "./auth/protected-route";

const searchClient = algoliasearch(
  `${process.env.REACT_APP_ALGOLIA_APP_ID}`,
  `${process.env.REACT_APP_ALGOLIA_SEARCH_KEY}`
);
const algoliaIndexName = `${process.env.REACT_APP_ALGOLIA_INDEX}`;

function App() {
  return (
    <>
      <Router>
        <InstantSearch searchClient={ searchClient } indexName={ algoliaIndexName }>
          <Auth0ProviderWithHistory>
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
              <Route path='/search'>
                <Search />
              </Route>
              <Route path='/'>
                <Home />
              </Route>
            </Switch>
          </Auth0ProviderWithHistory>
        </InstantSearch>
      </Router>
    </>
  );
}

export default App;
