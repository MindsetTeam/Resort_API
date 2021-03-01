const express = require("express");
const { login, getMe } = require("../controllers/auth");
const { protect } = require("../middleware/isAuth");

const router = express.Router();

router.post("/login", login);
router.get("/me", protect, getMe);
module.exports = router;
