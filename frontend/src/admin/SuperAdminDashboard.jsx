
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    FiHome,
    FiUsers,
    FiShoppingBag,
    FiPackage,
    FiUser,
    FiLogOut,
    FiExternalLink,
    FiRefreshCw,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiCheckCircle,
    FiXCircle,
    FiMenu,
    FiX,
    FiSearch,
    FiDollarSign,
    FiAlertCircle,
    FiShield,
} from "react-icons/fi";

import "../css/super-admin.css";

const API = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use((config) => {
    const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const emptyForm = {
    name: "",
    email: "",
    phone: "",
    password: "",
};

const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome },
    { id: "admins", label: "Admin Management", icon: FiShield },
    { id: "orders", label: "Order Management", icon: FiShoppingBag },
    { id: "customers", label: "Customer Management", icon: FiUsers },
    { id: "profile", label: "My Profile", icon: FiUser },
];

const formatMoney = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
        ? "—"
        : parsed.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          });
};

const getErrorMessage = (error) =>
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again.";

export default function SuperAdminDashboard() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [admins, setAdmins] = useState([]);

    const [search, setSearch] = useState("");
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const storeUrl =
        import.meta.env.VITE_STORE_URL || "/";

    const loadDashboard = useCallback(async () => {
        const response = await API.get("/admin/stats");
        setStats(response.data.stats || {});
    }, []);

    const loadAdmins = useCallback(async () => {
        const response = await API.get("/super-admin/admins");
        setAdmins(response.data.admins || []);
    }, []);

    const loadOrders = useCallback(async () => {
        const response = await API.get("/admin/recent-orders");
        setOrders(response.data.orders || []);
    }, []);

    const loadActiveSection = useCallback(async () => {
        setLoading(true);
        setError("");
        setNotice("");

        try {
            if (activeTab === "dashboard") {
                await Promise.all([
                    loadDashboard(),
                    loadOrders(),
                ]);
            } else if (activeTab === "admins") {
                await loadAdmins();
            } else if (activeTab === "orders") {
                const response = await API.get("/admin/orders");
                setOrders(response.data.orders || []);
            } else if (activeTab === "customers") {
                setNotice(
                    "Customer Management needs customer-list and customer-order-history endpoints in the backend. No customer data is being simulated."
                );
            } else if (activeTab === "profile") {
                setNotice(
                    "Profile editing needs Super Admin profile endpoints in the backend. Your account details are not being changed from this page."
                );
            }
        } catch (err) {
            setError(getErrorMessage(err));

            if (err.response?.status === 401) {
                setError(
                    "Your session is missing or expired. Please sign in again."
                );
            } else if (err.response?.status === 403) {
                setError(
                    "Access denied. Sign in with a Super Admin account."
                );
            }
        } finally {
            setLoading(false);
        }
    }, [
        activeTab,
        loadDashboard,
        loadOrders,
        loadAdmins,
    ]);

    useEffect(() => {
        loadActiveSection();
    }, [loadActiveSection]);

    const changeTab = (tab) => {
        setActiveTab(tab);
        setSidebarOpen(false);
        setError("");
        setNotice("");
        setSearch("");
        setEditingAdmin(null);
        setForm(emptyForm);
    };

    const startCreateAdmin = () => {
        setEditingAdmin(null);
        setForm(emptyForm);
        setError("");
        setNotice("");
    };

    const startEditAdmin = (admin) => {
        setEditingAdmin(admin);
        setForm({
            name: admin.name || "",
            email: admin.email || "",
            phone: admin.phone || "",
            password: "",
        });
        setError("");
        setNotice("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSaveAdmin = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setNotice("");

        try {
            if (editingAdmin) {
                const payload = {
                    name: form.name.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                };

                if (form.password.trim()) {
                    payload.password = form.password;
                }

                const response = await API.put(
                    `/super-admin/admins/${editingAdmin.id}`,
                    payload
                );

                setNotice(
                    response.data.message ||
                        "Admin updated successfully."
                );
            } else {
                const response = await API.post(
                    "/super-admin/admins",
                    {
                        name: form.name.trim(),
                        email: form.email.trim(),
                        phone: form.phone.trim(),
                        password: form.password,
                    }
                );

                setNotice(
                    response.data.message ||
                        "Admin created successfully."
                );
            }

            setEditingAdmin(null);
            setForm(emptyForm);
            await loadAdmins();
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const handleAdminStatus = async (admin) => {
        const isActive = admin.status === "active";

        const action = isActive ? "deactivate" : "activate";

        if (
            !window.confirm(
                `Are you sure you want to ${action} ${admin.name}?`
            )
        ) {
            return;
        }

        setError("");
        setNotice("");

        try {
            const response = await API.put(
                `/super-admin/admins/${admin.id}/${action}`
            );

            setNotice(
                response.data.message ||
                    `Admin ${action}d successfully.`
            );

            await loadAdmins();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    const handleDeleteAdmin = async (admin) => {
        if (
            !window.confirm(
                `Delete admin ${admin.name}? This action cannot be undone.`
            )
        ) {
            return;
        }

        setError("");
        setNotice("");

        try {
            const response = await API.delete(
                `/super-admin/admins/${admin.id}`
            );

            setNotice(
                response.data.message ||
                    "Admin deleted successfully."
            );

            if (editingAdmin?.id === admin.id) {
                setEditingAdmin(null);
                setForm(emptyForm);
            }

            await loadAdmins();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    const handleLogout = () => {
        // Keep the customer token untouched.
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/login");
    };

    const filteredAdmins = admins.filter((admin) => {
        const term = search.toLowerCase();

        return [
            admin.name,
            admin.email,
            admin.phone,
            admin.status,
        ].some((value) =>
            String(value || "").toLowerCase().includes(term)
        );
    });

    const filteredOrders = orders.filter((order) => {
        const term = search.toLowerCase();

        return [
            order.order_number,
            order.customer_name,
            order.customer_email,
            order.status,
            order.payment_status,
        ].some((value) =>
            String(value || "").toLowerCase().includes(term)
        );
    });

    const pageTitle =
        menuItems.find((item) => item.id === activeTab)?.label ||
        "Dashboard";

    const StatCard = ({ title, value, icon: Icon, tone, detail }) => (
        <div className={`sa-stat-card ${tone}`}>
            <div className="sa-stat-top">
                <span>{title}</span>
                <span className="sa-stat-icon">
                    <Icon />
                </span>
            </div>

            <div className="sa-stat-value">{value}</div>

            <div className="sa-stat-detail">{detail}</div>
        </div>
    );

    return (
        <div className="sa-app">
            {sidebarOpen && (
                <button
                    type="button"
                    className="sa-sidebar-overlay"
                    aria-label="Close navigation"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`sa-sidebar ${
                    sidebarOpen ? "sa-sidebar-open" : ""
                }`}
            >
                <div className="sa-brand">
                    <div className="sa-brand-icon">
                        <FiShoppingBag />
                    </div>

                    <div>
                        <h2>Fashion Store</h2>
                        <p>Super Admin</p>
                    </div>

                    <button
                        type="button"
                        className="sa-mobile-close"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close menu"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="sa-menu-heading">
                    MANAGEMENT
                </div>

                <nav className="sa-nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                type="button"
                                key={item.id}
                                className={
                                    activeTab === item.id
                                        ? "sa-nav-item active"
                                        : "sa-nav-item"
                                }
                                onClick={() => changeTab(item.id)}
                            >
                                <Icon />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="sa-sidebar-bottom">
                    <a
                        className="sa-store-link"
                        href={storeUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FiExternalLink />
                        <span>View Store</span>
                    </a>

                    <button
                        type="button"
                        className="sa-logout"
                        onClick={handleLogout}
                    >
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="sa-main">
                <header className="sa-topbar">
                    <button
                        type="button"
                        className="sa-mobile-menu"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                    >
                        <FiMenu />
                    </button>

                    <div>
                        <h1>{pageTitle}</h1>
                        <p>
                            Welcome to your fashion store control center.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="sa-refresh-btn"
                        onClick={loadActiveSection}
                        disabled={loading}
                    >
                        <FiRefreshCw
                            className={loading ? "sa-spinning" : ""}
                        />
                        <span>Refresh</span>
                    </button>
                </header>

                <section className="sa-content">
                    {error && (
                        <div className="sa-alert sa-alert-error">
                            <FiAlertCircle />
                            <span>{error}</span>
                            <button
                                type="button"
                                onClick={() => setError("")}
                                aria-label="Dismiss error"
                            >
                                <FiX />
                            </button>
                        </div>
                    )}

                    {notice && (
                        <div className="sa-alert sa-alert-success">
                            <FiCheckCircle />
                            <span>{notice}</span>
                            <button
                                type="button"
                                onClick={() => setNotice("")}
                                aria-label="Dismiss message"
                            >
                                <FiX />
                            </button>
                        </div>
                    )}

                    {loading && (
                        <div className="sa-loading">
                            <span className="sa-spinner" />
                            Loading your data...
                        </div>
                    )}

                    {!loading && activeTab === "dashboard" && (
                        <>
                            <div className="sa-welcome-card">
                                <div>
                                    <span className="sa-eyebrow">
                                        STORE OVERVIEW
                                    </span>
                                    <h2>
                                        Your business, at a glance
                                    </h2>
                                    <p>
                                        Review store performance and recent
                                        customer orders.
                                    </p>
                                </div>

                                <div className="sa-welcome-art">
                                    <FiShoppingBag />
                                </div>
                            </div>

                            <div className="sa-stats-grid">
                                <StatCard
                                    title="Total Customers"
                                    value={stats.totalCustomers ?? 0}
                                    icon={FiUsers}
                                    tone="tone-blue"
                                    detail="Registered customer accounts"
                                />

                                <StatCard
                                    title="Total Admins"
                                    value={stats.totalAdmins ?? 0}
                                    icon={FiShield}
                                    tone="tone-purple"
                                    detail="Admin accounts"
                                />

                                <StatCard
                                    title="Total Products"
                                    value={stats.totalProducts ?? 0}
                                    icon={FiPackage}
                                    tone="tone-peach"
                                    detail="Non-archived products"
                                />

                                <StatCard
                                    title="Total Orders"
                                    value={stats.totalOrders ?? 0}
                                    icon={FiShoppingBag}
                                    tone="tone-green"
                                    detail="Orders in the database"
                                />

                                <StatCard
                                    title="Paid Revenue"
                                    value={formatMoney(stats.totalRevenue)}
                                    icon={FiDollarSign}
                                    tone="tone-rose"
                                    detail="Orders marked as paid"
                                />

                                <StatCard
                                    title="Low Stock"
                                    value={stats.lowStockProducts ?? 0}
                                    icon={FiAlertCircle}
                                    tone="tone-yellow"
                                    detail="Variants with stock of 5 or less"
                                />
                            </div>

                            <div className="sa-panel">
                                <div className="sa-panel-heading">
                                    <div>
                                        <h2>Recent Orders</h2>
                                        <p>
                                            Latest orders from your store
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="sa-secondary-btn"
                                        onClick={() => changeTab("orders")}
                                    >
                                        View All Orders
                                    </button>
                                </div>

                                <div className="sa-table-wrap">
                                    <table className="sa-table">
                                        <thead>
                                            <tr>
                                                <th>Order</th>
                                                <th>Customer</th>
                                                <th>Date</th>
                                                <th>Total</th>
                                                <th>Payment</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {orders.slice(0, 6).map((order) => (
                                                <tr key={order.id}>
                                                    <td>
                                                        {order.order_number ||
                                                            `#${order.id}`}
                                                    </td>
                                                    <td>
                                                        <strong>
                                                            {order.customer_name ||
                                                                "Customer"}
                                                        </strong>
                                                        <small>
                                                            {order.customer_email ||
                                                                ""}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        {formatDate(
                                                            order.created_at
                                                        )}
                                                    </td>
                                                    <td>
                                                        {formatMoney(order.total)}
                                                    </td>
                                                    <td>
                                                        <span className="sa-status">
                                                            {order.payment_status ||
                                                                "unknown"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="sa-status">
                                                            {order.status ||
                                                                "unknown"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}

                                            {orders.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan="6"
                                                        className="sa-empty"
                                                    >
                                                        No orders found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {!loading && activeTab === "admins" && (
                        <>
                            <div className="sa-section-intro">
                                <div>
                                    <h2>Admin Management</h2>
                                    <p>
                                        Create and manage staff accounts for
                                        your fashion store.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="sa-primary-btn"
                                    onClick={startCreateAdmin}
                                >
                                    <FiPlus />
                                    Add Admin
                                </button>
                            </div>

                            <div className="sa-panel sa-form-panel">
                                <div className="sa-panel-heading">
                                    <div>
                                        <h2>
                                            {editingAdmin
                                                ? "Edit Admin"
                                                : "Create New Admin"}
                                        </h2>
                                        <p>
                                            {editingAdmin
                                                ? "Update account details. Leave password blank to keep it unchanged."
                                                : "New accounts will receive the admin role."}
                                        </p>
                                    </div>

                                    {editingAdmin && (
                                        <button
                                            type="button"
                                            className="sa-secondary-btn"
                                            onClick={startCreateAdmin}
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>

                                <form
                                    className="sa-admin-form"
                                    onSubmit={handleSaveAdmin}
                                >
                                    <label>
                                        Full Name
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleFormChange}
                                            placeholder="Enter admin name"
                                            required
                                            maxLength={100}
                                        />
                                    </label>

                                    <label>
                                        Email Address
                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleFormChange}
                                            placeholder="admin@example.com"
                                            required
                                            maxLength={254}
                                        />
                                    </label>

                                    <label>
                                        Phone Number
                                        <input
                                            name="phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={handleFormChange}
                                            placeholder="Enter phone number"
                                            maxLength={25}
                                        />
                                    </label>

                                    <label>
                                        {editingAdmin
                                            ? "New Password (optional)"
                                            : "Password"}
                                        <input
                                            name="password"
                                            type="password"
                                            value={form.password}
                                            onChange={handleFormChange}
                                            placeholder={
                                                editingAdmin
                                                    ? "Leave blank to keep current password"
                                                    : "Create a password"
                                            }
                                            required={!editingAdmin}
                                            minLength={8}
                                            autoComplete="new-password"
                                        />
                                    </label>

                                    <div className="sa-form-actions">
                                        <button
                                            type="submit"
                                            className="sa-primary-btn"
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Saving..."
                                                : editingAdmin
                                                  ? "Save Changes"
                                                  : "Create Admin"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="sa-panel">
                                <div className="sa-panel-heading">
                                    <div>
                                        <h2>Admin Accounts</h2>
                                        <p>
                                            {admins.length} account(s)
                                        </p>
                                    </div>

                                    <div className="sa-search">
                                        <FiSearch />
                                        <input
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(event.target.value)
                                            }
                                            placeholder="Search admins..."
                                        />
                                    </div>
                                </div>

                                <div className="sa-table-wrap">
                                    <table className="sa-table">
                                        <thead>
                                            <tr>
                                                <th>Admin</th>
                                                <th>Phone</th>
                                                <th>Created</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredAdmins.map((admin) => (
                                                <tr key={admin.id}>
                                                    <td>
                                                        <strong>
                                                            {admin.name}
                                                        </strong>
                                                        <small>
                                                            {admin.email}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        {admin.phone || "—"}
                                                    </td>
                                                    <td>
                                                        {formatDate(
                                                            admin.created_at
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`sa-badge ${
                                                                admin.status ===
                                                                "active"
                                                                    ? "is-active"
                                                                    : "is-inactive"
                                                            }`}
                                                        >
                                                            {admin.status ||
                                                                "unknown"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="sa-action-group">
                                                            <button
                                                                type="button"
                                                                className="sa-icon-btn edit"
                                                                title="Edit admin"
                                                                onClick={() =>
                                                                    startEditAdmin(
                                                                        admin
                                                                    )
                                                                }
                                                            >
                                                                <FiEdit2 />
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="sa-icon-btn toggle"
                                                                title={
                                                                    admin.status ===
                                                                    "active"
                                                                        ? "Deactivate admin"
                                                                        : "Activate admin"
                                                                }
                                                                onClick={() =>
                                                                    handleAdminStatus(
                                                                        admin
                                                                    )
                                                                }
                                                            >
                                                                {admin.status ===
                                                                "active" ? (
                                                                    <FiXCircle />
                                                                ) : (
                                                                    <FiCheckCircle />
                                                                )}
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="sa-icon-btn delete"
                                                                title="Delete admin"
                                                                onClick={() =>
                                                                    handleDeleteAdmin(
                                                                        admin
                                                                    )
                                                                }
                                                            >
                                                                <FiTrash2 />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                            {filteredAdmins.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="sa-empty"
                                                    >
                                                        No matching admins found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {!loading && activeTab === "orders" && (
                        <div className="sa-panel">
                            <div className="sa-panel-heading">
                                <div>
                                    <h2>All Orders</h2>
                                    <p>
                                        Orders retrieved from your database
                                    </p>
                                </div>

                                <div className="sa-search">
                                    <FiSearch />
                                    <input
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search orders..."
                                    />
                                </div>
                            </div>

                            <div className="sa-table-wrap">
                                <table className="sa-table">
                                    <thead>
                                        <tr>
                                            <th>Order Number</th>
                                            <th>Customer</th>
                                            <th>Order Date</th>
                                            <th>Payment Method</th>
                                            <th>Payment Status</th>
                                            <th>Order Status</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td>
                                                    {order.order_number ||
                                                        `#${order.id}`}
                                                </td>
                                                <td>
                                                    <strong>
                                                        {order.customer_name ||
                                                            "Customer"}
                                                    </strong>
                                                    <small>
                                                        {order.customer_email ||
                                                            ""}
                                                    </small>
                                                </td>
                                                <td>
                                                    {formatDate(order.created_at)}
                                                </td>
                                                <td>
                                                    {order.payment_method ||
                                                        "—"}
                                                </td>
                                                <td>
                                                    <span className="sa-status">
                                                        {order.payment_status ||
                                                            "unknown"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="sa-status">
                                                        {order.status ||
                                                            "unknown"}
                                                    </span>
                                                </td>
                                                <td>
                                                    {formatMoney(order.total)}
                                                </td>
                                            </tr>
                                        ))}

                                        {filteredOrders.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="sa-empty"
                                                >
                                                    No matching orders found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {!loading &&
                        (activeTab === "customers" ||
                            activeTab === "profile") && (
                            <div className="sa-panel sa-coming-soon">
                                <div className="sa-coming-icon">
                                    {activeTab === "customers" ? (
                                        <FiUsers />
                                    ) : (
                                        <FiUser />
                                    )}
                                </div>

                                <h2>
                                    {activeTab === "customers"
                                        ? "Customer Management"
                                        : "My Profile"}
                                </h2>

                                <p>
                                    {notice ||
                                        "This feature requires its backend endpoints before it can be connected to your database."}
                                </p>

                                <button
                                    type="button"
                                    className="sa-secondary-btn"
                                    onClick={() => changeTab("dashboard")}
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        )}
                </section>

                <footer className="sa-footer">
                    <span>
                        Fashion Store · Super Admin Panel
                    </span>
                    <span>Store management dashboard</span>
                </footer>
            </main>
        </div>
    );
}

