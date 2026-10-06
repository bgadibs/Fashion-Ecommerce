import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiMapPin,
    FiUser,
    FiPhone,
} from "react-icons/fi";

import { addAddress } from "../services/api";

import "../css/address.css";

const Address = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: "",
        landmark: "",
        address_type: "home",
        is_default: false,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        if (
            !formData.full_name ||
            !formData.phone ||
            !formData.address_line1 ||
            !formData.city ||
            !formData.state ||
            !formData.pincode
        ) {
            alert("Please fill all required fields.");
            return;
        }

        if (!/^[0-9]{10}$/.test(formData.phone)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        if (!/^[0-9]{6}$/.test(formData.pincode)) {
            alert("Please enter a valid 6-digit pincode.");
            return;
        }

        try {
            setLoading(true);

            await addAddress(formData);

            alert("Address added successfully!");

            navigate("/checkout");
        } catch (error) {
            console.error("Add address error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to add address."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="address-page">

            <div className="address-header">
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate("/checkout")}
                >
                    <FiArrowLeft />
                    Back to Checkout
                </button>

                <span className="address-small-title">
                    DELIVERY DETAILS
                </span>

                <h1>Add New Address</h1>

                <p>
                    Enter your delivery details to continue
                    with your order.
                </p>
            </div>

            <div className="address-container">

                <div className="address-card">

                    <div className="address-card-header">
                        <div className="address-icon">
                            <FiMapPin />
                        </div>

                        <div>
                            <h2>Delivery Address</h2>
                            <p>
                                Please provide your complete
                                delivery address.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* NAME + PHONE */}

                        <div className="address-form-row">

                            <div className="address-form-group">
                                <label>
                                    Full Name
                                    <span>*</span>
                                </label>

                                <div className="input-wrapper">
                                    <FiUser />

                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div className="address-form-group">
                                <label>
                                    Phone Number
                                    <span>*</span>
                                </label>

                                <div className="input-wrapper">
                                    <FiPhone />

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="10-digit mobile number"
                                        maxLength="10"
                                    />
                                </div>
                            </div>

                        </div>

                        {/* ADDRESS */}

                        <div className="address-form-group">
                            <label>
                                Address Line 1
                                <span>*</span>
                            </label>

                            <input
                                type="text"
                                name="address_line1"
                                value={formData.address_line1}
                                onChange={handleChange}
                                placeholder="House / Flat / Building / Street"
                            />
                        </div>

                        <div className="address-form-group">
                            <label>
                                Address Line 2
                            </label>

                            <input
                                type="text"
                                name="address_line2"
                                value={formData.address_line2}
                                onChange={handleChange}
                                placeholder="Apartment, area, colony, etc."
                            />
                        </div>

                        {/* CITY STATE PINCODE */}

                        <div className="address-form-row three-columns">

                            <div className="address-form-group">
                                <label>
                                    City
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                />
                            </div>

                            <div className="address-form-group">
                                <label>
                                    State
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                />
                            </div>

                            <div className="address-form-group">
                                <label>
                                    Pincode
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    placeholder="6-digit pincode"
                                    maxLength="6"
                                />
                            </div>

                        </div>

                        {/* LANDMARK */}

                        <div className="address-form-group">
                            <label>
                                Landmark
                            </label>

                            <input
                                type="text"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                placeholder="Nearby landmark"
                            />
                        </div>

                        {/* ADDRESS TYPE */}

                        <div className="address-form-group">
                            <label>
                                Address Type
                            </label>

                            <div className="address-type-options">

                                <label
                                    className={
                                        formData.address_type === "home"
                                            ? "address-type active"
                                            : "address-type"
                                    }
                                >
                                    <input
                                        type="radio"
                                        name="address_type"
                                        value="home"
                                        checked={
                                            formData.address_type ===
                                            "home"
                                        }
                                        onChange={handleChange}
                                    />
                                    Home
                                </label>

                                <label
                                    className={
                                        formData.address_type === "work"
                                            ? "address-type active"
                                            : "address-type"
                                    }
                                >
                                    <input
                                        type="radio"
                                        name="address_type"
                                        value="work"
                                        checked={
                                            formData.address_type ===
                                            "work"
                                        }
                                        onChange={handleChange}
                                    />
                                    Work
                                </label>

                                <label
                                    className={
                                        formData.address_type === "other"
                                            ? "address-type active"
                                            : "address-type"
                                    }
                                >
                                    <input
                                        type="radio"
                                        name="address_type"
                                        value="other"
                                        checked={
                                            formData.address_type ===
                                            "other"
                                        }
                                        onChange={handleChange}
                                    />
                                    Other
                                </label>

                            </div>
                        </div>

                        {/* DEFAULT ADDRESS */}

                        <label className="default-address">

                            <input
                                type="checkbox"
                                name="is_default"
                                checked={formData.is_default}
                                onChange={handleChange}
                            />

                            <span>
                                Make this my default address
                            </span>

                        </label>

                        {/* BUTTONS */}

                        <div className="address-actions">

                            <button
                                type="button"
                                className="cancel-address"
                                onClick={() =>
                                    navigate("/checkout")
                                }
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-address"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Address"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default Address;