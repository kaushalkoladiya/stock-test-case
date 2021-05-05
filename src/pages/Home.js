import React, { useEffect } from "react";

// MUI
import Grid from "@material-ui/core/Grid";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/client";

import StockTable from "../components/Table/StockTable";
import { useDispatch, useSelector } from "react-redux";
import { getMyTrades, getTradingHistory } from "../redux/user/action";
import { getStocks } from "../redux/stock/action";
import BuyStockDialog from "../components/Dialog/BuyDialog";
import HomeHeader from "./HomeHeader";
import SellStockDialog from "../components/Dialog/SellDialog";
import TradingTable from "../components/Table/TradingTable";

const GET_STOCKS_QUERY = gql`
  {
    getMyDashboard {
      stocks {
        _id
        name
        qty
        ticker
        createdAt
        updatedAt
      }
      trades {
        stockId
        qty
      }
      userTrades {
        _id
        qty
        price
        createdAt
        stock {
          _id
          name
          qty
          ticker
        }
      }
    }
  }
`;

const Home = () => {
  const dispatch = useDispatch();

  const [executeQuery, { loading, called, data }] = useLazyQuery(
    GET_STOCKS_QUERY
  );

  const _stockData = useSelector((state) => state.stock.stocks);
  const userHoldings = useSelector((state) => state.user.stocks);

  useEffect(() => {
    setTimeout(() => {
      executeQuery();
    }, 100);
  }, []);

  useEffect(() => {
    if (called && data) {
      dispatch(getStocks(data.getMyDashboard.stocks));
      dispatch(getMyTrades(data.getMyDashboard.trades));
      dispatch(getTradingHistory(data.getMyDashboard.userTrades));
    }
  }, [called, data]);

  return (
    <Grid container spacing={2}>
      <HomeHeader />
      <Grid item sm={12} md={8}>
        {!loading && _stockData.length !== 0 && (
          <StockTable stocks={_stockData} userHoldings={userHoldings} />
        )}
      </Grid>
      <Grid item sm={12} md={4}>
        <TradingTable />
      </Grid>
      <BuyStockDialog />
      <SellStockDialog />
    </Grid>
  );
};

export default Home;
