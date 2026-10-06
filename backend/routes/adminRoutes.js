const express = require("express");

const router = express.Router();

const {
    getStats,
    getOrders,
    updateOrderStatus,
    getRecentOrders,
    getCategoryStats,
    getMonthlySales,
    getLowStockProducts
} = require("../controllers/adminController");

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");


// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get(
    "/stats",
    authMiddleware,
    roleMiddleware("admin", "superadmin"),
    getStats
);


// =====================================================
// ADMIN ORDERS
// =====================================================

router.get(
    "/orders",
    authMiddleware,
    roleMiddleware("admin", "superadmin"),
    getOrders
);


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

router.put(
    "/orders/:id/status",
    authMiddleware,
    roleMiddleware("admin", "superadmin"),
    updateOrderStatus
);


// =====================================================
// RECENT ORDERS
// =====================================================

router.get(
    "/recent-orders",
    authMiddleware,
    roleMiddleware("admin", "superadmin"),
    getRecentOrders
);


// =====================================================
// CATEGORY STATISTICS
// =====================================================

router.get(
    "/category-stats",
    authMiddleware,
    roleMiddleware("admin", "superadmin"),
    getCategoryStats
);


// =====================================================
// MONTHLY SALES
// =====================================================

router.get(
    "/monthly-sales",
    authMiddleware,
    roleMiddleware("admin", "superadmin"),
    getMonthlySales
);


// =====================================================
// LOW STOCK
// =====================================================

router.get(
    "/low-stock",
    authMiddleware,
    roleMiddleware("admin", "superadmin"),
    getLowStockProducts
);


module.exports = router;