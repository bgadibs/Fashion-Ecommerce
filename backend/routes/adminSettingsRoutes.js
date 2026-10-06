
const express = require("express");

const router = express.Router();

const {
    getAdminSettings,
    updateAdminSettings,
    getPublicSettings
} = require("../controllers/adminSettingsController");

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");


/*
=========================================================
ADMIN SETTINGS
=========================================================
GET
/api/admin/settings
=========================================================
*/
router.get(
    "/",
    authMiddleware,
    roleMiddleware("admin", "superadmin"),
    getAdminSettings
);


/*
=========================================================
SAVE / UPDATE ADMIN SETTINGS
=========================================================
PUT
/api/admin/settings
=========================================================
*/
router.put(
    "/",
    authMiddleware,
    roleMiddleware("admin", "superadmin"),
    updateAdminSettings
);


/*
=========================================================
PUBLIC SETTINGS
=========================================================
GET
/api/admin/settings/public

This does not require admin login.
Customer website can use it.
=========================================================
*/
router.get(
    "/public",
    getPublicSettings
);


module.exports = router;

