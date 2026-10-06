const express = require("express");

const router = express.Router();

const {
    getHomeStats
} = require("../controllers/homeController");

// GET HOME PAGE STATISTICS
router.get("/stats", getHomeStats);

module.exports = router;