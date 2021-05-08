const { Schema, model } = require("mongoose");

const stockSchema = new Schema(
  {
    name: {
      type: String,
      default: null,
      require: true,
    },
    qty: {
      type: Number,
      default: null,
      require: true,
    },
    ticker: {
      type: String,
      default: null,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Stock", stockSchema);
