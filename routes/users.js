const express = require("express");
const {
  getUsers,
  createUser,
  getUser,
  removeUser,
  updateUser,createAdmin
} = require("../controllers/users");
const User = require("../models/User");

const router = express.Router({mergeParams:true});

const advancedFilter = require("../middleware/advancedFilter");
const { protect, authorize } = require("../middleware/isAuth");

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedFilter(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(removeUser);
// router.route('/admin').post(createAdmin);
module.exports = router;
