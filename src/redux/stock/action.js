import {
  CHANGE_STOCK_QTY,
  CLOSE_BUY_STOCK_DIALOG,
  CLOSE_SELL_STOCK_DIALOG,
  GET_STOCKS,
  OPEN_BUY_STOCK_DIALOG,
  OPEN_SELL_STOCK_DIALOG,
} from "./types";

export const getStocks = (payload) => ({
  type: GET_STOCKS,
  payload,
});

export const changeStockQty = (payload) => ({
  type: CHANGE_STOCK_QTY,
  payload,
});

export const openBuyStockDialog = (payload) => ({
  type: OPEN_BUY_STOCK_DIALOG,
  payload,
});

export const closeBuyStockDialog = () => ({
  type: CLOSE_BUY_STOCK_DIALOG,
});

export const openSellStockDialog = (payload) => ({
  type: OPEN_SELL_STOCK_DIALOG,
  payload,
});

export const closeSellStockDialog = () => ({
  type: CLOSE_SELL_STOCK_DIALOG,
});
