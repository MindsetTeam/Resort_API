const User = require("../models/User");
const Branch = require("../models/Branch");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

module.exports = {
  // @desc Show users
  // @route GET /api/v1/users
  // @access PRIVATE/ADMIN
  getUsers: asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResult);
  }),
  // @desc Show user
  // @route GET /api/v1/user/:id
  // @access PRIVATE/ADMIN
  getUser: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ErrorResponse(`User ${req.params.id} not found`, 404);
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  }),
  // @desc create user
  // @route POST /api/v1/branches/:branchId/users
  // @access PRIVATE/ADMIN
  createUser: asyncHandler(async (req, res, next) => {
    const branch = await Branch.findById(req.params.branchId);
    if (!branch) {
      throw new ErrorResponse(`Branch ${req.params.branchId} not found`, 404);
    }
    req.body.branch = branch._id;
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
  }),
  // @desc update user
  // @route PUT /api/v1/users/:id
  // @access PRIVATE/ADMIN
  updateUser: asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: user,
    });
  }),
  // @desc Delete user
  // @route DELETE /api/v1/users
  // @access PRIVATE/ADMIN
  removeUser: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ErrorResponse("User not found", 404);
    }
    await user.remove();
    res.status(200).json({
      success: true,
      msg: `User id ${req.params.id} removed`,
      data: {
        id: req.params.id,
      },
    });
  }),
  // createAdmin: asyncHandler(async (req,res)=>{
  //   req.body.role = "admin";
  //   await User.create(req.body);
  // })
};
