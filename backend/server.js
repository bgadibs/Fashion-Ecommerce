
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
        origin: true,
        credentials: true
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


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
// SERVE FRONTEND
// =====================================================

const frontendPath =
    path.join(
        __dirname,
        "..",
        "frontend",
        "dist"
    );

app.use(
    express.static(frontendPath)
);


// =====================================================
// REACT SPA FALLBACK
// =====================================================

app.get(
    "/{*splat}",
    (req, res) => {

        res.sendFile(
            path.join(
                frontendPath,
                "index.html"
            )
        );

    }
);


// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "========================================"
        );

        console.error(
            "❌ SERVER ERROR"
        );

        console.error(
            "METHOD:",
            req.method
        );

        console.error(
            "URL:",
            req.originalUrl
        );

        console.error(
            "MESSAGE:",
            err.message
        );

        console.error(
            "STACK:",
            err.stack
        );

        console.error(
            "========================================"
        );

        res.status(500).json({
            success: false,
            message:
                err.message ||
                "Internal server error"
        });

    }
);


// =====================================================
// START SERVER
// =====================================================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

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

    }
);

