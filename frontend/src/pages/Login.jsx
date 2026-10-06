import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/api";

import "../css/auth.css";


const Login = () => {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            setLoading(true);


            const response =
                await loginUser(formData);


            if (!response.data?.success) {

                alert(
                    response.data?.message ||
                    "Login failed"
                );

                return;

            }


            const {
                token,
                user
            } = response.data;


            /*
             * ==========================================
             * ADMIN / SUPER ADMIN LOGIN
             * ==========================================
             */

            if (
                user.role === "admin" ||
                user.role === "superadmin"
            ) {

                localStorage.setItem(
                    "adminToken",
                    token
                );


                localStorage.setItem(
                    "admin",
                    JSON.stringify(user)
                );


                navigate(
                    "/admin/dashboard"
                );


                return;

            }


            /*
             * ==========================================
             * CUSTOMER LOGIN
             * ==========================================
             */

            localStorage.setItem(
                "token",
                token
            );


            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            window.dispatchEvent(
                new Event("userUpdated")
            );


            navigate("/");


        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page">

            <div className="auth-container">


                {/* ==========================================
                    LOGIN HEADER
                ========================================== */}

                <div className="auth-header">

                    <span>
                        WELCOME BACK
                    </span>

                    <h1>
                        Login
                    </h1>

                    <p>
                        Sign in to continue shopping.
                    </p>

                </div>


                {/* ==========================================
                    LOGIN FORM
                ========================================== */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >


                    {/* EMAIL */}

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Login"}

                    </button>


                </form>


                {/* ==========================================
                    CUSTOMER REGISTRATION
                ========================================== */}

                <div className="login-register-link">

                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Register
                    </Link>

                </div>


            </div>

        </div>

    );

};


export default Login;