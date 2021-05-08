const { Schema, model } = require("mongoose");

const tradeSchema = new Schema(
  {
    stockId: {
      type: Schema.Types.ObjectId,
      ref: "Stock",
      default: null,
      require: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      require: true,
    },
    qty: {
      type: Number,
      default: 0,
      require: true,
    },
    price: {
      type: Number,
      default: 0,
      require: true,
    },
    tradeType: {
      type: String,
      enum: ["BUY", "SELL"],
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Trade", tradeSchema);
