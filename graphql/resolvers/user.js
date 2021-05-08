const { ApolloError, AuthenticationError } = require("apollo-server-errors");
const { User } = require("../../model");
const bcypt = require("bcryptjs");
const { generateJWTToken } = require("../../helper");
const { UserAuthRules } = require("../../validation/user");
const Stock = require("../../model/Stock");
const Trade = require("../../model/Trade");
const mongoose = require("mongoose");

module.exports = {
  Query: {
    loginUser: async (_, data) => {
      try {
        await UserAuthRules.validate(data);

        // fetch user information
        const user = await User.findOne({ email: data.email });
        // console.log(user);
        if (!user) {
          const err = new Error("Oops, you are now registered yet!");
          err.status = 404;
          throw err;
        }

        // compare password
        const isEqual = await bcypt.compare(data.password, user.password);
        if (!isEqual) {
          const err = new Error("Password does not match!");
          err.code = 422;
          throw err;
        }
        const payload = {
          _id: user._id,
          email: user.email,
          balance: user.balance,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };

        // Generate token
        const token = generateJWTToken(payload);

        return {
          token,
          user: payload,
        };
      } catch (error) {
        throw new ApolloError(error.message, error.state);
      }
    },
    getMe: async (_, data, context) => {
      if (!context.isAuth) {
        throw new AuthenticationError("Not logged in!");
      }
      const user = await User.findById(context.userId);
      return user;
    },
    getMyDashboard: async (_, data, context) => {
      try {
        if (!context.isAuth) {
          throw new AuthenticationError("Please login to assess this page!");
        }

        const user = await User.findById(context.userId);

        const stocks = await Stock.find();
        const userTrades = await Trade.find({
          userId: context.userId,
        }).populate([
          {
            path: "userId",
            model: "User",
          },
          {
            path: "stockId",
            model: "Stock",
          },
        ]);

        // const trades = await Trade.aggregate([
        //   {
        //     $match: { userId: mongoose.Types.ObjectId(context.userId) },
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

        return {
          stocks: stocks.map((stock) => ({
            ...stock._doc,
            createdAt: stock.createdAt.toISOString(),
            updatedAt: stock.updatedAt.toISOString(),
          })),
          userTrades: userTrades.map((trade) => ({
            ...trade._doc,
            user: trade.userId,
            stock: trade.stockId,
            createdAt: trade.createdAt.toISOString(),
            updatedAt: trade.updatedAt.toISOString(),
          })),
          trades: user.holdings,
        };
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },
  Mutation: {
    registerUser: async (_, { newUser }) => {
      try {
        await UserAuthRules.validate(newUser);

        // Is email exists
        const isEmailExist = await User.exists({ email: newUser.email });
        if (isEmailExist) {
          const err = new Error("Email is already used!");
          err.status = 422;
          throw err;
        }

        const hashedPassword = await bcypt.hash(newUser.password, 12);
        // Store
        const user = await User.create({
          email: newUser.email,
          password: hashedPassword,
        });

        const payload = {
          _id: user._id,
          email: user.email,
          balance: user.balance,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };

        // Generate token
        const token = generateJWTToken(payload);

        return {
          token,
          user: payload,
        };
      } catch (error) {
        throw new ApolloError(error.message, error.state);
      }
    },
  },
};
