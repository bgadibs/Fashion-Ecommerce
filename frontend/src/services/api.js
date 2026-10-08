import axios from "axios";

/* =========================================================
   CUSTOMER API
   ========================================================= */

const API = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------------------------------------------------
   CUSTOMER AUTH TOKEN
--------------------------------------------------------- */

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
   CATEGORIES
   ========================================================= */

export const getCategories = () => {
  return API.get("/categories");
};

/* =========================================================
   PRODUCTS
   ========================================================= */

export const getProducts = (params = {}) => {
  return API.get("/products", {
    params,
  });
};

export const getProductById = (id) => {
  return API.get(`/products/${id}`);
};

/* =========================================================
   CUSTOMER AUTH
   ========================================================= */

export const registerUser = (data) => {
  return API.post("/auth/register", data);
};

export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

export const getCurrentUser = () => {
  return API.get("/auth/me");
};

/* =========================================================
   ADDRESSES
   ========================================================= */

export const getAddresses = () => {
  return API.get("/addresses");
};

export const addAddress = (data) => {
  return API.post("/addresses", data);
};

export const setDefaultAddress = (id) => {
  return API.put(`/addresses/${id}/default`);
};

export const deleteAddress = (id) => {
  return API.delete(`/addresses/${id}`);
};

/* =========================================================
   ORDERS
   ========================================================= */

export const createOrder = (data) => {
  return API.post("/orders", data);
};

export const getOrders = () => {
  return API.get("/orders");
};

export const getOrder = (id) => {
  return API.get(`/orders/${id}`);
};

/* =========================================================
   CART
   ========================================================= */

export const getCart = () => {
  return API.get("/cart");
};

export const addToCart = (data) => {
  return API.post("/cart", data);
};

export const updateCartQuantity = (id, quantity) => {
  return API.put(`/cart/${id}`, {
    quantity,
  });
};

export const removeFromCart = (id) => {
  return API.delete(`/cart/${id}`);
};

/* =========================================================
   WISHLIST
   ========================================================= */

export const getWishlist = () => {
  return API.get("/wishlist");
};

export const addToWishlist = (data) => {
  return API.post("/wishlist", data);
};

export const removeFromWishlist = (id) => {
  return API.delete(`/wishlist/${id}`);
};

/* =========================================================
   EXPORT CUSTOMER API
   ========================================================= */

export { API };

/* =========================================================
   ADMIN API
   ========================================================= */

export const ADMIN_API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------------------------------------------------
   ADMIN TOKEN
--------------------------------------------------------- */

ADMIN_API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

export const getAdminStats = () => {
  return ADMIN_API.get("/admin/stats");
};

export const getHomeStats = () => {
  return ADMIN_API.get("/home/stats");
};

/* =========================================================
   ADMIN ORDERS
   ========================================================= */

export const getAdminOrders = (params = {}) => {
  return ADMIN_API.get("/admin/orders", {
    params,
  });
};

export const updateAdminOrderStatus = (id, status) => {
  return ADMIN_API.put(`/admin/orders/${id}/status`, {
    status,
  });
};

export const getRecentAdminOrders = () => {
  return ADMIN_API.get("/admin/orders/recent");
};

/* =========================================================
   ADMIN CATEGORY STATISTICS
   ========================================================= */

export const getAdminCategoryStats = () => {
  return ADMIN_API.get("/admin/category-stats");
};

export const getAdminMonthlySales = () => {
  return ADMIN_API.get("/admin/monthly-sales");
};

export const getAdminLowStockProducts = () => {
  return ADMIN_API.get("/admin/low-stock");
};

/* =========================================================
   ADMIN PRODUCTS
   ========================================================= */

export const getAdminProducts = (params = {}) => {
  return ADMIN_API.get("/admin/products", {
    params,
  });
};

export const getAdminProduct = (id) => {
  return ADMIN_API.get(`/admin/products/${id}`);
};

/* ---------------------------------------------------------
   CREATE ADMIN PRODUCT
--------------------------------------------------------- */

