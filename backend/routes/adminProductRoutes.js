
const express = require("express");

const router = express.Router();


// =====================================================
// CONTROLLERS
// =====================================================

const {

    getProducts,

    getProduct,

    createProduct,

    updateProduct,

    archiveProduct,

    restoreProduct,

    deleteProduct

} = require(
    "../controllers/adminProductController"
);


// =====================================================
// MIDDLEWARE
// =====================================================

const authMiddleware =
    require(
        "../middleware/authMiddleware"
    );


const roleMiddleware =
    require(
        "../middleware/roleMiddleware"
    );


// =====================================================
// PRODUCT IMAGE UPLOAD
// =====================================================

const uploadProductImage =
    require(
        "../middleware/uploadProductImage"
    );


// =====================================================
// GET ALL PRODUCTS
// =====================================================

router.get(

    "/",

    authMiddleware,

    roleMiddleware(
        "admin",
        "superadmin"
    ),

    getProducts

);


// =====================================================
// GET SINGLE PRODUCT
// =====================================================

router.get(

    "/:id",

    authMiddleware,

    roleMiddleware(
        "admin",
        "superadmin"
    ),

    getProduct

);


// =====================================================
// CREATE PRODUCT
// =====================================================

router.post(

    "/",

    authMiddleware,

    roleMiddleware(
        "admin",
        "superadmin"
    ),

    uploadProductImage.single(
        "imageFile"
    ),

    createProduct

);


// =====================================================
// UPDATE PRODUCT
// =====================================================

router.put(

    "/:id",

    authMiddleware,

    roleMiddleware(
        "admin",
        "superadmin"
    ),

    uploadProductImage.single(
        "imageFile"
    ),

    updateProduct

);


// =====================================================
// ARCHIVE PRODUCT
// =====================================================

router.put(

    "/:id/archive",

    authMiddleware,

    roleMiddleware(
        "admin",
        "superadmin"
    ),

    archiveProduct

);


// =====================================================
// RESTORE PRODUCT
// =====================================================

router.put(

    "/:id/restore",

    authMiddleware,

    roleMiddleware(
        "admin",
        "superadmin"
    ),

    restoreProduct

);


// =====================================================
// PERMANENT DELETE PRODUCT
// =====================================================

router.delete(

    "/:id",

    authMiddleware,

    roleMiddleware(
        "admin",
        "superadmin"
    ),

    deleteProduct

);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;

