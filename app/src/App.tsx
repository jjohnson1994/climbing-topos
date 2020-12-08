import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Helmet } from "react-helmet";

import Area from './pages/area/Area';
import CreateArea from "./pages/create-area/CreateArea";
import CreateTopo from "./pages/create-topo/CreateTopo";
import Crag from './pages/crag/Crag';
import Crags from './pages/crags/Crags';
import CreateCrag from "./pages/create-crag/CreateCrag";
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';

import './App.scss';
import Nav from "./components/Nav";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";
import ProtectedRoute from "./auth/protected-route";

function App() {
  return (
    <>
      <Helmet>
        <script src="https://kit.fontawesome.com/4b877c229a.js" crossOrigin="anonymous"></script>
      </Helmet>
      <Router>
        <Auth0ProviderWithHistory>
          <Nav />
          <Switch>
            <ProtectedRoute path="/profile" component={ Profile } />
            <Route path='/crags/:cragSlug/areas/:areaSlug/create-topo'>
              <CreateTopo />
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
