const mongoose = require("mongoose");

const BranchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
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

BranchSchema.virtual("rooms", {
  ref: "Room",
  localField: "_id",
  foreignField: "branch",
});
BranchSchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "branch",
});

module.exports = mongoose.model("Branch", BranchSchema);
