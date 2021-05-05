import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import MuiTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import StockTableRow from "./StockTableRow";
import { useSelector } from "react-redux";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  tableHeader: {
    textAlign: "center",
    marginBottom: 10,
  },
}));

export default function StockTable() {
  const classes = useStyles();

  const stocks = useSelector((state) => state.stock.stocks);

  const columns = ["Name", "Ticker", "Price", "Buy/Sell"];
  // console.log("re-render");
  // console.log(userHoldings);
  return (
    <div>
      <div className={classes.tableHeader}>
        <Typography variant="h6">Stocks available for training</Typography>
      </div>
      <TableContainer component={Paper}>
        <MuiTable aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((item) => (
                <TableCell className={classes.head} key={item}>
                  {item}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks?.map((row) => (
              <StockTableRow row={row} key={row._id} />
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
    </div>
  );
}
