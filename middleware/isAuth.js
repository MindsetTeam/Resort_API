const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("./asyncHandler");
const User = require("../models/User");
module.exports = {
  protect: asyncHandler(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      throw new ErrorResponse("Not authorize to access this route", 401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ErrorResponse("User not found", 401);
    }
    req.user = user;
    next();
  }),

  authorize: (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ErrorResponse(
        "Your role not authorize to access this route",
        403
      );
    }
    next();
  },
};
