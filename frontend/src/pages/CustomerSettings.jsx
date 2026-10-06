
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FiUser,
    FiLock,
    FiBell,
    FiShield,
    FiTrash2,
    FiSave,
    FiArrowLeft,
} from "react-icons/fi";

import {
    getCurrentUser,
    getCustomerSettings,
    updateCustomerNotifications,
    updateCustomerPrivacy,
    updateCustomerProfile,
} from "../services/api";

import "../css/customer-settings.css";

const CustomerSettings = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [activeSection, setActiveSection] =
        useState("profile");


    /* =====================================================
       PROFILE
    ===================================================== */

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
    });


    /* =====================================================
       PASSWORD
    ===================================================== */

    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });


    /* =====================================================
       NOTIFICATIONS
    ===================================================== */

    const [notifications, setNotifications] =
        useState({
            orderUpdates: true,
            deliveryUpdates: true,
            promotionalNotifications: false,
        });


    /* =====================================================
       PRIVACY
    ===================================================== */

    const [privacy, setPrivacy] =
        useState({
            profileVisibility: false,
        });


    /* =====================================================
       SAVING STATES
    ===================================================== */

    const [profileSaving, setProfileSaving] =
        useState(false);

    const [passwordSaving, setPasswordSaving] =
        useState(false);

    const [notificationSaving, setNotificationSaving] =
        useState(false);

    const [privacySaving, setPrivacySaving] =
        useState(false);


    /* =====================================================
       LOAD USER + CUSTOMER SETTINGS
    ===================================================== */

    useEffect(() => {

        const loadUser = async () => {

            const token =
                localStorage.getItem("token");

            if (!token) {

                navigate("/login");

                return;
            }

            try {

                /* =========================================
                   LOAD CURRENT USER
                ========================================= */

                const response =
                    await getCurrentUser();

                const currentUser =
                    response.data.user;

                setUser(currentUser);


                setProfile({

                    name:
                        currentUser.name || "",

                    email:
                        currentUser.email || "",

                    phone:
                        currentUser.phone || "",

                });


                /* =========================================
                   LOAD CUSTOMER SETTINGS
                ========================================= */

                const settingsResponse =
                    await getCustomerSettings();


                if (
                    settingsResponse.data.success
                ) {

                    const customerSettings =
                        settingsResponse.data.settings;


                    /* =====================================
                       NOTIFICATIONS
                    ===================================== */

                    setNotifications({

                        orderUpdates:
                            Boolean(
                                customerSettings
                                    .order_notifications
                            ),

                        deliveryUpdates:
                            Boolean(
                                customerSettings
                                    .delivery_notifications
                            ),

                        promotionalNotifications:
                            Boolean(
                                customerSettings
                                    .promotional_notifications
                            ),

                    });


                    /* =====================================
                       PRIVACY
                    ===================================== */

                    setPrivacy({

                        profileVisibility:
                            Boolean(
                                customerSettings
                                    .profile_visibility
                            ),

                    });

                }

            } catch (error) {

                console.error(
                    "Failed to load customer settings:",
                    error
                );


                if (
                    error.response?.status === 401
                ) {

                    localStorage.removeItem(
                        "token"
                    );

                    navigate("/login");

                    return;
                }


                alert(
                    error.response?.data?.message ||
                    "Unable to load customer settings."
                );

            } finally {

                setLoading(false);

            }
        };


        loadUser();

    }, [navigate]);


    /* =====================================================
       PROFILE CHANGE
    ===================================================== */

    const handleProfileChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setProfile((previous) => ({

            ...previous,

            [name]: value,

        }));
    };


    /* =====================================================
       SAVE PROFILE
    ===================================================== */

    const handleProfileSubmit = async (e) => {

        e.preventDefault();


        /* =========================================
           BASIC VALIDATION
        ========================================= */

        if (!profile.name.trim()) {

            alert(
                "Please enter your name."
            );

            return;
        }


        if (!profile.email.trim()) {

            alert(
                "Please enter your email address."
            );

            return;
        }


        setProfileSaving(true);


        try {

            /* =========================================
               UPDATE PROFILE IN DATABASE
            ========================================= */

            const response =
                await updateCustomerProfile({

                    name:
                        profile.name.trim(),

                    email:
                        profile.email.trim(),

                    phone:
                        profile.phone.trim(),

                });


            /* =========================================
               SUCCESS
            ========================================= */

            if (
                response.data.success
            ) {

                const updatedUser =
                    response.data.user;


                /* UPDATE LOCAL USER */

                setUser(
                    updatedUser
                );


                /* UPDATE PROFILE FORM */

                setProfile({

                    name:
                        updatedUser.name || "",

                    email:
                        updatedUser.email || "",

                    phone:
                        updatedUser.phone || "",

                });


                /* =====================================
                   TELL NAVBAR TO REFRESH USER
                ===================================== */

                window.dispatchEvent(
                    new Event("userUpdated")
                );


                alert(
                    "Profile information updated successfully."
                );

            }

        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );


            /* =========================================
               TOKEN EXPIRED
            ========================================= */

            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem(
                    "token"
                );

                navigate("/login");

                return;
            }


            /* =========================================
               EMAIL ALREADY EXISTS / VALIDATION ERROR
            ========================================= */

            alert(
                error.response?.data?.message ||
                "Unable to update profile information."
            );

        } finally {

            setProfileSaving(false);

        }
    };


    /* =====================================================
       PASSWORD CHANGE
    ===================================================== */

    const handlePasswordChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setPassword((previous) => ({

            ...previous,

            [name]: value,

        }));
    };


    /* =====================================================
       PASSWORD SUBMIT
    ===================================================== */

    const handlePasswordSubmit = (e) => {

        e.preventDefault();


        if (
            !password.currentPassword ||
            !password.newPassword ||
            !password.confirmPassword
        ) {

            alert(
                "Please fill all password fields."
            );

            return;
        }


        if (
            password.newPassword !==
            password.confirmPassword
        ) {

            alert(
                "New password and confirm password do not match."
            );

            return;
        }


        if (
            password.newPassword.length < 6
        ) {

            alert(
                "New password must contain at least 6 characters."
            );

            return;
        }


        setPasswordSaving(true);


        try {

            /*
             * Password API will be connected
             * after the change-password backend
             * endpoint is added.
             */

            console.log(
                "PASSWORD CHANGE REQUEST"
            );


            alert(
                "Password change request submitted."
            );


            setPassword({

                currentPassword: "",
                newPassword: "",
                confirmPassword: "",

            });

        } catch (error) {

            console.error(
                "Password update error:",
                error
            );


            alert(
                "Failed to change password."
            );

        } finally {

            setPasswordSaving(false);

        }
    };


    /* =====================================================
       NOTIFICATIONS TOGGLE
    ===================================================== */

    const handleNotificationChange = (
        name
    ) => {

        setNotifications((previous) => ({

            ...previous,

            [name]: !previous[name],

        }));
    };


    /* =====================================================
       SAVE NOTIFICATIONS
    ===================================================== */

    const handleNotificationSubmit =
        async () => {

            setNotificationSaving(true);


            try {

                const response =
                    await updateCustomerNotifications({

                        order_notifications:
                            notifications
                                .orderUpdates,

                        delivery_notifications:
                            notifications
                                .deliveryUpdates,

                        promotional_notifications:
                            notifications
                                .promotionalNotifications,

                    });


                if (
                    response.data.success
                ) {

                    alert(
                        "Notification preferences saved successfully."
                    );

                }

            } catch (error) {

                console.error(
                    "Notification update error:",
                    error
                );


                if (
                    error.response?.status === 401
                ) {

                    localStorage.removeItem(
                        "token"
                    );

                    navigate("/login");

                    return;
                }


                alert(
                    error.response?.data?.message ||
                    "Failed to save notification preferences."
                );

            } finally {

                setNotificationSaving(false);

            }
        };


    /* =====================================================
       PRIVACY TOGGLE
    ===================================================== */

    const handlePrivacyChange = (
        name
    ) => {

        setPrivacy((previous) => ({

            ...previous,

            [name]: !previous[name],

        }));
    };


    /* =====================================================
       SAVE PRIVACY
    ===================================================== */

    const handlePrivacySubmit =
        async () => {

            setPrivacySaving(true);


            try {

                const response =
                    await updateCustomerPrivacy({

                        profile_visibility:
                            privacy
                                .profileVisibility,

                    });


                if (
                    response.data.success
                ) {

                    alert(
                        "Privacy settings saved successfully."
                    );

                }

            } catch (error) {

                console.error(
                    "Privacy update error:",
                    error
                );


                if (
                    error.response?.status === 401
                ) {

                    localStorage.removeItem(
                        "token"
                    );

                    navigate("/login");

                    return;
                }


                alert(
                    error.response?.data?.message ||
                    "Failed to save privacy settings."
                );

            } finally {

                setPrivacySaving(false);

            }
        };


    /* =====================================================
       DELETE ACCOUNT
    ===================================================== */

    const handleDeleteAccount = () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
            );


        if (!confirmed) {

            return;
        }


        /*
         * Delete account API will be connected
         * after the backend endpoint is created.
         */

        alert(
            "Account deletion will be connected to the backend."
        );
    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="customer-settings-loading">

                Loading settings...

            </div>

        );
    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="customer-settings-page">


            {/* =================================================
               HEADER
            ================================================= */}

            <div className="customer-settings-header">

                <div>

                    <span className="settings-eyebrow">
                        MY ACCOUNT
                    </span>


                    <h1>
                        Customer Settings
                    </h1>


                    <p>
                        Manage your account,
                        preferences and privacy.
                    </p>

                </div>


                <Link
                    to="/"
                    className="settings-back-button"
                >

                    <FiArrowLeft />

                    Continue Shopping

                </Link>

            </div>


            {/* =================================================
               SETTINGS LAYOUT
            ================================================= */}

            <div className="customer-settings-layout">


                {/* =================================================
                   SIDEBAR
                ================================================= */}

                <aside className="customer-settings-sidebar">


                    {/* PROFILE */}

                    <button
                        type="button"
                        className={
                            activeSection === "profile"
                                ? "settings-menu-item active"
                                : "settings-menu-item"
                        }
                        onClick={() =>
                            setActiveSection(
                                "profile"
                            )
                        }
                    >

                        <FiUser />

                        <span>
                            Profile
                        </span>

                    </button>


                    {/* PASSWORD */}

                    <button
                        type="button"
                        className={
                            activeSection === "password"
                                ? "settings-menu-item active"
                                : "settings-menu-item"
                        }
                        onClick={() =>
                            setActiveSection(
                                "password"
                            )
                        }
                    >

                        <FiLock />

                        <span>
                            Password
                        </span>

                    </button>


                    {/* NOTIFICATIONS */}

                    <button
                        type="button"
                        className={
                            activeSection === "notifications"
                                ? "settings-menu-item active"
                                : "settings-menu-item"
                        }
                        onClick={() =>
                            setActiveSection(
                                "notifications"
                            )
                        }
                    >

                        <FiBell />

                        <span>
                            Notifications
                        </span>

                    </button>


                    {/* PRIVACY */}

                    <button
                        type="button"
                        className={
                            activeSection === "privacy"
                                ? "settings-menu-item active"
                                : "settings-menu-item"
                        }
                        onClick={() =>
                            setActiveSection(
                                "privacy"
                            )
                        }
                    >

                        <FiShield />

                        <span>
                            Privacy
                        </span>

                    </button>


                    {/* DELETE ACCOUNT */}

                    <button
                        type="button"
                        className={
                            activeSection === "delete"
                                ? "settings-menu-item danger active"
                                : "settings-menu-item danger"
                        }
                        onClick={() =>
                            setActiveSection(
                                "delete"
                            )
                        }
                    >

                        <FiTrash2 />

                        <span>
                            Delete Account
                        </span>

                    </button>

                </aside>


                {/* =================================================
                   CONTENT
                ================================================= */}

                <main className="customer-settings-content">


                    {/* =================================================
                       PROFILE
                    ================================================= */}

                    {activeSection === "profile" && (

                        <section className="settings-card">


                            <div className="settings-card-header">

                                <div className="settings-card-icon">

                                    <FiUser />

                                </div>


                                <div>

                                    <h2>
                                        Profile Information
                                    </h2>


                                    <p>
                                        Update your personal
                                        information.
                                    </p>

                                </div>

                            </div>


                            <form
                                onSubmit={
                                    handleProfileSubmit
                                }
                                className="settings-form"
                            >

                                <div className="settings-form-grid">


                                    {/* NAME */}

                                    <div className="settings-field">

                                        <label>
                                            Full Name
                                        </label>


                                        <input
                                            type="text"
                                            name="name"
                                            value={
                                                profile.name
                                            }
                                            onChange={
                                                handleProfileChange
                                            }
                                            placeholder="Enter your name"
                                        />

                                    </div>


                                    {/* EMAIL */}

                                    <div className="settings-field">

                                        <label>
                                            Email Address
                                        </label>


                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                profile.email
                                            }
                                            onChange={
                                                handleProfileChange
                                            }
                                            placeholder="Enter your email"
                                        />

                                    </div>


                                    {/* PHONE */}

                                    <div className="settings-field">

                                        <label>
                                            Phone Number
                                        </label>


                                        <input
                                            type="tel"
                                            name="phone"
                                            value={
                                                profile.phone
                                            }
                                            onChange={
                                                handleProfileChange
                                            }
                                            placeholder="Enter your phone number"
                                        />

                                    </div>

                                </div>


                                <button
                                    type="submit"
                                    className="settings-primary-button"
                                    disabled={
                                        profileSaving
                                    }
                                >

                                    <FiSave />


                                    {profileSaving
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>

                            </form>

                        </section>
                    )}


                    {/* =================================================
                       PASSWORD
                    ================================================= */}

                    {activeSection === "password" && (

                        <section className="settings-card">


                            <div className="settings-card-header">

                                <div className="settings-card-icon">

                                    <FiLock />

                                </div>


                                <div>

                                    <h2>
                                        Change Password
                                    </h2>


                                    <p>
                                        Keep your account
                                        secure with a strong
                                        password.
                                    </p>

                                </div>

                            </div>


                            <form
                                onSubmit={
                                    handlePasswordSubmit
                                }
                                className="settings-form"
                            >


                                {/* CURRENT PASSWORD */}

                                <div className="settings-field">

                                    <label>
                                        Current Password
                                    </label>


                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={
                                            password.currentPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Enter current password"
                                    />

                                </div>


                                {/* NEW PASSWORD */}

                                <div className="settings-field">

                                    <label>
                                        New Password
                                    </label>


                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={
                                            password.newPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Enter new password"
                                    />

                                </div>


                                {/* CONFIRM PASSWORD */}

                                <div className="settings-field">

                                    <label>
                                        Confirm New Password
                                    </label>


                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={
                                            password.confirmPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Confirm new password"
                                    />

                                </div>


                                <div className="settings-password-note">

                                    Password should contain
                                    at least 6 characters.

                                </div>


                                <button
                                    type="submit"
                                    className="settings-primary-button"
                                    disabled={
                                        passwordSaving
                                    }
                                >

                                    <FiLock />


                                    {passwordSaving
                                        ? "Updating..."
                                        : "Update Password"}

                                </button>

                            </form>

                        </section>
                    )}


                    {/* =================================================
                       NOTIFICATIONS
                    ================================================= */}

                    {activeSection === "notifications" && (

                        <section className="settings-card">


                            <div className="settings-card-header">

                                <div className="settings-card-icon">

                                    <FiBell />

                                </div>


                                <div>

                                    <h2>
                                        Notifications
                                    </h2>


                                    <p>
                                        Choose the notifications
                                        you want to receive.
                                    </p>

                                </div>

                            </div>


                            <div className="settings-options">


                                {/* ORDER UPDATES */}

                                <div className="settings-option">

                                    <div>

                                        <strong>
                                            Order Updates
                                        </strong>


                                        <p>
                                            Receive updates about
                                            your orders.
                                        </p>

                                    </div>


                                    <label className="settings-switch">

                                        <input
                                            type="checkbox"
                                            checked={
                                                notifications
                                                    .orderUpdates
                                            }
                                            onChange={() =>
                                                handleNotificationChange(
                                                    "orderUpdates"
                                                )
                                            }
                                        />


                                        <span></span>

                                    </label>

                                </div>


                                {/* DELIVERY UPDATES */}

                                <div className="settings-option">

                                    <div>

                                        <strong>
                                            Delivery Updates
                                        </strong>


                                        <p>
                                            Get notifications when
                                            your order is shipped
                                            or delivered.
                                        </p>

                                    </div>


                                    <label className="settings-switch">

                                        <input
                                            type="checkbox"
                                            checked={
                                                notifications
                                                    .deliveryUpdates
                                            }
                                            onChange={() =>
                                                handleNotificationChange(
                                                    "deliveryUpdates"
                                                )
                                            }
                                        />


                                        <span></span>

                                    </label>

                                </div>


                                {/* PROMOTIONAL */}

                                <div className="settings-option">

                                    <div>

                                        <strong>
                                            Promotional Notifications
                                        </strong>


                                        <p>
                                            Receive information about
                                            offers and new collections.
                                        </p>

                                    </div>


                                    <label className="settings-switch">

                                        <input
                                            type="checkbox"
                                            checked={
                                                notifications
                                                    .promotionalNotifications
                                            }
                                            onChange={() =>
                                                handleNotificationChange(
                                                    "promotionalNotifications"
                                                )
                                            }
                                        />


                                        <span></span>

                                    </label>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="settings-primary-button"
                                onClick={
                                    handleNotificationSubmit
                                }
                                disabled={
                                    notificationSaving
                                }
                            >

                                <FiSave />


                                {notificationSaving
                                    ? "Saving..."
                                    : "Save Preferences"}

                            </button>

                        </section>
                    )}


                    {/* =================================================
                       PRIVACY
                    ================================================= */}

                    {activeSection === "privacy" && (

                        <section className="settings-card">


                            <div className="settings-card-header">

                                <div className="settings-card-icon">

                                    <FiShield />

                                </div>


                                <div>

                                    <h2>
                                        Privacy & Security
                                    </h2>


                                    <p>
                                        Control how your account
                                        information is used.
                                    </p>

                                </div>

                            </div>


                            <div className="settings-options">


                                <div className="settings-option">

                                    <div>

                                        <strong>
                                            Profile Visibility
                                        </strong>


                                        <p>
                                            Allow your basic profile
                                            information to be visible
                                            where applicable.
                                        </p>

                                    </div>


                                    <label className="settings-switch">

                                        <input
                                            type="checkbox"
                                            checked={
                                                privacy
                                                    .profileVisibility
                                            }
                                            onChange={() =>
                                                handlePrivacyChange(
                                                    "profileVisibility"
                                                )
                                            }
                                        />


                                        <span></span>

                                    </label>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="settings-primary-button"
                                onClick={
                                    handlePrivacySubmit
                                }
                                disabled={
                                    privacySaving
                                }
                            >

                                <FiSave />


                                {privacySaving
                                    ? "Saving..."
                                    : "Save Privacy Settings"}

                            </button>


                            <div className="privacy-information">

                                <h3>
                                    Your Privacy
                                </h3>


                                <p>
                                    Your personal information is
                                    used to provide account,
                                    shopping and order services.
                                </p>


                                <p>
                                    We recommend keeping your
                                    password private and using a
                                    strong password for your account.
                                </p>

                            </div>

                        </section>
                    )}


                    {/* =================================================
                       DELETE ACCOUNT
                    ================================================= */}

                    {activeSection === "delete" && (

                        <section className="settings-card delete-account-card">


                            <div className="settings-card-header">

                                <div className="settings-card-icon danger-icon">

                                    <FiTrash2 />

                                </div>


                                <div>

                                    <h2>
                                        Delete Account
                                    </h2>


                                    <p>
                                        Permanently remove your
                                        customer account.
                                    </p>

                                </div>

                            </div>


                            <div className="delete-warning">

                                <strong>
                                    This action cannot be undone.
                                </strong>


                                <p>
                                    Deleting your account will
                                    remove your customer account
                                    and associated account data.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="delete-account-button"
                                onClick={
                                    handleDeleteAccount
                                }
                            >

                                <FiTrash2 />

                                Delete My Account

                            </button>

                        </section>
                    )}

                </main>

            </div>

        </div>
    );
};

export default CustomerSettings;

