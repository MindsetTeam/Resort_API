const express = require("express");
const { getCustomers } = require("../controllers/customers");
const Customer = require("../models/Customer");

const router = express.Router();

const advancedFilter = require("../middleware/advancedFilter");

const { protect } = require("../middleware/isAuth");

router.use(protect);

router.get("/", advancedFilter(Customer), getCustomers);
module.exports = router;
