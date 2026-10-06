const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getCart,
    addToCart,
    updateCart,
    removeFromCart
} = require("../controllers/cartController");

router.use(authMiddleware);

router.get("/", getCart);

router.post("/", addToCart);

router.put("/:id", updateCart);

router.delete("/:id", removeFromCart);

module.exports = router;