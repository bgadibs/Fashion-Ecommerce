
const express = require("express");

const router = express.Router();

const {
    register,
    login,
    me
} = require("../controllers/authController");

const authMiddleware =
    require("../middleware/authMiddleware");


// =====================================================
// CUSTOMER REGISTRATION
// =====================================================

router.post(
    "/register",
    register
);


// =====================================================
// MAIN LOGIN
// CUSTOMER + ADMIN + SUPER ADMIN
// =====================================================

router.post(
    "/login",
    login
);


// =====================================================
// CURRENT USER
// =====================================================

router.get(
    "/me",
    authMiddleware,
    me
);


module.exports = router;

