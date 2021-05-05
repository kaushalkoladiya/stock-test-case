import {
  BUY_STOCK,
  CHANGE_USER_AMOUNT,
  GET_MY_TRADES,
  GET_TRADING_HISTORY,
  SELL_STOCK,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER,
} from "./types";

const initialState = {
  isAuth: false,
  user: {},
  stocks: [], // holdings
  tradeHistory: [],
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
        ...state,
        isAuth: true,
        user: payload,
      };

    case GET_MY_TRADES:
      return {
        ...state,
        stocks: payload,
      };

    case GET_TRADING_HISTORY:
      return {
        ...state,
        tradeHistory: payload,
      };

    case BUY_STOCK:
      const index = state.stocks.findIndex(
        (item) => item.stockId === payload.stockId
      );
      if (index === -1) {
        // add new
        return {
          ...state,
          stocks: [...state.stocks, payload],
        };
      } else {
        // Update
        return {
          ...state,
          stocks: state.stocks.map((item) =>
            item.stockId === payload.stockId
              ? {
                  ...item,
                  qty: item.qty + payload.qty,
                }
              : item
          ),
        };
      }

    case SELL_STOCK:
      return {
        ...state,
        stocks: state.stocks.map((item) =>
          item.stockId === payload.stockId
            ? {
                ...item,
                qty: item.qty - payload.qty,
              }
            : item
        ),
      };

    case CHANGE_USER_AMOUNT:
      return {
        ...state,
        user: { ...state.user, balance: payload.balance },
      };

    default:
      return state;
  }
};

export default userReducer;
