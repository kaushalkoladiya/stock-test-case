const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      default: null,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 100000,
    },
    holdings: [
      {
        stockId: {
          type: Schema.Types.ObjectId,
          ref: "Stock",
        },
        qty: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
