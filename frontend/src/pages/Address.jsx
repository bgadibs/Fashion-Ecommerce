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
const [errorMessage, setErrorMessage] = useState("");

const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
    }));

    setErrorMessage("");
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please log in before adding your address.");
        navigate("/login");
        return;
    }

    // Trim text fields before validation and submission.
    const addressData = {
        ...formData,
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        address_line1: formData.address_line1.trim(),
        address_line2: formData.address_line2.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
        landmark: formData.landmark.trim(),
    };

    // Validate required fields.
    const requiredFields = [
        {
            key: "full_name",
            label: "Full Name",
        },
        {
            key: "phone",
            label: "Phone Number",
        },
        {
            key: "address_line1",
            label: "Address Line 1",
        },
        {
            key: "city",
            label: "City",
        },
        {
            key: "state",
            label: "State",
        },
        {
            key: "pincode",
            label: "Pincode",
        },
    ];

    const missingField = requiredFields.find(
        (field) => !addressData[field.key]
    );

    if (missingField) {
        setErrorMessage(
            `Please enter ${missingField.label}.`
        );
        return;
    }

    // Validate phone number.
    if (!/^[0-9]{10}$/.test(addressData.phone)) {
        setErrorMessage(
            "Please enter a valid 10-digit phone number."
        );
        return;
    }

    // Validate Indian PIN code.
    if (!/^[0-9]{6}$/.test(addressData.pincode)) {
        setErrorMessage(
            "Please enter a valid 6-digit PIN code."
        );
        return;
    }

    try {
        setLoading(true);
        setErrorMessage("");

        const response = await addAddress(addressData);

        console.log(
            "Address added successfully:",
            response.data
        );

        alert("Address added successfully!");

        navigate("/checkout");
    } catch (error) {
    console.error(
        "Address API status:",
        error.response?.status
    );

    console.error(
        "Address API response:",
        JSON.stringify(error.response?.data, null, 2)
    );

    console.error(
        "Address form data:",
        JSON.stringify(addressData, null, 2)
    );

    setErrorMessage(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "The server rejected the address. Check the console for details."
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
                disabled={loading}
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
                    {/* FULL NAME AND PHONE */}

                    <div className="address-form-row">
                        <div className="address-form-group">
                            <label htmlFor="full_name">
                                Full Name <span>*</span>
                            </label>

                            <div className="input-wrapper">
                                <FiUser />

                                <input
                                    id="full_name"
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="address-form-group">
                            <label htmlFor="phone">
                                Phone Number <span>*</span>
                            </label>

                            <div className="input-wrapper">
                                <FiPhone />

                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit mobile number"
                                    autoComplete="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ADDRESS LINE 1 */}

                    <div className="address-form-group">
                        <label htmlFor="address_line1">
                            Address Line 1 <span>*</span>
                        </label>

                        <input
                            id="address_line1"
                            type="text"
                            name="address_line1"
                            value={formData.address_line1}
                            onChange={handleChange}
                            placeholder="House / Flat / Building / Street"
                            autoComplete="address-line1"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* ADDRESS LINE 2 */}

                    <div className="address-form-group">
                        <label htmlFor="address_line2">
                            Address Line 2
                        </label>

                        <input
                            id="address_line2"
                            type="text"
                            name="address_line2"
                            value={formData.address_line2}
                            onChange={handleChange}
                            placeholder="Apartment, area, colony, etc."
                            autoComplete="address-line2"
                            disabled={loading}
                        />
                    </div>

                    {/* CITY, STATE AND PINCODE */}

                    <div className="address-form-row three-columns">
                        <div className="address-form-group">
                            <label htmlFor="city">
                                City <span>*</span>
                            </label>

                            <input
                                id="city"
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                autoComplete="address-level2"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="address-form-group">
                            <label htmlFor="state">
                                State <span>*</span>
                            </label>

                            <input
                                id="state"
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="State"
                                autoComplete="address-level1"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="address-form-group">
                            <label htmlFor="pincode">
                                Pincode <span>*</span>
                            </label>

                            <input
                                id="pincode"
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="6-digit PIN code"
                                autoComplete="postal-code"
                                inputMode="numeric"
                                maxLength={6}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* LANDMARK */}

                    <div className="address-form-group">
                        <label htmlFor="landmark">
                            Landmark
                        </label>

                        <input
                            id="landmark"
                            type="text"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                            placeholder="Nearby landmark"
                            disabled={loading}
                        />
                    </div>

                    {/* ADDRESS TYPE */}

                    <div className="address-form-group">
                        <label>Address Type</label>

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
                                        formData.address_type === "home"
                                    }
                                    onChange={handleChange}
                                    disabled={loading}
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
                                        formData.address_type === "work"
                                    }
                                    onChange={handleChange}
                                    disabled={loading}
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
                                        formData.address_type === "other"
                                    }
                                    onChange={handleChange}
                                    disabled={loading}
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
                            disabled={loading}
                        />

                        <span>
                            Make this my default address
                        </span>
                    </label>

                    {/* ERROR MESSAGE */}

                    {errorMessage && (
                        <div
                            className="address-error"
                            role="alert"
                        >
                            {errorMessage}
                        </div>
                    )}

                    {/* ACTION BUTTONS */}

                    <div className="address-actions">
                        <button
                            type="button"
                            className="cancel-address"
                            onClick={() => navigate("/checkout")}
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
