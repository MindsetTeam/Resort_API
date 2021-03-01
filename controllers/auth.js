const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

const sendTokenResponse = (user, statusCode, res) => {
  const msInDate = 24 * 60 * 60 * 1000;
  const token = user.getSignedJwtToken();
  const { role, username, branch } = user;
  const returnUser = { role, username,branch };
  res.status(statusCode).json({
    success: true,
    data: {
      token,
      expireDate: new Date(
        +process.env.JWT_EXPIRED_DATE.split("d")[0] * msInDate + Date.now()
      ),
      user: returnUser,
    },
  });
};

module.exports = {
  // @desc login account
  // @route POST /api/v1/auth/login
  // @access PRIVATE
  login: asyncHandler(async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ErrorResponse("Fill the information to login", 400);
    }
    const user = await User.findOne({ username })
      .select("+password")
      .populate("branch");
    if (!user) {
      throw new ErrorResponse("Invalided credentials", 400);
    }
    const isMatchPassword = await user.matchPassword(password);
    if (!isMatchPassword) {
      throw new ErrorResponse("Invalided credentials", 400);
    }
    sendTokenResponse(user, 200, res);
  }),
  // @desc Get user Info
  // @route GET /api/v1/auth/me
  // @access PRIVATE
  getMe: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const { username, role } = user;
    res.status(200).json({
      success: true,
      data: { username, role },
    });
  }),
};
