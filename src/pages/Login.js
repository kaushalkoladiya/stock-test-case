import React, { useState } from "react";
import { Link } from "react-router-dom";

// MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core";

// image
import Image from "../images/icon.png";

// GraphQL
import { gql, useLazyQuery } from "@apollo/client";

// validation
import { UserAuthRules } from "../validation";

// redux
import { useDispatch } from "react-redux";
import { setAuthorization, setUserData } from "../redux/user/action";

const useStyles = makeStyles({
  form: {
    textAlign: "center",
  },
  center: {
    textAlign: "center",
  },
  row: {
    margin: "0.5rem auto 0.5rem auto",
  },
});
const LOGIN_QUERY = gql`
  query Login($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        _id
        email
        balance
      }
    }
  }
`;

const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formDataError, setFormDataError] = useState({
    email: "",
    password: "",
    common: "",
  });

  const [executeQuery, { loading }] = useLazyQuery(LOGIN_QUERY, {
    onError: (error) => setFormDataError({ common: error.message }),
    onCompleted: (data) => {
      // console.log(data.loginUser.token);
      // console.log(data.loginUser.user);
      dispatch(setAuthorization(data.loginUser.token));
      dispatch(setUserData(data.loginUser.user));
    },
  });

  const handleOnInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setFormDataError({ email: "", password: "", common: "" });
    try {
      await UserAuthRules.validate(formData);
    } catch (error) {
      setFormDataError({ common: error.message });
    }

    // console.log(formData);
    executeQuery({
      variables: {
        email: formData.email,
        password: formData.password,
      },
    });
    // console.log(data);
    // console.log(error.message);
  };

  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm className={classes.center}>
        <img src={Image} alt="logo" className={classes.row} />
        <Typography variant="h4">Login</Typography>
        <form onSubmit={handleOnSubmit}>
          <TextField
            id="email"
            type="email"
            name="email"
            className={classes.row}
            label="Email"
            value={formData.email}
            onChange={handleOnInputChange}
            fullWidth
          />
          <TextField
            id="password"
            type="password"
            name="password"
            className={classes.row}
            label="Password"
            value={formData.password}
            // helperText={errors.password}
            // error={errors.password ? true : false}
            onChange={handleOnInputChange}
            fullWidth
          />

          {formDataError.common && (
            <Typography variant="caption" color="error" className={classes.row}>
              {formDataError.common}
            </Typography>
          )}

          <br />
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            disabled={loading ? true : false}
          >
            Login
            {loading && (
              <CircularProgress
                style={{ marginLeft: "0.7rem" }}
                size={15}
                color="primary"
              />
            )}
          </Button>
          <br />
          <small>
            Don't have account? Signup <Link to="/signup">here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
};

export default Login;
