const express = require("express");
const {
  getBranches,
  addBranch,
  getBranch,
  removeBranch,
  updateBranch,
} = require("../controllers/branches");
const Branch = require("../models/Branch");

const router = express.Router();

const advancedFilter = require("../middleware/advancedFilter");
const { protect, authorize } = require("../middleware/isAuth");

const roomRouter = require("./rooms");
const userRouter = require("./users");

router.use("/:branchId/rooms", roomRouter);
router.use("/:branchId/users", userRouter);

router.use(protect);
router.use(authorize("admin"));

router
  .route("/")
  .get(
    advancedFilter(Branch, { path: "rooms users", select: "_id -branch" }),
  getBranches
  )
  .post(addBranch);

router.route("/:id").get(getBranch).put(updateBranch).delete(removeBranch);
module.exports = router;
