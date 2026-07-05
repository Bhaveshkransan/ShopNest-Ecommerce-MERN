const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { getAdmin } = require("../controllers/analyticsController");

const router = express.Router();

router.get("/", protect, admin, getAdmin);

module.exports = router;