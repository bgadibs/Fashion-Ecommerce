
import axios from "axios";


// =====================================================
// CUSTOMER API
// =====================================================

const API = axios.create({
    baseURL: "http://localhost:5000/api",

    headers: {
        "Content-Type": "application/json",
    },
});


// =====================================================
// CUSTOMER TOKEN
// =====================================================

API.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {

        return Promise.reject(error);
    }
);


// =====================================================
// CATEGORIES
// =====================================================

export const getCategories = () =>
    API.get("/categories");


// =====================================================
// PRODUCTS
// =====================================================

export const getProducts = (params = {}) =>
    API.get("/products", {
        params,
    });


export const getProductById = (id) =>
    API.get(`/products/${id}`);


// =====================================================
// AUTH
// =====================================================

export const registerUser = (data) =>
    API.post("/auth/register", data);


export const loginUser = (data) =>
    API.post("/auth/login", data);


export const getCurrentUser = () =>
    API.get("/auth/me");


// =====================================================
// ADDRESSES
// =====================================================

export const getAddresses = () =>
    API.get("/addresses");


export const addAddress = (address) =>
    API.post("/addresses", address);


export const setDefaultAddress = (id) =>
    API.put(`/addresses/${id}/default`);


export const deleteAddress = (id) =>
    API.delete(`/addresses/${id}`);


// =====================================================
// ORDERS - CUSTOMER
// =====================================================

export const createOrder = (orderData) =>
    API.post("/orders", orderData);


export const getOrders = () =>
    API.get("/orders");


export const getOrder = (id) =>
    API.get(`/orders/${id}`);


// =====================================================
// CART
// =====================================================

export const getCart = () =>
    API.get("/cart");


export const addToCart = (data) =>
    API.post("/cart", data);


export const updateCartQuantity = (
    id,
    quantity
) =>
    API.put(
        `/cart/${id}`,
        {
            quantity,
        }
    );


export const removeFromCart = (id) =>
    API.delete(`/cart/${id}`);


// =====================================================
// WISHLIST
// =====================================================

export const getWishlist = () =>
    API.get("/wishlist");


export const addToWishlist = (data) =>
    API.post("/wishlist", data);


export const removeFromWishlist = (id) =>
    API.delete(`/wishlist/${id}`);


// =====================================================
// ADMIN API
// =====================================================

export const ADMIN_API = axios.create({
    baseURL: "http://localhost:5000/api"
});


// =====================================================
// ADMIN TOKEN
// =====================================================

ADMIN_API.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("adminToken");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {

        return Promise.reject(error);
    }
);


// =====================================================
// ADMIN DASHBOARD
// =====================================================

export const getAdminStats = () =>
    ADMIN_API.get("/admin/stats");


// =====================================================
// ADMIN ORDERS
// =====================================================

export const getAdminOrders = () =>
    ADMIN_API.get("/admin/orders");


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

export const updateAdminOrderStatus = (
    orderId,
    status
) =>
    ADMIN_API.put(
        `/admin/orders/${orderId}/status`,
        {
            status,
        }
    );


// =====================================================
// RECENT ADMIN ORDERS
// =====================================================

export const getRecentAdminOrders = () =>
    ADMIN_API.get("/admin/recent-orders");


// =====================================================
// ADMIN CATEGORY STATISTICS
// =====================================================

export const getAdminCategoryStats = () =>
    ADMIN_API.get("/admin/category-stats");


// =====================================================
// ADMIN MONTHLY SALES
// =====================================================

export const getAdminMonthlySales = () =>
    ADMIN_API.get("/admin/monthly-sales");


// =====================================================
// ADMIN LOW STOCK
// =====================================================

export const getAdminLowStockProducts = () =>
    ADMIN_API.get("/admin/low-stock");


// =====================================================
// ADMIN PRODUCTS
// =====================================================


// -----------------------------------------------------
// GET ALL ADMIN PRODUCTS
// -----------------------------------------------------

