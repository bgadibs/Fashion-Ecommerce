
const express = require("express");

const router = express.Router();

const {
    getCategories,
    getCategory
} = require("../controllers/categoryController");


// =====================================================
// GET ALL CATEGORIES
// GET /api/categories
// =====================================================

router.get(
    "/",
    getCategories
);


// =====================================================
// GET CATEGORY BY ID
// GET /api/categories/:id
// =====================================================

router.get(
    "/:id",
    getCategory
);


module.exports = router;

