const { gql } = require("apollo-server-express");

module.exports = gql`
  extend type Query {
    loginUser(email: String!, password: String!): AuthUser!
    getMe: User!
    getMyDashboard: Dashboard!
  }

  extend type Mutation {
    registerUser(newUser: UserInput!): AuthUser!
  }

  input UserInput {
    email: String!
    password: String!
  }

  type User {
    _id: ID!
    email: String!
    balance: Int!
    createdAt: String!
    updatedAt: String!
  }

  type AuthUser {
    user: User!
    token: String!
  }

  type TradeQty {
    stockId: String!
    qty: Int!
  }

  type Dashboard {
    stocks: [Stock!]!
    userTrades: [Trade!]!
    trades: [TradeQty!]!
  }
`;
