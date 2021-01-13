import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "./auth";

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const {currentUser} = useContext(AuthContext);
    console.log('PrivateRoute.js running')
    return (
      <Route
        {...rest}
        render={routeProps =>
          !!currentUser ? (
            <RouteComponent {...routeProps} />
          ) : (
            <Redirect to={"/Login"} />
          )
        }
      />
    );
};
  
export default PrivateRoute