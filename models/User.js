const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please add a username"],
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      lowercase: true,
      trim: true,
      default: "user",
    },
    branch: {
      type: mongoose.Schema.ObjectId,
      ref: 'Branch'
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      select: false,
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

UserSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    next(new Error("Username already being used"));
  } else {
    next(error);
  }
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRED_DATE,
  });
};

module.exports = mongoose.model("User", UserSchema);