export const createAdminProduct = (data) => {
  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append("name", data.name);
  }

  if (data.description !== undefined) {
    formData.append("description", data.description);
  }

  if (data.category_id !== undefined) {
    formData.append("category_id", data.category_id);
  }

  if (data.brand !== undefined) {
    formData.append("brand", data.brand);
  }

  if (data.sku !== undefined) {
    formData.append("sku", data.sku);
  }

  if (data.base_price !== undefined) {
    formData.append("base_price", data.base_price);
  }

  if (data.sale_price !== undefined) {
    formData.append("sale_price", data.sale_price);
  }

  if (data.featured !== undefined) {
    formData.append("featured", data.featured);
  }

  if (data.status !== undefined) {
    formData.append("status", data.status);
  }

  if (data.image !== undefined) {
    formData.append("image", data.image);
  }

  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }

  if (data.variants !== undefined) {
    formData.append(
      "variants",
      typeof data.variants === "string"
        ? data.variants
        : JSON.stringify(data.variants)
    );
  }

  return ADMIN_API.post("/admin/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ---------------------------------------------------------
   UPDATE ADMIN PRODUCT
--------------------------------------------------------- */

export const updateAdminProduct = (id, data) => {
  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append("name", data.name);
  }

  if (data.description !== undefined) {
    formData.append("description", data.description);
  }

  if (data.category_id !== undefined) {
    formData.append("category_id", data.category_id);
  }

  if (data.brand !== undefined) {
    formData.append("brand", data.brand);
  }

  if (data.sku !== undefined) {
    formData.append("sku", data.sku);
  }

  if (data.base_price !== undefined) {
    formData.append("base_price", data.base_price);
  }

  if (data.sale_price !== undefined) {
    formData.append("sale_price", data.sale_price);
  }

  if (data.featured !== undefined) {
    formData.append("featured", data.featured);
  }

  if (data.status !== undefined) {
    formData.append("status", data.status);
  }

  if (data.image !== undefined) {
    formData.append("image", data.image);
  }

  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }

  if (data.variants !== undefined) {
    formData.append(
      "variants",
      typeof data.variants === "string"
        ? data.variants
        : JSON.stringify(data.variants)
    );
  }

  return ADMIN_API.put(`/admin/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* =========================================================
   PRODUCT ARCHIVE / RESTORE / DELETE
   ========================================================= */

export const archiveAdminProduct = (id) => {
  return ADMIN_API.put(`/admin/products/${id}/archive`);
};

export const restoreAdminProduct = (id) => {
  return ADMIN_API.put(`/admin/products/${id}/restore`);
};

export const deleteAdminProduct = (id) => {
  return ADMIN_API.delete(`/admin/products/${id}`);
};

/* =========================================================
   SUPER ADMIN MANAGEMENT
   ========================================================= */

export const getSuperAdmins = () => {
  return ADMIN_API.get("/super-admin/admins");
};

export const getSuperAdmin = (id) => {
  return ADMIN_API.get(`/super-admin/admins/${id}`);
};

export const createSuperAdmin = (data) => {
  return ADMIN_API.post("/super-admin/admins", data);
};

export const updateSuperAdmin = (id, data) => {
  return ADMIN_API.put(`/super-admin/admins/${id}`, data);
};

export const activateSuperAdmin = (id) => {
  return ADMIN_API.put(`/super-admin/admins/${id}/activate`);
};

export const deactivateSuperAdmin = (id) => {
  return ADMIN_API.put(`/super-admin/admins/${id}/deactivate`);
};

export const deleteSuperAdmin = (id) => {
  return ADMIN_API.delete(`/super-admin/admins/${id}`);
};

/* =========================================================
   CUSTOMER SETTINGS
   ========================================================= */

export const getCustomerSettings = () => {
  return API.get("/customer-settings");
};

export const updateCustomerNotifications = (data) => {
  return API.put("/customer-settings/notifications", data);
};

export const updateCustomerPrivacy = (data) => {
  return API.put("/customer-settings/privacy", data);
};

/* =========================================================
   CUSTOMER PROFILE
   ========================================================= */

export const updateCustomerProfile = (data) => {
  return API.put("/customer-profile", data);
};

/* =========================================================
   ADMIN SETTINGS
   ========================================================= */

export const getAdminSettings = () => {
  return ADMIN_API.get("/admin/settings");
};

export const updateAdminSettings = (data) => {
  return ADMIN_API.put("/admin/settings", data);
};

/* =========================================================
   PUBLIC SETTINGS
   ========================================================= */

export const getPublicSettings = () => {
  return API.get("/admin/settings/public");
};

// =====================================================
// FAQ API
// =====================================================

export const getPublicFaqs = () =>
    API.get("/faqs");



/* =========================================================
   DEFAULT EXPORT
   ========================================================= */

export default API;