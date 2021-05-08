const jwt = require("jsonwebtoken");

module.exports = (payload = {}) =>
  jwt.sign(payload, process.env.TOKEN_SECRET);
