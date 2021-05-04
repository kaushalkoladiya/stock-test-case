import React from "react";

// MUI
import Grid from "@material-ui/core/Grid";

const Home = () => {
  return (
    <Grid container>
      <Grid item sm={4} xs={12}>
        I'm Home
      </Grid>
      <Grid item sm={8} xs={12}></Grid>
    </Grid>
  );
};

export default Home;
