const asyncHandler = require("../middleware/asyncHandler");

module.exports = {
  // @desc Show customers
  // @route POST /api/v1/customers
  // @access PRIVATE
  getCustomers: asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResult);
  }),
};
