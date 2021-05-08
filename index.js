const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer } = require("apollo-server-express");
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const PORT = 5000;
const DB_CONNECT_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.vrnuc.mongodb.net/${process.env.DB_NAME}?authSource=admin&replicaSet=atlas-11imru-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`;

const app = express();
app.use(cors());
app.use(bodyParser.json());
// bodyParser is needed just for POST.

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    // not sending original error
    console.log(err.message);
    return new Error(err.message);
  },
  context: async ({ req }) => {
    // get the user token from the headers
    const token = req.headers.authorization || "";
    let hasToken = false,
      isAuth = false,
      userId = null;
    if (token) {
      req.hasToken = true;
      const decodedToken = await jwt.verify(
        token.split(" ")[1],
        process.env.TOKEN_SECRET
      );
      req.userId = decodedToken._id;
      req.isAuth = true;

      hasToken = true;
      isAuth = true;
      userId = decodedToken._id;
    } else {
      req.hasToken = false;
      req.isAuth = false;
    }
    return { token, isAuth, userId, hasToken };
  },
});

server.start();
server.applyMiddleware({
  app,
  cors: true,
});

mongoose.connect(
  DB_CONNECT_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => {
    if (!err) {
      app.listen(PORT);
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    }
  }
);
