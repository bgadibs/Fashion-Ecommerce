
const express = require("express");

const router = express.Router();

const {
    updateCustomerProfile
} = require(
    "../controllers/customerProfileController"
);

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");


/* =========================================================
   UPDATE CUSTOMER PROFILE
========================================================= */

router.put(
    "/",
    authMiddleware,
    roleMiddleware("customer"),
    updateCustomerProfile
);


module.exports = router;

