const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["reserved", "checkIn", "checkOut"],
      default: "reserved",
    },
    customer: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Customer",
    },
    numPerson: Number,
    agent: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    room: [{ type: mongoose.Schema.ObjectId, ref: "Room" }],
    deposited: {
      type: Number,
      default: 0,
    },
    paidPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("Reservation", ReservationSchema);
