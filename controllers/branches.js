const Branch = require("../models/Branch");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

module.exports = {
  // @desc Show branches
  // @route GET /api/v1/branches
  // @access PUBLIC
  getBranches: asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResult);
  }),
  // @desc Show Single branch
  // @route GET /api/v1/branches/:id
  // @access PUBLIC
  getBranch: asyncHandler(async (req, res, next) => {
    let branch = await Branch.findById(req.params.id).populate("rooms users");
    if (!branch) {
      throw new ErrorResponse(
        "Branch not found with id of " + req.params.id,
        404
      );
    }
    res.status(200).json({
      success: true,
      data: branch,
    });
  }),
  // @desc Create new branches
  // @access PRIVATE
  addBranch: asyncHandler(async (req, res, next) => {
    let branch = await Branch.create(req.body);
    res.status(200).json({
      success: true,
      data: branch,
    });
  }),
  // @desc Update branch
  // @route GET /api/v1/branches/:id
  // @access PRIVATE
  updateBranch: asyncHandler(async (req, res, next) => {
    let branch = await Branch.findById(req.params.id);
    if (!branch) {
      throw new ErrorResponse(
        "Branch not found with id of " + req.params.id,
        404
      );
    }
    branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: branch,
    });
  }),
  // @desc Delete branch
  // @route DELETE /api/v1/branches/:id
  // @access PRIVATE
  removeBranch: asyncHandler(async (req, res, next) => {
    let branch = await Branch.findById(req.params.id);
    if (!branch) {
      throw new ErrorResponse(
        "Branch not found with id of " + req.params.id,
        404
      );
    }
    await branch.remove();
    res.status(200).json({
      success: true,
      data: {},
    });
  }),
};
