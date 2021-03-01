const Room = require("../models/Room");
const Branch = require("../models/Branch");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

module.exports = {
  // @desc Show rooms belong to users
  // @route GET /api/v1/rooms/belong?startDate=Date,endDate=Date
  // @access PRIVATE
  getRoomsBelong: asyncHandler(async (req, res, next) => {
    let { startDate, endDate } = req.query;
    if (!startDate) {
      startDate = new Date().toLocaleDateString();
    }
    if (!endDate) {
      endDate = new Date(
        new Date(startDate).getTime() + 86400000
      ).toLocaleDateString();
    }
    const { role, branch } = req.user;
    const roomQuery = {
      branch,
    };
    if (role === "admin") {
      delete roomQuery.branch;
    }
    const result = await Room.find(roomQuery)
      .populate({ path: "branch", select: "name" })
      .populate({
        path: "reservation",
        match: {
          $or: [
            {
              startDate: {
                $gte: startDate,
                $lte: endDate,
              },
            },
            {
              endDate: {
                $gte: startDate,
                $lte: endDate,
              },
            },
            {
              startDate: {
                $lte: startDate,
              },
              endDate: {
                $gte: endDate,
              },
            },
          ],
        },
        options: {
          limit: 1,
          sort: { createdAt: -1 },
        },
      });
    res.status(200).json(result);
  }),
  // @desc Show rooms
  // @route GET /api/v1/rooms?
  // @access PRIVATE
  getRooms: asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResult);
  }),
  // @desc Show single room
  // @route GET /api/v1/rooms/:id
  // @access PRIVATE
  getRoom: asyncHandler(async (req, res, next) => {
    let room = await Room.findById(req.params.id).populate({
      path: "branch",
      select: "name address",
    });
    if (!room) {
      throw new ErrorResponse(
        "Room not found with id of " + req.params.id,
        404
      );
    }
    res.status(200).json({
      success: true,
      data: room,
    });
  }),
  // @desc Create new room
  // @route POST /api/v1/branches/:branchId/rooms
  // @access PRIVATE
  addRoom: asyncHandler(async (req, res, next) => {
    req.body.branch = req.params.branchId;
    let branch = await Branch.findById(req.body.branch);
    if (!branch) {
      throw new ErrorResponse(
        "Branch not found with id of " + req.body.branch,
        404
      );
    }

    let room = await Room.create(req.body);
    res.status(200).json({
      success: true,
      data: room,
    });
  }),
  // @desc Update room
  // @route PUT /api/v1/rooms/:id
  // @access PRIVATE
  updateRoom: asyncHandler(async (req, res, next) => {
    let room = await Room.findById(req.params.id);
    if (!room) {
      throw new ErrorResponse(
        "Room not found with id of " + req.params.id,
        404
      );
    }
    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: room,
    });
  }),
  // @desc Delete room
  // @route DELETE /api/v1/rooms/:id
  // @access PRIVATE
  removeRoom: asyncHandler(async (req, res, next) => {
    let room = await Room.findById(req.params.id);
    if (!room) {
      throw new ErrorResponse(
        "Room not found with id of " + req.params.id,
        404
      );
    }

    await room.remove();
    res.status(200).json({
      success: true,
      message: "Deleted",
      data: {},
    });
  }),
};
