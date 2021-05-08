const { ApolloError, AuthenticationError } = require("apollo-server-errors");
const Stock = require("../../model/Stock");
const Trade = require("../../model/Trade");
const User = require("../../model/User");
const mongoose = require("mongoose");

module.exports = {
  Query: {
    getStocks: async (_, data, context) => {
      try {
        const stocks = await Stock.find().sort({ createdAt: -1 });

        // const trades = await Trade.find({ userId: context.userId });

        return stocks.map((stock) => ({
          ...stock._doc,
          createdAt: stock.createdAt.toISOString(),
          updatedAt: stock.updatedAt.toISOString(),
        }));
      } catch (error) {
        throw new ApolloError(error.message, error.state);
      }
    },
  },
  Mutation: {
    buyStock: async (_, { buyStockInput }, context) => {
      try {
        if (!context.isAuth) {
          throw new AuthenticationError("Please login to assess this page!");
        }

        // is stock available?
        const stock = await Stock.findById(buyStockInput.stockId);
        if (!stock) {
          const err = new Error("Stock not found!");
          err.status = 404;
          throw err;
        }

        // check is enough stock available to buy
        if (stock.qty < buyStockInput.qty) {
          const err = new Error("No enough stock available to buy!");
          err.status = 422;
          throw err;
        }

        const user = await User.findById(context.userId);

        // calculate price
        const totalPrice = buyStockInput.qty * buyStockInput.price;

        // check user has enough money to buy the stock
        if (user.balance < totalPrice) {
          const err = new Error(
            "You do not have enough money available in your wallet to buy this stock!"
          );
          err.status = 422;
          throw err;
        }

        // deduct from user's account and compare with the actual balance
        user.balance -= totalPrice;

        // check user holdings
        let holdings = [...user.holdings];
        const index = holdings.findIndex(
          (item) => String(item.stockId) === String(buyStockInput.stockId)
        );
        if (index === -1) {
          // add new
          holdings.push({
            stockId: mongoose.Types.ObjectId(buyStockInput.stockId),
            qty: buyStockInput.qty,
          });
        } else {
          holdings[index].qty += buyStockInput.qty;
        }

        user.holdings = holdings;
        await user.save();
        // minus from stock
        stock.qty -= buyStockInput.qty;
        await stock.save();
        // store trade
        const tradeData = {
          stockId: stock._id,
          userId: user._id,
          qty: buyStockInput.qty,
          price: buyStockInput.price,
          tradeType: "BUY",
        };
        const trade = await Trade.create(tradeData);

        return {
          _id: trade._id,
          ...tradeData,
          user,
          stock,
        };
      } catch (error) {
        throw new ApolloError(error.message, error.state);
      }
    },
    sellStock: async (_, { sellStockInput }, context) => {
      try {
        if (!context.isAuth) {
          throw new AuthenticationError("Please login to assess this page!");
        }

        // const trades = await Trade.aggregate([
        //   {
        //     $match: {
        //       userId: mongoose.Types.ObjectId(context.userId),
        //       stockId: mongoose.Types.ObjectId(sellStockInput.stockId),
        //     },
        //   },
        //   {
        //     $group: {
        //       _id: {
        //         stockId: "$stockId",
        //       },
        //       count: { $sum: "$qty" },
        //     },
        //   },
        // ]);

        const user = await User.findById(context.userId);
        const holdings = [...user.holdings];

        const stockHoldingIndex = holdings.findIndex(
          (item) => String(item.stockId) === String(sellStockInput.stockId)
        );

        if (stockHoldingIndex > -1) {
          if (holdings[stockHoldingIndex].qty < sellStockInput.qty) {
            throw new Error(
              "You do not have enough units available in your wallet to sell this stock!"
            );
          } else {
            holdings[stockHoldingIndex].qty -= sellStockInput.qty;
          }
        } else {
          throw new Error(
            "You do not have enough units available in your wallet to sell this stock!"
          );
        }

        // stock exits?
        const stock = await Stock.findById(sellStockInput.stockId);
        if (!stock) {
          const err = new Error("Stock not found!");
          err.status = 404;
          throw err;
        }

        const totalPrice = sellStockInput.qty * sellStockInput.price;

        // add in user's account and compare with the actual balance
        user.balance += totalPrice;
        user.holdings = holdings;

        await user.save();
        // plus from stock
        stock.qty += sellStockInput.qty;
        await stock.save();
        // store trade
        const tradeData = {
          stockId: stock._id,
          userId: user._id,
          qty: sellStockInput.qty,
          price: sellStockInput.price,
          tradeType: "SELL",
        };
        const trade = await Trade.create(tradeData);

        // delete trade logs

        return {
          _id: trade._id,
          ...tradeData,
          user,
          stock,
        };
      } catch (error) {
        throw new ApolloError(error.message, error.state);
      }
    },
  },
};
