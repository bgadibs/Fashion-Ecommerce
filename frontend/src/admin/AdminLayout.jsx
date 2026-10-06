import React from "react";
import {
    Link,
    useNavigate,
    useLocation
} from "react-router-dom";

import "../css/admin.css";

const AdminLayout = ({ children }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const adminData = JSON.parse(
        localStorage.getItem("admin") || "null"
    );

    const handleLogout = () => {

        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/login");
    };


    const isActive = (path) => {
        return location.pathname === path;
    };


    return (
        <div className="admin-layout">

            {/* =====================================================
                ADMIN SIDEBAR
            ===================================================== */}

            <aside className="admin-sidebar">

                {/* LOGO */}

                <div className="admin-logo">

                    <h2>
                        Fashion Store
                    </h2>

                    <p>
                        {adminData?.role === "superadmin"
                            ? "Super Admin Panel"
                            : "Admin Panel"}
                    </p>

                </div>


                {/* NAVIGATION */}

                <nav className="admin-nav">

                    {/* DASHBOARD */}

                    <Link
                        to="/admin/dashboard"
                        className={
                            isActive("/admin/dashboard")
                                ? "active"
                                : ""
                        }
                    >
                        📊 Dashboard
                    </Link>


                    {/* PRODUCTS */}

                    <Link
                        to="/admin/products"
                        className={
                            isActive("/admin/products")
                                ? "active"
                                : ""
                        }
                    >
                        🛍️ Products
                    </Link>


                    {/* ADD PRODUCT */}

                    <Link
                        to="/admin/products/add"
                        className={
                            isActive("/admin/products/add")
                                ? "active"
                                : ""
                        }
                    >
                        ➕ Add Product
                    </Link>


                    {/* ORDERS */}

                    <Link
                        to="/admin/orders"
                        className={
                            isActive("/admin/orders")
                                ? "active"
                                : ""
                        }
                    >
                        📦 Orders
                    </Link>


                    {/* ADMIN MANAGEMENT
                        SUPER ADMIN ONLY
                    */}

                    {adminData?.role === "superadmin" && (

                        <Link
                            to="/admin/admin-management"
                            className={
                                location.pathname.startsWith(
                                    "/admin/admin-management"
                                )
                                    ? "active"
                                    : ""
                            }
                        >
                            👨‍💼 Admin Management
                        </Link>

                    )}


                    {/* =================================================
                        VIEW STORE
                        IMPORTANT:
                        Goes to ADMIN STORE PREVIEW
                        NOT CUSTOMER HOME
                    ================================================= */}

                    <Link
                        to="/admin/store"
                        className={
                            location.pathname === "/admin/store"
                                ? "active"
                                : ""
                        }
                    >
                        🏪 View Store
                    </Link>

                    {/* =================================================
    SETTINGS
================================================= */}

                    <Link
                        to="/admin/settings"
                        className={
                            location.pathname === "/admin/settings"
                                ? "active"
                                : ""
                        }
                    >
                        ⚙️ Settings
                    </Link>


                    {/* LOGOUT */}

                    <button
                        type="button"
                        className="admin-logout"
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>

                </nav>

            </aside>


            {/* =====================================================
                ADMIN MAIN
            ===================================================== */}

            <main className="admin-main">

                {/* HEADER */}

                <header className="admin-header">

                    <div>

                        <h3>
                            {adminData?.role === "superadmin"
                                ? "Super Admin Panel"
                                : "Admin Panel"}
                        </h3>

                    </div>


                    {/* ADMIN USER */}

                    <div className="admin-user">

                        <strong>
                            {adminData?.name ||
                                "Administrator"}
                        </strong>

                        <span>
                            {adminData?.role ||
                                "admin"}
                        </span>

                    </div>

                </header>


                {/* PAGE CONTENT */}

                <section className="admin-content">

                    {children}

                </section>

            </main>

        </div>
    );
};

export default AdminLayout;