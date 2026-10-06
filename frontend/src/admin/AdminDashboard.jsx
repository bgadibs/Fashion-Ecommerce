import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { getAdminStats } from "../services/api";
import "../css/admin.css";

const AdminDashboard = () => {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalAdmins: 0,
        totalSuperAdmins: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStats = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAdminStats();

            console.log(
                "ADMIN STATS RESPONSE:",
                response.data
            );

            if (response.data.success) {
                setStats(response.data.stats);
            }

        } catch (err) {

            console.error(
                "ADMIN DASHBOARD ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load dashboard statistics"
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }).format(Number(amount || 0));
    };

    const getPercentage = (value) => {

        const total =
            Number(stats.totalOrders || 0);

        if (!total) {
            return 0;
        }

        return Math.round(
            (Number(value || 0) / total) * 100
        );
    };

    return (
        <AdminLayout>

            <div className="admin-dashboard">

                {/* =========================================
                    DASHBOARD HEADER
                ========================================= */}

                <div className="dashboard-header">

                    <div className="dashboard-title">

                        <span className="dashboard-eyebrow">
                            FASHION STORE
                        </span>

                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Manage your store, monitor orders,
                            products and customer activity.
                        </p>

                    </div>

                    <button
                        className="refresh-btn"
                        onClick={loadStats}
                        disabled={loading}
                    >
                        <span>
                            {loading ? "⟳" : "↻"}
                        </span>

                        {loading
                            ? "Refreshing..."
                            : "Refresh Data"}
                    </button>

                </div>


                {/* =========================================
                    ERROR
                ========================================= */}

                {error && (
                    <div className="dashboard-error">

                        <span>⚠️</span>

                        <div>
                            <strong>
                                Something went wrong
                            </strong>

                            <p>
                                {error}
                            </p>
                        </div>

                        <button
                            onClick={loadStats}
                        >
                            Try Again
                        </button>

                    </div>
                )}


                {/* =========================================
                    LOADING
                ========================================= */}

                {loading ? (

                    <div className="dashboard-loading">

                        <div className="dashboard-loader">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <h3>
                            Loading dashboard
                        </h3>

                        <p>
                            Fetching your latest store statistics...
                        </p>

                    </div>

                ) : (

                    <>

                        {/* =====================================
                            MAIN STATISTICS
                        ===================================== */}

                        <div className="dashboard-section-title">

                            <div>
                                <span>
                                    OVERVIEW
                                </span>

                                <h2>
                                    Store Performance
                                </h2>
                            </div>

                            <p>
                                Your store at a glance
                            </p>

                        </div>


                        <div className="stats-grid">

                            {/* PRODUCTS */}

                            <div className="stat-card stat-products">

                                <div className="stat-card-top">

                                    <div className="stat-icon">
                                        🛍️
                                    </div>

                                    <span className="stat-badge">
                                        Products
                                    </span>

                                </div>

                                <div className="stat-card-bottom">

                                    <h3>
                                        {stats.totalProducts}
                                    </h3>

                                    <p>
                                        Total Products
                                    </p>

                                </div>

                            </div>


                            {/* ORDERS */}

                            <div className="stat-card stat-orders">

                                <div className="stat-card-top">

                                    <div className="stat-icon">
                                        📦
                                    </div>

                                    <span className="stat-badge">
                                        Orders
                                    </span>

                                </div>

                                <div className="stat-card-bottom">

                                    <h3>
                                        {stats.totalOrders}
                                    </h3>

                                    <p>
                                        Total Orders
                                    </p>

                                </div>

                            </div>


                            {/* CUSTOMERS */}

                            <div className="stat-card stat-customers">

                                <div className="stat-card-top">

                                    <div className="stat-icon">
                                        👥
                                    </div>

                                    <span className="stat-badge">
                                        Customers
                                    </span>

                                </div>

                                <div className="stat-card-bottom">

                                    <h3>
                                        {stats.totalCustomers}
                                    </h3>

                                    <p>
                                        Registered Customers
                                    </p>

                                </div>

                            </div>


                            {/* REVENUE */}

                            <div className="stat-card stat-revenue">

                                <div className="stat-card-top">

                                    <div className="stat-icon">
                                        ₹
                                    </div>

                                    <span className="stat-badge">
                                        Revenue
                                    </span>

                                </div>

                                <div className="stat-card-bottom">

                                    <h3>
                                        {formatCurrency(
                                            stats.totalRevenue
                                        )}
                                    </h3>

                                    <p>
                                        Total Store Revenue
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            ORDER STATUS CARDS
                        ===================================== */}

                        <div className="order-overview">

                            <div className="dashboard-section-title">

                                <div>
                                    <span>
                                        ORDER STATUS
                                    </span>

                                    <h2>
                                        Order Overview
                                    </h2>
                                </div>

                            </div>


                            <div className="order-status-grid">

                                {/* PENDING */}

                                <div className="order-status-card pending">

                                    <div className="order-status-icon">
                                        ⏳
                                    </div>

                                    <div className="order-status-content">

                                        <span>
                                            Pending
                                        </span>

                                        <strong>
                                            {stats.pendingOrders}
                                        </strong>

                                        <small>
                                            {getPercentage(
                                                stats.pendingOrders
                                            )}
                                            % of orders
                                        </small>

                                    </div>

                                </div>


                                {/* DELIVERED */}

                                <div className="order-status-card delivered">

                                    <div className="order-status-icon">
                                        ✓
                                    </div>

                                    <div className="order-status-content">

                                        <span>
                                            Delivered
                                        </span>

                                        <strong>
                                            {stats.deliveredOrders}
                                        </strong>

                                        <small>
                                            {getPercentage(
                                                stats.deliveredOrders
                                            )}
                                            % of orders
                                        </small>

                                    </div>

                                </div>


                                {/* CANCELLED */}

                                <div className="order-status-card cancelled">

                                    <div className="order-status-icon">
                                        ×
                                    </div>

                                    <div className="order-status-content">

                                        <span>
                                            Cancelled
                                        </span>

                                        <strong>
                                            {stats.cancelledOrders}
                                        </strong>

                                        <small>
                                            {getPercentage(
                                                stats.cancelledOrders
                                            )}
                                            % of orders
                                        </small>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            ADMIN OVERVIEW
                        ===================================== */}

                        <div className="admin-overview-section">

                            <div className="dashboard-section-title">

                                <div>
                                    <span>
                                        TEAM
                                    </span>

                                    <h2>
                                        Administration
                                    </h2>
                                </div>

                            </div>


                            <div className="admin-overview-grid">

                                <div className="admin-overview-card">

                                    <div className="admin-overview-icon">
                                        👨‍💼
                                    </div>

                                    <div>

                                        <strong>
                                            {stats.totalAdmins}
                                        </strong>

                                        <span>
                                            Administrators
                                        </span>

                                    </div>

                                </div>


                                <div className="admin-overview-card">

                                    <div className="admin-overview-icon">
                                        👑
                                    </div>

                                    <div>

                                        <strong>
                                            {stats.totalSuperAdmins}
                                        </strong>

                                        <span>
                                            Super Administrators
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =====================================
                            QUICK ACTIONS
                        ===================================== */}

                        <div className="quick-actions">

                            <div className="dashboard-section-title">

                                <div>
                                    <span>
                                        SHORTCUTS
                                    </span>

                                    <h2>
                                        Quick Actions
                                    </h2>
                                </div>

                                <p>
                                    Manage your store faster
                                </p>

                            </div>


                            <div className="quick-action-buttons">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/admin/products"
                                        )
                                    }
                                    className="quick-action-card"
                                >

                                    <div className="quick-action-icon">
                                        🛍️
                                    </div>

                                    <div>
                                        <strong>
                                            Manage Products
                                        </strong>

                                        <span>
                                            View and edit products
                                        </span>
                                    </div>

                                    <b>
                                        →
                                    </b>

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/admin/products/add"
                                        )
                                    }
                                    className="quick-action-card"
                                >

                                    <div className="quick-action-icon">
                                        ＋
                                    </div>

                                    <div>
                                        <strong>
                                            Add Product
                                        </strong>

                                        <span>
                                            Add a new fashion item
                                        </span>
                                    </div>

                                    <b>
                                        →
                                    </b>

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/admin/orders"
                                        )
                                    }
                                    className="quick-action-card"
                                >

                                    <div className="quick-action-icon">
                                        📦
                                    </div>

                                    <div>
                                        <strong>
                                            Manage Orders
                                        </strong>

                                        <span>
                                            Check customer orders
                                        </span>
                                    </div>

                                    <b>
                                        →
                                    </b>

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/")
                                    }
                                    className="quick-action-card"
                                >

                                    <div className="quick-action-icon">
                                        🏪
                                    </div>

                                    <div>
                                        <strong>
                                            View Store
                                        </strong>

                                        <span>
                                            Open customer website
                                        </span>
                                    </div>

                                    <b>
                                        →
                                    </b>

                                </button>

                            </div>

                        </div>


                        {/* =====================================
                            BOTTOM SUMMARY
                        ===================================== */}

                        <div className="dashboard-bottom-summary">

                            <div className="summary-card">

                                <div className="summary-card-icon">
                                    ✦
                                </div>

                                <div>

                                    <span>
                                        STORE STATUS
                                    </span>

                                    <strong>
                                        Your store is active
                                    </strong>

                                    <p>
                                        All dashboard statistics
                                        are connected to your
                                        MySQL database.
                                    </p>

                                </div>

                                <div className="active-indicator">
                                    <i></i>
                                    Active
                                </div>

                            </div>

                        </div>

                    </>

                )}

            </div>

        </AdminLayout>
    );
};

export default AdminDashboard;