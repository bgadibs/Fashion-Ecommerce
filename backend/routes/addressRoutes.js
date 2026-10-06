const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getAddresses,
    addAddress,
    deleteAddress
} = require("../controllers/addressController");

router.use(authMiddleware);

router.get("/", getAddresses);

router.post("/", addAddress);

router.delete("/:id", deleteAddress);

module.exports = router;