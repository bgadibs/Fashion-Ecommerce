const express = require("express");

const router = express.Router();

const {
    getCustomerSettings,
    updateNotifications,
    updatePrivacy
} = require("../controllers/customerSettingsController");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");


/* =========================================================
   GET SETTINGS
========================================================= */

router.get(
    "/",
    authMiddleware,
    roleMiddleware("customer"),
    getCustomerSettings
);


/* =========================================================
   UPDATE NOTIFICATIONS
========================================================= */

router.put(
    "/notifications",
    authMiddleware,
    roleMiddleware("customer"),
    updateNotifications
);


/* =========================================================
   UPDATE PRIVACY
========================================================= */

router.put(
    "/privacy",
    authMiddleware,
    roleMiddleware("customer"),
    updatePrivacy
);


module.exports = router;