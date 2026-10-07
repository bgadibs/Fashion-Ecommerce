import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiUser,
    FiMail,
    FiLock,
    FiPhone,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";

import { registerUser } from "../services/api";
import { useStore } from "../context/StoreContext";

import "../css/auth.css";

const Register = () => {

    const navigate = useNavigate();
    const { storeName, storeNameParts } = useStore();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            const response =
                await registerUser(form);

            setSuccess(
                response.data.message ||
                "Registration successful!"
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="auth-page register-page">

            <div className="auth-container">

                <div className="auth-brand">
                    {storeNameParts.first}
                    {storeNameParts.second && (
                        <span>{storeNameParts.second}</span>
                    )}
                </div>

                <div className="auth-header">

                    <span>
                        JOIN {storeName.toUpperCase()}
                    </span>

                    <h1>
                        Create your account
                    </h1>

                    <p>
                        Start discovering your new favorite styles.
                    </p>

                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="auth-success">
                        {success}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="input-group">

                        <label>
                            Full Name
                        </label>

                        <div className="input-wrapper">

                            <FiUser />

                            <input
                                type="text"
                                name="name"
                                placeholder="Your full name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    <div className="input-group">

                        <label>
                            Email Address
                        </label>

                        <div className="input-wrapper">

                            <FiMail />

                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    <div className="input-group">

                        <label>
                            Phone Number
                        </label>

                        <div className="input-wrapper">

                            <FiPhone />

                            <input
                                type="tel"
                                name="phone"
                                placeholder="9876543210"
                                value={form.phone}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    <div className="input-group">

                        <label>
                            Password
                        </label>

                        <div className="input-wrapper">

                            <FiLock />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Create a password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword
                                    ? <FiEyeOff />
                                    : <FiEye />}
                            </button>

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>

                <p className="auth-switch">

                    Already have an account?

                    <Link to="/login">
                        Sign In
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default Register;