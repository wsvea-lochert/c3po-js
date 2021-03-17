import React from 'react'
import { BrowserRouter as Router, Route,Switch } from "react-router-dom";

import { AuthProvider } from "./helpers/auth";
import PrivateRoute from "./helpers/PrivateRoute";

import Login from './components/Login';
import Home from "./components/Home";
import Datasets from "./components/Datasets"
//import Nav from "./components/Nav";

import './App.css';
import UploadFiles from './components/UploadFiles';

function App(){
  return (
    <AuthProvider>
      <Switch>
        <Router>
          <div >
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute path="/Datasets" component={Datasets} />
            <PrivateRoute path="/UploadFiles" component={UploadFiles}/>
            <Route exact path="/Login" component={Login} />
          </div>
        </Router>
      </Switch>
    </AuthProvider>
  );
}

export default App;
