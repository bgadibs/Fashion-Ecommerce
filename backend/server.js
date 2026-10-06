
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =====================================================
// PRODUCT IMAGE UPLOADS
// =====================================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Fashion Store API is running"
    });
});


// =====================================================
// ROUTES
// =====================================================

const authRoutes =
    require("./routes/authRoutes");

const categoryRoutes =
    require("./routes/categoryRoutes");

const productRoutes =
    require("./routes/productRoutes");

const cartRoutes =
    require("./routes/cartRoutes");

const wishlistRoutes =
    require("./routes/wishlistRoutes");

const addressRoutes =
    require("./routes/addressRoutes");

const orderRoutes =
    require("./routes/orderRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

const superAdminRoutes =
    require("./routes/superAdminRoutes");

const adminProductRoutes =
    require("./routes/adminProductRoutes");

const homeRoutes =
    require("./routes/homeRoutes");

const customerSettingsRoutes =
    require("./routes/customerSettingsRoutes");

const customerProfileRoutes =
    require("./routes/customerProfileRoutes");

const adminSettingsRoutes =
    require("./routes/adminSettingsRoutes");


// =====================================================
// ADMIN SETTINGS
// =====================================================

app.use(
    "/api/admin/settings",
    adminSettingsRoutes
);


// =====================================================
// CUSTOMER / AUTH ROUTES
// =====================================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/categories",
    categoryRoutes
);

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/cart",
    cartRoutes
);

app.use(
    "/api/wishlist",
    wishlistRoutes
);

app.use(
    "/api/addresses",
    addressRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/customer-settings",
    customerSettingsRoutes
);

app.use(
    "/api/customer-profile",
    customerProfileRoutes
);


// =====================================================
// ADMIN ROUTES
// =====================================================

app.use(
    "/api/admin",
    adminRoutes
);


// =====================================================
// ADMIN PRODUCT ROUTES
// =====================================================

app.use(
    "/api/admin/products",
    adminProductRoutes
);


// =====================================================
// SUPER ADMIN ROUTES
// =====================================================

app.use(
    "/api/super-admin",
    superAdminRoutes
);


// =====================================================
// HOME ROUTES
// =====================================================

app.use(
    "/api/home",
    homeRoutes
);


// =====================================================
// 404
// =====================================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });

});


// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

    console.error(
        "❌ SERVER ERROR:",
        err
    );

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});


// =====================================================
// START SERVER
// =====================================================

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        "========================================"
    );

    console.log(
        "🚀 Fashion Store Backend"
    );

    console.log(
        `🌐 http://localhost:${PORT}`
    );

    console.log(
        "========================================"
    );

});
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "..", "frontend", "dist");
    app.use(express.static(frontendPath));
    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}
