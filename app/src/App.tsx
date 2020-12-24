import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Area from './pages/area/Area';
import Crag from './pages/crag/Crag';
import Crags from './pages/crags/Crags';
import CreateArea from "./pages/create-area/CreateArea";
import CreateCrag from "./pages/create-crag/CreateCrag";
import CreateRoute from "./pages/create-route/CreateRoute";
import CreateTopo from "./pages/create-topo/CreateTopo";
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import RoutePage from './pages/route/Route';

import './App.scss';
import Nav from "./components/Nav";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";
import ProtectedRoute from "./auth/protected-route";

function App() {
  return (
    <>
      <Router>
        <Auth0ProviderWithHistory>
          <Nav />
          <Switch>
            <ProtectedRoute path="/profile" component={ Profile } />
            <ProtectedRoute path='/crags/:cragSlug/areas/:areaSlug/create-topo'>
              <CreateTopo />
            </ProtectedRoute>
            <ProtectedRoute path='/crags/:cragSlug/areas/:areaSlug/topos/:topoSlug/create-route'>
              <CreateRoute />
            </ProtectedRoute>
            <Route path="/crags/:cragSlug/areas/:areaSlug/routes/:routeSlug">
              <RoutePage />
            </Route>
            <Route path='/crags/:cragSlug/areas/:areaSlug'>
              <Area />
            </Route>
            <ProtectedRoute path="/crags/:cragSlug/create-area">
              <CreateArea />
            </ProtectedRoute>
            <Route path='/crags/:cragSlug'>
              <Crag />
            </Route>
            <Route path='/crags'>
              <Crags />
            </Route>
            <ProtectedRoute path="/create-crag" component={ CreateCrag } />
            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </Auth0ProviderWithHistory>
      </Router>
    </>
  );
}

export default App;
