import React, { useState } from "react";
import { Link } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { setAuthorization, setUserData } from "../redux/user/action";

// MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core";

import Image from "../images/icon.png";
// validation
import { UserAuthRules } from "../validation";
// graphQL
import { gql, useMutation } from "@apollo/client";

const useStyle = makeStyles({
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

const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!) {
    registerUser(newUser: { email: $email, password: $password }) {
      token
      user {
        _id
        email
      }
    }
  }
`;

const Signup = () => {
  const classes = useStyle();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formDataError, setFormDataError] = useState({
    email: "",
    password: "",
    common: "",
  });

  const [executeQuery, { loading }] = useMutation(SIGNUP_MUTATION, {
    onError: (error) => setFormDataError({ common: error.message }),
    onCompleted: (data) => {
      dispatch(setAuthorization(data.registerUser.token));
      dispatch(setUserData(data.registerUser.user));
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
        <Typography variant="h4">Signup</Typography>
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
            Signup
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
            Don't have account? Login <Link to="/login">here</Link>
          </small>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
};

export default Signup;
