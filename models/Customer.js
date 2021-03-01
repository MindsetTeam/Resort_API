const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: String,
    cardId: {
      type: Number,
    },
    phoneNumber: {
      type: Number,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", CustomerSchema);
