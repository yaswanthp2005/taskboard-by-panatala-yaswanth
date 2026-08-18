import React from "react";

import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({
  component: Component,
  condition,
  path,
  redirectRoute,
  ...props
}) => {
  if (!condition) {
    return (
      <Redirect
        to={{
          pathname: redirectRoute,
          from: props.location,
        }}
      />
    );
  }

  return <Route component={Component} path={path} {...props} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  condition: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
  redirectRoute: PropTypes.string.isRequired,
  location: PropTypes.shape({}),
};

PrivateRoute.defaultProps = {
  location: null,
};

export default PrivateRoute;
