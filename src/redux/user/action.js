import {
  BUY_STOCK,
  CHANGE_USER_AMOUNT,
  GET_MY_TRADES,
  SELL_STOCK,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER,
  GET_TRADING_HISTORY,
} from "./types";

export const setAuthorization = (payload) => ({
  type: SET_AUTHENTICATED,
  payload,
});
export const setUnauthenticated = () => ({ type: SET_UNAUTHENTICATED });

export const setUserData = (payload) => ({ type: SET_USER, payload });
export const getMyTrades = (payload) => ({ type: GET_MY_TRADES, payload });
export const getTradingHistory = (payload) => ({
  type: GET_TRADING_HISTORY,
  payload,
});
export const buyStock = (payload) => ({ type: BUY_STOCK, payload });
export const sellStock = (payload) => ({ type: SELL_STOCK, payload });

export const changeUserAmount = (payload) => ({
  type: CHANGE_USER_AMOUNT,
  payload,
});
