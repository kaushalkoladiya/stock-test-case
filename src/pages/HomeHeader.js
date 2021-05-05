import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
  homeHeader: {
    padding: 20,
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

const HomeHeader = () => {
  const classes = useStyles();
  const userDetails = useSelector((state) => state.user.user);

  return (
    <Grid item sm={12} component={Paper} className={classes.homeHeader}>
      <Typography variant="h6">Hello, {userDetails.email}</Typography>
      <Typography variant="body1">INR ₹ {userDetails.balance}</Typography>
    </Grid>
  );
};

export default HomeHeader;