export const getAdminProducts = () =>
    ADMIN_API.get("/admin/products");


// -----------------------------------------------------
// GET SINGLE ADMIN PRODUCT
// -----------------------------------------------------

export const getAdminProduct = (id) =>
    ADMIN_API.get(
        `/admin/products/${id}`
    );


// -----------------------------------------------------
// CREATE ADMIN PRODUCT
// Supports:
// 1. Image URL
// 2. Local image file
// -----------------------------------------------------

export const createAdminProduct = (
    productData
) => {

    const formData =
        new FormData();


    // -------------------------------------------------
    // PRODUCT INFORMATION
    // -------------------------------------------------

    formData.append(
        "name",
        productData.name
    );

    formData.append(
        "description",
        productData.description || ""
    );

    formData.append(
        "category_id",
        productData.category_id
    );

    formData.append(
        "brand",
        productData.brand || ""
    );

    formData.append(
        "sku",
        productData.sku || ""
    );

    formData.append(
        "base_price",
        productData.base_price
    );


    // -------------------------------------------------
    // SALE PRICE
    // -------------------------------------------------

    if (
        productData.sale_price !== null &&
        productData.sale_price !== undefined &&
        productData.sale_price !== ""
    ) {

        formData.append(
            "sale_price",
            productData.sale_price
        );
    }


    // -------------------------------------------------
    // FEATURED
    // -------------------------------------------------

    formData.append(
        "featured",
        productData.featured ? "1" : "0"
    );


    // -------------------------------------------------
    // STATUS
    // -------------------------------------------------

    formData.append(
        "status",
        productData.status || "active"
    );


    // -------------------------------------------------
    // IMAGE URL
    // -------------------------------------------------

    if (
        productData.image &&
        productData.image.trim()
    ) {

        formData.append(
            "image",
            productData.image.trim()
        );
    }


    // -------------------------------------------------
    // LOCAL IMAGE FILE
    // -------------------------------------------------

    if (productData.imageFile) {

        formData.append(
            "imageFile",
            productData.imageFile
        );
    }


    // -------------------------------------------------
    // VARIANTS
    // -------------------------------------------------

    formData.append(
        "variants",
        JSON.stringify(
            productData.variants || []
        )
    );


    // -------------------------------------------------
    // SEND REQUEST
    // -------------------------------------------------

    return ADMIN_API.post(
        "/admin/products",
        formData
    );
};


// -----------------------------------------------------
// UPDATE ADMIN PRODUCT
// Supports:
// 1. Image URL
// 2. Local image file
// -----------------------------------------------------

export const updateAdminProduct = (
    id,
    productData
) => {

    const formData =
        new FormData();


    // -------------------------------------------------
    // PRODUCT INFORMATION
    // -------------------------------------------------

    formData.append(
        "name",
        productData.name
    );

    formData.append(
        "description",
        productData.description || ""
    );

    formData.append(
        "category_id",
        productData.category_id
    );

    formData.append(
        "brand",
        productData.brand || ""
    );

    formData.append(
        "sku",
        productData.sku || ""
    );

    formData.append(
        "base_price",
        productData.base_price
    );


    // -------------------------------------------------
    // SALE PRICE
    // -------------------------------------------------

    if (
        productData.sale_price !== null &&
        productData.sale_price !== undefined &&
        productData.sale_price !== ""
    ) {

        formData.append(
            "sale_price",
            productData.sale_price
        );
    }


    // -------------------------------------------------
    // FEATURED
    // -------------------------------------------------

    formData.append(
        "featured",
        productData.featured ? "1" : "0"
    );


    // -------------------------------------------------
    // STATUS
    // -------------------------------------------------

    formData.append(
        "status",
        productData.status || "active"
    );


    // -------------------------------------------------
    // IMAGE URL
    // -------------------------------------------------

    if (
        productData.image &&
        productData.image.trim()
    ) {

        formData.append(
            "image",
            productData.image.trim()
        );
    }


    // -------------------------------------------------
    // LOCAL IMAGE FILE
    // -------------------------------------------------

    if (productData.imageFile) {

        formData.append(
            "imageFile",
            productData.imageFile
        );
    }


    // -------------------------------------------------
    // VARIANTS
    // -------------------------------------------------

    formData.append(
        "variants",
        JSON.stringify(
            productData.variants || []
        )
    );


    // -------------------------------------------------
    // SEND REQUEST
    // -------------------------------------------------

    return ADMIN_API.put(
        `/admin/products/${id}`,
        formData
    );
};


