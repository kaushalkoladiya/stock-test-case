import { SET_AUTHENTICATED, SET_UNAUTHENTICATED, SET_USER } from "./types";

export const setAuthorization = (payload) => ({
  type: SET_AUTHENTICATED,
  payload,
});

export const setUserData = (payload) => ({ type: SET_USER, payload });

export const setUnauthenticated = () => ({ type: SET_UNAUTHENTICATED });
