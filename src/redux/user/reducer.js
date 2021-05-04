import { SET_AUTHENTICATED, SET_UNAUTHENTICATED, SET_USER } from "./types";

const initialState = {
  isAuth: false,
  user: {},
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_AUTHENTICATED:
      localStorage.setItem("token", payload);
      return {
        ...state,
        isAuth: true,
      };

    case SET_UNAUTHENTICATED:
      localStorage.removeItem("token");
      return initialState;

    case SET_USER:
      return {
        isAuth: true,
        user: payload,
      };

    default:
      return state;
  }
};

export default userReducer;
