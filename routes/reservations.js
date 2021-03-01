const express = require("express");
const {
  getReservations,
  addReservation,
  getReservation,
  removeReservation,
  updateReservation,
  checkIn,
  checkOut,
} = require("../controllers/Reservations");
const Reservation = require("../models/Reservation");

const router = express.Router();

const advancedFilter = require("../middleware/advancedFilter");
const { protect, authorize } = require("../middleware/isAuth");

router.use(protect);

router
  .route("/")
  .get(
    advancedFilter(Reservation, {
      path: "room customer",
      populate: {
        path: "branch",
      },
    }),
    getReservations
  )
  .post(addReservation);

router
  .route("/:id")
  .get(getReservation)
  .put(updateReservation)
  .delete(removeReservation);
router.put("/:id/checkin", checkIn);
router.put("/:id/checkout", checkOut);

module.exports = router;