// =====================================================
// ARCHIVE PRODUCT
// =====================================================

export const archiveAdminProduct = (id) =>
    ADMIN_API.put(
        `/admin/products/${id}/archive`
    );


// =====================================================
// RESTORE PRODUCT
// =====================================================

export const restoreAdminProduct = (id) =>
    ADMIN_API.put(
        `/admin/products/${id}/restore`
    );


// =====================================================
// PERMANENT DELETE PRODUCT
// =====================================================

export const deleteAdminProduct = (id) =>
    ADMIN_API.delete(
        `/admin/products/${id}`
    );


// =====================================================
// SUPER ADMIN - ADMIN MANAGEMENT
// =====================================================


// -----------------------------------------------------
// GET ALL ADMINS
// -----------------------------------------------------

export const getSuperAdmins = () =>
    ADMIN_API.get(
        "/super-admin/admins"
    );


// -----------------------------------------------------
// GET SINGLE ADMIN
// -----------------------------------------------------

export const getSuperAdmin = (id) =>
    ADMIN_API.get(
        `/super-admin/admins/${id}`
    );


// -----------------------------------------------------
// CREATE ADMIN
// -----------------------------------------------------

export const createSuperAdmin = (data) =>
    ADMIN_API.post(
        "/super-admin/admins",
        data
    );


// -----------------------------------------------------
// UPDATE ADMIN
// -----------------------------------------------------

export const updateSuperAdmin = (
    id,
    data
) =>
    ADMIN_API.put(
        `/super-admin/admins/${id}`,
        data
    );


// -----------------------------------------------------
// ACTIVATE ADMIN
// -----------------------------------------------------

export const activateSuperAdmin = (id) =>
    ADMIN_API.put(
        `/super-admin/admins/${id}/activate`
    );


// -----------------------------------------------------
// DEACTIVATE ADMIN
// -----------------------------------------------------

export const deactivateSuperAdmin = (id) =>
    ADMIN_API.put(
        `/super-admin/admins/${id}/deactivate`
    );


// -----------------------------------------------------
// DELETE ADMIN
// -----------------------------------------------------

export const deleteSuperAdmin = (id) =>
    ADMIN_API.delete(
        `/super-admin/admins/${id}`
    );


// =====================================================
// HOME PAGE STATISTICS
// =====================================================

export const getHomeStats = () =>
    API.get("/home/stats");


// =====================================================
// CUSTOMER SETTINGS
// =====================================================

export const getCustomerSettings = () =>
    API.get("/customer-settings");


export const updateCustomerNotifications = (
    data
) =>
    API.put(
        "/customer-settings/notifications",
        data
    );


export const updateCustomerPrivacy = (
    data
) =>
    API.put(
        "/customer-settings/privacy",
        data
    );


export const updateCustomerProfile = (
    data
) =>
    API.put(
        "/customer-profile",
        data
    );


// =====================================================
// ADMIN SETTINGS
// =====================================================

export const getAdminSettings = () =>
    ADMIN_API.get(
        "/admin/settings"
    );


export const updateAdminSettings = (
    data
) =>
    ADMIN_API.put(
        "/admin/settings",
        data
    );


export const getPublicSettings = () =>
    API.get(
        "/admin/settings/public"
    );


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default API;

