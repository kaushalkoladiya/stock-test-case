import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    maxHeight: 440,
  },
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  tableHeader: {
    textAlign: "center",
    marginBottom: 10,
  },
}));

export default function TradingTable() {
  const classes = useStyles();

  const {
    user: { stocks: userHoldings },
    stock: { stocks },
  } = useSelector((state) => state);

  return (
    <div>
      <div className={classes.tableHeader}>
        <Typography variant="h6">Your training history</Typography>
      </div>
      <TableContainer component={Paper} className={classes.container}>
        <MuiTable stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={classes.head}>Compony</TableCell>
              <TableCell className={classes.head}>Ticker</TableCell>
              <TableCell className={classes.head}>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userHoldings.map((row) => {
              const index = stocks.findIndex(
                (item) => item._id === row.stockId
              );

              if (index > -1) {
                return (
                  <TableRow key={row.stockId}>
                    <TableCell>{stocks[index].name}</TableCell>
                    <TableCell>{stocks[index].ticker}</TableCell>
                    <TableCell>{row.qty}</TableCell>
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </div>
  );
}
