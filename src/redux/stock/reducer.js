import {
  OPEN_BUY_STOCK_DIALOG,
  CLOSE_BUY_STOCK_DIALOG,
  GET_STOCKS,
  CHANGE_STOCK_QTY,
  OPEN_SELL_STOCK_DIALOG,
  CLOSE_SELL_STOCK_DIALOG,
} from "./types";

const initialState = {
  openBuy: false,
  openSell: false,
  stockDetails: {},
  stocks: [],
};

const stockReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_STOCKS:
      return {
        ...state,
        stocks: payload,
      };
    case OPEN_BUY_STOCK_DIALOG:
      return {
        ...state,
        openBuy: true,
        stockDetails: payload,
      };

    case CLOSE_BUY_STOCK_DIALOG:
      return {
        ...state,
        openBuy: false,
        stockDetails: {},
      };

    case OPEN_SELL_STOCK_DIALOG:
      return {
        ...state,
        openSell: true,
        stockDetails: payload,
      };

    case CLOSE_SELL_STOCK_DIALOG:
      return {
        ...state,
        openSell: false,
        stockDetails: {},
      };

    case CHANGE_STOCK_QTY:
      return {
        ...state,
        stocks: state.stocks.map((item) =>
          String(item._id) === String(payload._id)
            ? { ...item, qty: payload.qty }
            : item
        ),
      };

    default:
      return state;
  }
};

export default stockReducer;
