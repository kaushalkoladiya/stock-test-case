const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    getStocks: [Stock!]!
  }

  extend type Mutation {
    buyStock(buyStockInput: ExchangeStock): Trade!
    sellStock(sellStockInput: ExchangeStock): Trade!
  }

  input ExchangeStock {
    stockId: String!
    qty: Int!
    price: Int!
  }

  type Stock {
    _id: ID!
    name: String!
    qty: Int!
    ticker: String!
    createdAt: String!
    updatedAt: String!
  }

  type Trade {
    _id: ID!
    stock: Stock!
    user: User!
    qty: Int!
    price: Int!
    tradeType: TradeType!
    createdAt: String!
    updatedAt: String!
  }

  enum TradeType {
    BUY
    SELL
  }
`;
