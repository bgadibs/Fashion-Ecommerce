const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");

const {
    getAdmins,
    getAdmin,
    createAdmin,
    updateAdmin,
    activateAdmin,
    deactivateAdmin,
    deleteAdmin
} = require("../controllers/superAdminController");


// =====================================================
// SUPER ADMIN SECURITY
// =====================================================

router.use(authMiddleware);

router.use(
    roleMiddleware("superadmin")
);


// =====================================================
// ADMIN MANAGEMENT
// =====================================================

// GET ALL ADMINS
router.get(
    "/admins",
    getAdmins
);


// GET ONE ADMIN
router.get(
    "/admins/:id",
    getAdmin
);


// CREATE ADMIN
router.post(
    "/admins",
    createAdmin
);


// UPDATE ADMIN
router.put(
    "/admins/:id",
    updateAdmin
);


// ACTIVATE ADMIN
router.put(
    "/admins/:id/activate",
    activateAdmin
);


// DEACTIVATE ADMIN
router.put(
    "/admins/:id/deactivate",
    deactivateAdmin
);


// DELETE ADMIN
router.delete(
    "/admins/:id",
    deleteAdmin
);


module.exports = router;