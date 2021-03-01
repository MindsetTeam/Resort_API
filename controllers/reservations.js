const Reservation = require("../models/Reservation");
const Customer = require("../models/Customer");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

module.exports = {
  // @desc Check In Reservation
  // @route GET /api/v1/reservations/:id/checkin
  // @access PRIVATE
  checkIn: asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      throw new ErrorResponse(
        "Reservation not found with id of " + req.params.id,
        404
      );
    }
    reservation.status = "checkIn";
    await reservation.save();
    res.status(200).json({
      success: true,
      data: reservation,
    });
  }),
  // @desc CheckOut Reservation
  // @route PUT /api/v1/reservations/:id/checkout
  // @access PRIVATE
  checkOut: asyncHandler(async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      throw new ErrorResponse(
        "Reservation not found with id of " + req.params.id,
        404
      );
    }
    reservation.status = "checkOut";
    await reservation.save();
    res.status(200).json({
      success: true,
      data: reservation,
    });
  }),
  // @desc Show Reservations
  // @route GET /api/v1/reservations
  // @access PRIVATE
  getReservations: asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResult);
  }),
  // @desc Show Single reservation
  // @route GET /api/v1/reservations/:id
  // @access PUBLIC
  getReservation: asyncHandler(async (req, res, next) => {
    let reservation = await Reservation.findById(req.params.id).populate(
      "customer"
    );
    if (!reservation) {
      throw new ErrorResponse(
        "Reservation not found with id of " + req.params.id,
        404
      );
    }
    res.status(200).json({
      success: true,
      data: reservation,
    });
  }),
  // @desc Create new reservation
  // @route POST /api/v1/reservations
  // @access PRIVATE
  addReservation: asyncHandler(async (req, res, next) => {
    const { customer, reservation } = req.body;
    let exitedCustomer = await Customer.findOne({
      phoneNumber: customer.phoneNumber,
    });
    if (!exitedCustomer) {
      exitedCustomer = await Customer.create(customer);
    } else {
      exitedCustomer.name = customer.name;
      exitedCustomer.cardId = customer.cardId;
      exitedCustomer = await exitedCustomer.save();
    }
    reservation.customer = exitedCustomer.id;
    reservation.agent = req.user.id;
    let reservationCreated = new Reservation(reservation);
   const createed= await reservationCreated.save().then(t => t.populate('room').execPopulate());
    res.status(200).json({
      success: true,
      data: { ...createed._doc, customer: exitedCustomer },
    });
  }),
  // @desc Update reservation
  // @route PUT /api/v1/reservations/:id
  // @access PRIVATE
  updateReservation: asyncHandler(async (req, res, next) => {
    const { customer, reservation } = req.body;
    if (customer) {
      await Customer.findByIdAndUpdate(customer.id, customer);
    }
    let reservationFound = await Reservation.findById(req.params.id);
    if (!reservationFound) {
      throw new ErrorResponse(
        "Reservation not found with id of " + req.params.id,
        404
      );
    }

    reservationFound = await Reservation.findByIdAndUpdate(
      req.params.id,
      reservation,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      data: reservationFound,
    });
  }),
  // @desc Delete reservation
  // @route DELETE /api/v1/reservations/:id
  // @access PRIVATE
  removeReservation: asyncHandler(async (req, res, next) => {
    let reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      throw new ErrorResponse(
        "Reservation not found with id of " + req.params.id,
        404
      );
    }
    await reservation.remove();
    res.status(200).json({
      success: true,
      data: {},
    });
  }),
};
