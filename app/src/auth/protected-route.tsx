import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";

function ProtectedRoute({ component, ...args }: any) {
  return (
    <Route
      component={withAuthenticationRequired(component)}
      {...args}
    />
  );
}

export default ProtectedRoute;
