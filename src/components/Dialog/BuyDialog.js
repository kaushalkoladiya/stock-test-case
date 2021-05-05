import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { changeStockQty, closeBuyStockDialog } from "../../redux/stock/action";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, TextField, Typography } from "@material-ui/core";
import { gql, useMutation } from "@apollo/client";
import { buyStock, changeUserAmount } from "../../redux/user/action";

const useStyles = makeStyles({
  formField: { margin: "10px 0" },
  totalAmount: { float: "right" },
  holdingSection: {
    display: "flex",
    alignItems: "flex-end",
    flexDirection: "column",
  },
  margin0: {
    margin: 0,
  },
});

const BUY_STOCK_MUTATION = gql`
  mutation BuyStock($stockId: String!, $qty: Int!, $price: Int!) {
    buyStock(buyStockInput: { stockId: $stockId, qty: $qty, price: $price }) {
      _id
      qty
      price
      tradeType
      stock {
        _id
        name
        qty
        ticker
      }
      user {
        _id
        email
        balance
      }
    }
  }
`;

export default function BuyStockDialog() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    stock: { openBuy: open, stockDetails, stocks },
    user: { user, stocks: userHoldings },
  } = useSelector((state) => state);

  const [stockQty, setStockQty] = useState(0);
  const [error, setError] = useState("");
  const [totalStockVolume, setTotalStockVolume] = useState(0);

  const [executeBuyMutation, { loading }] = useMutation(BUY_STOCK_MUTATION, {
    onError: (error) => {
      console.log(error);
    },
    onCompleted: (data) => {
      console.log(data);
      // reduce volume from the stock
      const stock = data.buyStock.stock;
      dispatch(changeStockQty(stock));
      // reduce amount from the wallet
      const user = data.buyStock.user;
      dispatch(changeUserAmount({ balance: user.balance }));
      // increase in user account(stock)
      const trade = data.buyStock;
      dispatch(
        buyStock({
          stockId: stock._id,
          qty: trade.qty,
        })
      );
      handleClose();
    },
  });

  useEffect(() => {
    if (open) {
      const index = stocks.findIndex((item) => item._id === stockDetails._id);
      if (index > -1) {
        setTotalStockVolume(stocks[index].qty);
      }
    }
    return () => {
      setStockQty(0);
      setTotalStockVolume(0);
      setError("");
    };
  }, [open, stocks, stockDetails]);

  const handleClose = () => {
    dispatch(closeBuyStockDialog());
  };

  const handleOnInputChange = (e) => {
    const qty = e.target.value;
    const totalAmount = qty * stockDetails.price;
    if (totalAmount > user.balance) {
      setError(
        "You do not have enough money available in your wallet to buy this stock!"
      );
    } else if (totalStockVolume < qty) {
      setError("Not enough volume available in the system for this stock!");
    } else {
      setError("");
    }
    setStockQty(qty);
  };

  const handleOnClickBuy = () => {
    executeBuyMutation({
      variables: {
        stockId: stockDetails._id,
        qty: Number(stockQty),
        price: stockDetails.price,
      },
    });
  };

  let holdingStockIndex = -1;
  if (open) {
    holdingStockIndex = userHoldings.findIndex(
      (item) => item.stockId === stockDetails._id
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      fullWidth
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle id="alert-dialog-title">{stockDetails.name}</DialogTitle>
      <DialogContent>
        {holdingStockIndex > -1 && (
          <div className={classes.holdingSection}>
            <p className={classes.margin0}>
              <span>Your total holdings:</span>
              <strong>{userHoldings[holdingStockIndex].qty}</strong>
            </p>
            <p className={classes.margin0}>
              <span>Current holding value:</span>
              <strong>
                {userHoldings[holdingStockIndex].qty * stockDetails.price}
              </strong>
            </p>
          </div>
        )}

        <div>
          <Typography className={classes.formField}>
            <span>Ticker: </span>
            {stockDetails.ticker}
          </Typography>
          <Typography className={classes.formField}>
            <span>Price: </span>
            {stockDetails.price}
          </Typography>
        </div>
        <TextField
          className={classes.formField}
          label="Quantity"
          type="number"
          value={stockQty}
          error={error ? true : false}
          helperText={error}
          onChange={handleOnInputChange}
          variant="outlined"
          size="small"
          disabled={loading}
          fullWidth
        />
        <Typography className={classes.totalAmount}>
          Total Amount: <strong>{stockQty * stockDetails.price}</strong>
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={handleClose}
          color="primary"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOnClickBuy}
          disabled={error || loading ? true : false}
        >
          Buy
        </Button>
      </DialogActions>
    </Dialog>
  );
}
