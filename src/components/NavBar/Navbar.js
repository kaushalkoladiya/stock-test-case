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

const NavBar = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.user.isAuth);
  const handleLogout = () => {
    dispatch(setUnauthenticated());
  };
  return (
    <AppBar position="fixed">
      <Toolbar className={style.navBar}>
        {isAuth ? (
          <Fragment>
            <Link to="/">
              <TooltipButton title="Home">
                <HomeIcon color="primary" />
              </TooltipButton>
            </Link>
            <TooltipButton
              title="Logout"
              placement="top"
              onClick={handleLogout}
            >
              <KeyboardReturn color="primary" />
            </TooltipButton>
          </Fragment>
        ) : (
          <Fragment>
            <Button color="inherit" component={NavLink} to="/">
              Home
            </Button>
            <Button color="inherit" component={NavLink} to="/login">
              Login
            </Button>
            <Button color="inherit" component={NavLink} to="/signup">
              Signup
            </Button>
          </Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
