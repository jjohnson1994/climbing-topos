import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Helmet } from "react-helmet";

import Crag from './pages/crag/Crag';
import Crags from './pages/crags/Crags';
import CreateCrag from "./pages/create-crag/CreateCrag";
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import SignIn from './pages/sign-in/SignIn';
import SignUp from './pages/sign-up/SignUp';
import SignUpConfirm from './pages/sign-up-confirm/SignUpConfirm';

import './App.scss';
import Nav from "./components/Nav";

function App() {
  return (
    <>
      <Helmet>
        <script src="https://kit.fontawesome.com/4b877c229a.js" crossOrigin="anonymous"></script>
      </Helmet>
      <Router>
        <Nav />
        <Switch>
          <Route path='/profile'>
            <Profile />
          </Route>
          <Route path='/crag/:slug'>
            <Crag />
          </Route>
          <Route path='/crags'>
            <Crags />
          </Route>
          <Route path="/create-crag">
            <CreateCrag />
          </Route>
          <Route path="/sign-in">
            <SignIn />
          </Route>
          <Route path="/sign-up">
            <SignUp />
          </Route>
          <Route path="/sign-up-confirm">
            <SignUpConfirm />
          </Route>
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
