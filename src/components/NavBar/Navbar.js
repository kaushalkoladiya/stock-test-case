import React, { Fragment } from "react";
import { NavLink, Link } from "react-router-dom";
// redux
import { useSelector, useDispatch } from "react-redux";
import { setUnauthenticated } from "../../redux/user/action";
// MUI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
// Components
import TooltipButton from "../Button/Button";
// Icons
import HomeIcon from "@material-ui/icons/Home";
import KeyboardReturn from "@material-ui/icons/KeyboardReturn";
// style
import style from "./NavBar.module.css";
import { Typography } from "@material-ui/core";

const NavBar = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.user.isAuth);
  const handleLogout = () => {
    dispatch(setUnauthenticated());
  };
  return (
    <AppBar position="fixed">
      <Toolbar className={style.navBar}>
        <div>
          <Typography>Stock</Typography>
        </div>
        {isAuth ? (
          <Fragment>
            <TooltipButton
              title="Logout"
              placement="top"
              onClick={handleLogout}
            >
              <KeyboardReturn color="primary" />
            </TooltipButton>
          </Fragment>
        ) : (
          <div>
            <Button color="inherit" component={NavLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={NavLink} to="/signup">
              Signup
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
