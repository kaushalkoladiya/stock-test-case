import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { changeStockQty, closeSellStockDialog } from "../../redux/stock/action";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, TextField, Typography } from "@material-ui/core";
import { gql, useMutation } from "@apollo/client";
import { changeUserAmount, sellStock } from "../../redux/user/action";

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

const SELL_STOCK_MUTATION = gql`
  mutation SellStock($stockId: String!, $qty: Int!, $price: Int!) {
    sellStock(sellStockInput: { stockId: $stockId, qty: $qty, price: $price }) {
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

export default function SellStockDialog() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    stock: { openSell: open, stockDetails },
    user: { stocks: userHoldings },
  } = useSelector((state) => state);

  const [stockQty, setStockQty] = useState(0);
  const [error, setError] = useState("");

  const [executeSellMutation, { loading }] = useMutation(SELL_STOCK_MUTATION, {
    onError: (error) => {
      console.log(error);
    },
    onCompleted: (data) => {
      // reduce volume from the stock
      const stock = data.sellStock.stock;
      dispatch(changeStockQty(stock));
      // reduce amount from the wallet
      const user = data.sellStock.user;
      dispatch(changeUserAmount({ balance: user.balance }));
      // decrease in user account(stock)
      const trade = data.sellStock;
      dispatch(
        sellStock({
          stockId: stock._id,
          qty: trade.qty,
        })
      );
      handleClose();
    },
  });

  useEffect(() => {
    return () => {
      setStockQty(0);
      setError("");
    };
  }, [open]);

  let holdingStockIndex = -1;
  if (open) {
    holdingStockIndex = userHoldings.findIndex(
      (item) => item.stockId === stockDetails._id
    );
  }

  const handleClose = () => {
    dispatch(closeSellStockDialog());
  };

  const handleOnInputChange = (e) => {
    const qty = e.target.value;
    if (userHoldings[holdingStockIndex].qty < qty) {
      setError(
        "You do not have enough units available in your wallet to sell this stock!"
      );
    } else {
      setError("");
    }
    setStockQty(qty);
  };

  const handleOnClickSell = () => {
    executeSellMutation({
      variables: {
        stockId: stockDetails._id,
        qty: Number(stockQty),
        price: stockDetails.price,
      },
    });
  };

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
            <span>Ticker:</span>
            {stockDetails.ticker}
          </Typography>
          <Typography className={classes.formField}>
            <span>Price:</span>
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
          <span>Total Amount:</span>
          <strong>{stockQty * stockDetails.price}</strong>
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
          onClick={handleOnClickSell}
          disabled={error || loading ? true : false}
        >
          Sell
        </Button>
      </DialogActions>
    </Dialog>
  );
}
