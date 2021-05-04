import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';


const authRouter = ({ component: Component, isAuth, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuth === true ? <Redirect to="/" /> : <Component {...props} />
    }
  />
);

authRouter.prototype = {
  user: PropTypes.object
}

const mapStateToProps = state => ({
  isAuth: state.user.isAuth
});


export default connect(mapStateToProps)(authRouter);
