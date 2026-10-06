import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/profile.css";

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:5000/api/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setUser(response.data.user);
                }
            } catch (err) {
                console.error("PROFILE ERROR:", err);

                if (err.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                setError(
                    err.response?.data?.message ||
                    "Unable to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="profile-loading">
                Loading profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-error">
                {error}
            </div>
        );
    }

    return (
        <div className="profile-page">

            <div className="profile-container">

                {/* =========================================
                    PROFILE HEADER
                ========================================= */}

                <div className="profile-header">

                    <div className="profile-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h1>{user?.name}</h1>
                        <p>My Account</p>
                    </div>

                </div>


                {/* =========================================
                    MY ACCOUNT MENU
                ========================================= */}

                <div className="profile-menu">

                    <h2>MY ACCOUNT</h2>

                    <button
                        className="profile-menu-item active"
                        onClick={() => navigate("/profile")}
                    >
                        <span>👤</span>
                        <span>Profile</span>
                    </button>

                    <button
                        className="profile-menu-item"
                        onClick={() => navigate("/orders")}
                    >
                        <span>📦</span>
                        <span>My Orders</span>
                    </button>

                    <button
                        className="profile-menu-item"
                        onClick={() => navigate("/addresses")}
                    >
                        <span>📍</span>
                        <span>Addresses</span>
                    </button>

                    <button
                        className="profile-menu-item"
                        onClick={() => navigate("/wishlist")}
                    >
                        <span>♡</span>
                        <span>Wishlist</span>
                    </button>

                    <button
                        className="profile-menu-item"
                        onClick={() => navigate("/cart")}
                    >
                        <span>🛒</span>
                        <span>Cart</span>
                    </button>

                    <button
                        className="profile-menu-item"
                        onClick={() => navigate("/account/settings")}
                    >
                        <span>⚙️</span>
                        <span>Settings</span>
                    </button>

                </div>


                {/* =========================================
                    PERSONAL INFORMATION
                ========================================= */}

                <div className="profile-card">

                    <h2>Personal Information</h2>

                    <div className="profile-row">
                        <span>Name</span>

                        <strong>
                            {user?.name || "Not available"}
                        </strong>
                    </div>

                    <div className="profile-row">
                        <span>Email</span>

                        <strong>
                            {user?.email || "Not available"}
                        </strong>
                    </div>

                    <div className="profile-row">
                        <span>Phone</span>

                        <strong>
                            {user?.phone || "Not provided"}
                        </strong>
                    </div>

                    <div className="profile-row">
                        <span>Account Type</span>

                        <strong>
                            {user?.role || "customer"}
                        </strong>
                    </div>

                </div>


                {/* =========================================
                    QUICK ACTIONS
                ========================================= */}

                <div className="profile-actions">

                    <button
                        onClick={() => navigate("/orders")}
                    >
                        📦 My Orders
                    </button>

                    <button
                        onClick={() => navigate("/account/settings")}
                    >
                        ⚙️ Account Settings
                    </button>

                    <button
                        onClick={() => navigate("/")}
                    >
                        🏠 Continue Shopping
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Profile;