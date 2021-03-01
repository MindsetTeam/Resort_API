const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      unique: true,
      required: [true, "Please add a room number"],
    },
    capacity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    branch: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Please add a branch"],
      ref: "Branch",
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

RoomSchema.virtual("reservation", {
  ref: "Reservation",
  localField: "_id",
  foreignField: "room",
});

module.exports = mongoose.model("Room", RoomSchema);
