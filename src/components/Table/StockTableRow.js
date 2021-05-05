import { Button, makeStyles, TableCell, TableRow } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openBuyStockDialog,
  openSellStockDialog,
} from "../../redux/stock/action";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: 5,
  },
}));

const getRandomNumber = () => Math.round(Math.random() * 50 + 1);

const StockTableRow = ({ row }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userHoldings = useSelector((state) => state.user.stocks);

  const [price, setPrice] = useState(getRandomNumber());

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(getRandomNumber());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBuy = (stock) => {
    dispatch(openBuyStockDialog({ ...stock, price }));
  };

  const handleSell = (stock) => {
    dispatch(openSellStockDialog({ ...stock, price }));
  };

  const userHoldingIndex = userHoldings?.findIndex(
    (item) => item.stockId === row._id
  );
  let disableSellBtn = true;
  if (userHoldingIndex > -1) {
    disableSellBtn = userHoldings[userHoldingIndex].qty !== 0 ? false : true;
  }

  return (
    <TableRow>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.ticker}</TableCell>
      <TableCell>{price}</TableCell>
      {/* <TableCell>{row.qty}</TableCell> */}
      <TableCell>
        <Button
          size="small"
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={row.qty === 0 ? true : false}
          onClick={() => handleBuy(row)}
        >
          Buy
        </Button>
        <Button
          size="small"
          className={classes.button}
          variant="outlined"
          color="secondary"
          disabled={disableSellBtn}
          onClick={() => handleSell(row)}
        >
          Sell
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default StockTableRow;
