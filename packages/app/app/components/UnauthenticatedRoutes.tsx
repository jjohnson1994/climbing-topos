import React, { cloneElement, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import useUser from "../api/user";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  exact: boolean;
  path: string;
}

const UnauthenticatedRoute: React.FC<Props> = (props) => {
  const { children, ...rest } = props;
  const { isAuthenticating, isAuthenticated } = useUser();

  return (
    <Route {...rest}>
      {isAuthenticating && <LoadingSpinner />}
      {!isAuthenticating &&
        !isAuthenticated &&
        // @ts-ignore
        cloneElement(children, props)}
      {!isAuthenticating && isAuthenticated && <Redirect to="/profile" />}
    </Route>
  );
};

export default UnauthenticatedRoute;
