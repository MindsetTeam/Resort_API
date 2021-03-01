const express = require("express");
const {
  getRooms,
  addRoom,
  getRoom,
  removeRoom,
  updateRoom,
  getRoomsBelong
} = require("../controllers/Rooms");
const Room = require("../models/Room");

const router = express.Router({ mergeParams: true });

const advancedFilter = require("../middleware/advancedFilter");
const { protect, authorize } = require("../middleware/isAuth");

router.use(protect);

router
  .route("/")
  .get(authorize("admin"), advancedFilter(Room), getRooms)
  .post(authorize("admin"), addRoom);

router.get('/belong', getRoomsBelong)

router.route("/:id").get(getRoom).put(updateRoom).delete(removeRoom);

module.exports = router;
