import React, { Fragment } from "react";
import { Redirect, Route } from "react-router-dom";
import PropTypes from "prop-types";

import { connect } from "react-redux";

const PrivateRoute = ({ component: Component, isAuth, ...rest }) => (
  <Fragment>
    {isAuth ? (
      <Route component={Component} {...rest} />
    ) : (
      <Redirect to="/login" />
    )}
  </Fragment>
);

PrivateRoute.prototype = {
  isAuth: PropTypes.bool.isRequired,
  component: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isAuth: state.user.isAuth,
});

export default connect(mapStateToProps)(PrivateRoute);
