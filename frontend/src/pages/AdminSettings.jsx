
import { useEffect, useState } from "react";
import {
    getAdminSettings,
    updateAdminSettings
} from "../services/api";

import "../css/admin-settings.css";

const AdminSettings = () => {

    const [settings, setSettings] = useState({
        store_name: "",
        store_email: "",
        store_phone: "",
        store_address: "",
        currency: "",
        shipping_threshold: "",
        new_order_notification: false,
        low_stock_notification: false,
        customer_registration_notification: false,
        allow_order_cancellation: false
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    /*
    =====================================================
    LOAD SETTINGS
    =====================================================
    */
    useEffect(() => {
        loadSettings();
    }, []);


    const loadSettings = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAdminSettings();

            if (
                response.data &&
                response.data.success
            ) {

                const data =
                    response.data.settings;

                setSettings({
                    store_name:
                        data.store_name || "",

                    store_email:
                        data.store_email || "",

                    store_phone:
                        data.store_phone || "",

                    store_address:
                        data.store_address || "",

                    currency:
                        data.currency || "",

                    shipping_threshold:
                        data.shipping_threshold !== null &&
                        data.shipping_threshold !== undefined
                            ? data.shipping_threshold
                            : "",

                    new_order_notification:
                        Boolean(
                            data.new_order_notification
                        ),

                    low_stock_notification:
                        Boolean(
                            data.low_stock_notification
                        ),

                    customer_registration_notification:
                        Boolean(
                            data.customer_registration_notification
                        ),

                    allow_order_cancellation:
                        Boolean(
                            data.allow_order_cancellation
                        )
                });
            }

        } catch (err) {

            console.error(
                "LOAD ADMIN SETTINGS ERROR:",
                err
            );

            if (
                err.response &&
                err.response.status === 401
            ) {
                localStorage.removeItem(
                    "adminToken"
                );

                localStorage.removeItem(
                    "admin"
                );

                window.location.href =
                    "/login";

                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to load settings"
            );

        } finally {

            setLoading(false);
        }
    };


    /*
    =====================================================
    INPUT CHANGE
    =====================================================
    */
    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setSettings((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    /*
    =====================================================
    TOGGLE CHANGE
    =====================================================
    */
    const handleToggle = (event) => {

        const {
            name,
            checked
        } = event.target;

        setSettings((previous) => ({
            ...previous,
            [name]: checked
        }));
    };


    /*
    =====================================================
    SAVE SETTINGS
    =====================================================
    */
    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");


        try {

            setSaving(true);

            const response =
                await updateAdminSettings(
                    settings
                );

            if (
                response.data &&
                response.data.success
            ) {

                setMessage(
                    response.data.message ||
                    "Settings saved successfully"
                );

                // Reload values from MySQL
                await loadSettings();
            }

        } catch (err) {

            console.error(
                "SAVE ADMIN SETTINGS ERROR:",
                err
            );

            if (
                err.response &&
                err.response.status === 401
            ) {
                localStorage.removeItem(
                    "adminToken"
                );

                localStorage.removeItem(
                    "admin"
                );

                window.location.href =
                    "/login";

                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to save settings"
            );

        } finally {

            setSaving(false);
        }
    };


    /*
    =====================================================
    LOADING
    =====================================================
    */
    if (loading) {

        return (
            <div className="admin-settings-page">

                <div className="admin-settings-loading">
                    Loading settings...
                </div>

            </div>
        );
    }


    return (
        <div className="admin-settings-page">

            <div className="admin-settings-header">

                <div>
                    <span className="admin-settings-eyebrow">
                        STORE MANAGEMENT
                    </span>

                    <h1>
                        Admin Settings
                    </h1>

                    <p>
                        Manage your store information,
                        currency, shipping and notifications.
                    </p>
                </div>

            </div>


            {message && (
                <div className="admin-settings-success">
                    {message}
                </div>
            )}


            {error && (
                <div className="admin-settings-error">
                    {error}
                </div>
            )}


            <form
                className="admin-settings-form"
                onSubmit={handleSubmit}
            >

                {/* =========================================
                    STORE INFORMATION
                ========================================= */}

                <section className="settings-section">

                    <div className="settings-section-title">
                        <h2>
                            Store Information
                        </h2>

                        <p>
                            Basic information about your store.
                        </p>
                    </div>


                    <div className="settings-grid">

                        <div className="settings-field">

                            <label>
                                Store Name
                            </label>

                            <input
                                type="text"
                                name="store_name"
                                value={
                                    settings.store_name
                                }
                                onChange={handleChange}
                                placeholder="Enter store name"
                            />

                        </div>


                        <div className="settings-field">

                            <label>
                                Store Email
                            </label>

                            <input
                                type="email"
                                name="store_email"
                                value={
                                    settings.store_email
                                }
                                onChange={handleChange}
                                placeholder="Enter store email"
                            />

                        </div>


                        <div className="settings-field">

                            <label>
                                Store Phone
                            </label>

                            <input
                                type="text"
                                name="store_phone"
                                value={
                                    settings.store_phone
                                }
                                onChange={handleChange}
                                placeholder="Enter store phone"
                            />

                        </div>


                        <div className="settings-field">

                            <label>
                                Currency
                            </label>

                            <select
                                name="currency"
                                value={
                                    settings.currency
                                }
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select Currency
                                </option>

                                <option value="INR">
                                    INR - Indian Rupee
                                </option>

                                <option value="USD">
                                    USD - US Dollar
                                </option>

                                <option value="EUR">
                                    EUR - Euro
                                </option>

                                <option value="GBP">
                                    GBP - British Pound
                                </option>

                            </select>

                        </div>


                        <div className="settings-field settings-field-full">

                            <label>
                                Store Address
                            </label>

                            <textarea
                                name="store_address"
                                value={
                                    settings.store_address
                                }
                                onChange={handleChange}
                                placeholder="Enter store address"
                                rows="4"
                            />

                        </div>

                    </div>

                </section>


                {/* =========================================
                    SHIPPING
                ========================================= */}

                <section className="settings-section">

                    <div className="settings-section-title">

                        <h2>
                            Shipping
                        </h2>

                        <p>
                            Configure your store shipping threshold.
                        </p>

                    </div>


                    <div className="settings-grid">

                        <div className="settings-field">

                            <label>
                                Free Shipping Threshold
                            </label>

                            <input
                                type="number"
                                name="shipping_threshold"
                                value={
                                    settings.shipping_threshold
                                }
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="Enter amount"
                            />

                            <small>
                                Orders at or above this amount
                                can qualify for free shipping.
                            </small>

                        </div>

                    </div>

                </section>


                {/* =========================================
                    NOTIFICATIONS
                ========================================= */}

                <section className="settings-section">

                    <div className="settings-section-title">

                        <h2>
                            Notifications
                        </h2>

                        <p>
                            Control administrator notifications.
                        </p>

                    </div>


                    <div className="settings-toggle-list">

                        <label className="settings-toggle">

                            <div>
                                <strong>
                                    New Order Notification
                                </strong>

                                <span>
                                    Notify administrators when
                                    a new order is placed.
                                </span>
                            </div>

                            <input
                                type="checkbox"
                                name="new_order_notification"
                                checked={
                                    settings.new_order_notification
                                }
                                onChange={handleToggle}
                            />

                            <span className="toggle-slider"></span>

                        </label>


                        <label className="settings-toggle">

                            <div>
                                <strong>
                                    Low Stock Notification
                                </strong>

                                <span>
                                    Notify administrators when
                                    products have low stock.
                                </span>
                            </div>

                            <input
                                type="checkbox"
                                name="low_stock_notification"
                                checked={
                                    settings.low_stock_notification
                                }
                                onChange={handleToggle}
                            />

                            <span className="toggle-slider"></span>

                        </label>


                        <label className="settings-toggle">

                            <div>
                                <strong>
                                    Customer Registration Notification
                                </strong>

                                <span>
                                    Notify administrators when
                                    a new customer registers.
                                </span>
                            </div>

                            <input
                                type="checkbox"
                                name="customer_registration_notification"
                                checked={
                                    settings.customer_registration_notification
                                }
                                onChange={handleToggle}
                            />

                            <span className="toggle-slider"></span>

                        </label>


                        <label className="settings-toggle">

                            <div>
                                <strong>
                                    Allow Order Cancellation
                                </strong>

                                <span>
                                    Allow customers to cancel
                                    eligible orders.
                                </span>
                            </div>

                            <input
                                type="checkbox"
                                name="allow_order_cancellation"
                                checked={
                                    settings.allow_order_cancellation
                                }
                                onChange={handleToggle}
                            />

                            <span className="toggle-slider"></span>

                        </label>

                    </div>

                </section>


                {/* =========================================
                    SAVE
                ========================================= */}

                <div className="settings-actions">

                    <button
                        type="submit"
                        disabled={saving}
                        className="settings-save-button"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Settings"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default AdminSettings;

