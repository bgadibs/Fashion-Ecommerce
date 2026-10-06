
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMapPin, FiShoppingBag } from "react-icons/fi";

import {
    getCart,
    getAddresses,
} from "../services/api";

import "../css/checkout.css";

const Checkout = () => {

    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD CHECKOUT DATA
    // =====================================================

    const loadCheckout = async () => {

        try {

            setLoading(true);

            const [
                cartResponse,
                addressResponse
            ] = await Promise.all([
                getCart(),
                getAddresses()
            ]);


            // =====================================================
            // CART
            // =====================================================

            const items =
                cartResponse.data?.items || [];

            setCartItems(items);

            setTotal(
                Number(
                    cartResponse.data?.total || 0
                )
            );


            // =====================================================
            // ADDRESSES
            // =====================================================

            const addressList =
                addressResponse.data?.addresses || [];

            setAddresses(addressList);


            // =====================================================
            // DEFAULT ADDRESS
            // =====================================================

            const defaultAddress =
                addressList.find(
                    (address) =>
                        address.is_default === 1 ||
                        address.is_default === true
                );


            if (defaultAddress) {

                setSelectedAddress(
                    defaultAddress.id
                );

            } else if (
                addressList.length > 0
            ) {

                setSelectedAddress(
                    addressList[0].id
                );

            } else {

                setSelectedAddress(null);

            }

        } catch (error) {

            console.error(
                "Checkout loading error:",
                error
            );

            if (
                error.response?.status === 401
            ) {

                navigate("/login");

            }

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD ON PAGE OPEN
    // =====================================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            navigate("/login");

            return;

        }

        loadCheckout();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="checkout-loading">
                Loading checkout...
            </div>
        );

    }


    // =====================================================
    // EMPTY CART
    // =====================================================

    if (cartItems.length === 0) {

        return (
            <div className="checkout-empty">

                <div className="checkout-empty-icon">
                    <FiShoppingBag />
                </div>

                <h1>
                    Your bag is empty
                </h1>

                <p>
                    Add some products before
                    proceeding to checkout.
                </p>

                <Link
                    to="/products"
                    className="checkout-shop-button"
                >
                    Continue Shopping
                </Link>

            </div>
        );

    }


    // =====================================================
    // CHECKOUT PAGE
    // =====================================================

    return (

        <div className="checkout-page">

            {/* HEADER */}

            <div className="checkout-header">

                <span>
                    SECURE CHECKOUT
                </span>

                <h1>
                    Checkout
                </h1>

                <p>
                    Complete your order details
                </p>

            </div>


            <div className="checkout-layout">


                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="checkout-left">


                    {/* =================================================
                        DELIVERY ADDRESS
                    ================================================= */}

                    <section className="checkout-section">

                        <div className="checkout-section-title">

                            <div>

                                <FiMapPin />

                                <div>

                                    <h2>
                                        Delivery Address
                                    </h2>

                                    <p>
                                        Select where you
                                        want your order
                                        delivered.
                                    </p>

                                </div>

                            </div>


                            {/* ADD ADDRESS BUTTON */}

                            <button
                                type="button"
                                className="add-address-button"
                                onClick={() =>
                                    navigate("/address")
                                }
                            >
                                + Add Address
                            </button>

                        </div>


                        {/* =================================================
                            NO ADDRESS
                        ================================================= */}

                        {addresses.length === 0 ? (

                            <div className="no-address">

                                <FiMapPin />

                                <h3>
                                    No address saved
                                </h3>

                                <p>
                                    Add a delivery
                                    address to continue.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/address")
                                    }
                                >
                                    Add Address
                                </button>

                            </div>

                        ) : (

                            /* =================================================
                               ADDRESS LIST
                            ================================================= */

                            <div className="address-list">

                                {addresses.map(
                                    (address) => (

                                        <button
                                            type="button"
                                            key={address.id}
                                            className={`checkout-address ${
                                                selectedAddress ===
                                                address.id
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setSelectedAddress(
                                                    address.id
                                                )
                                            }
                                        >

                                            <div className="address-radio">

                                                <span></span>

                                            </div>


                                            <div className="address-details">

                                                <strong>
                                                    {address.full_name}
                                                </strong>

                                                <p>
                                                    {address.address_line1}
                                                </p>

                                                {address.address_line2 && (
                                                    <p>
                                                        {
                                                            address.address_line2
                                                        }
                                                    </p>
                                                )}

                                                <p>
                                                    {address.city},{" "}
                                                    {address.state}{" "}
                                                    -{" "}
                                                    {address.pincode}
                                                </p>

                                                <p>
                                                    Phone:{" "}
                                                    {address.phone}
                                                </p>

                                                {address.address_type && (
                                                    <p>
                                                        Type:{" "}
                                                        {address.address_type}
                                                    </p>
                                                )}

                                            </div>

                                        </button>

                                    )
                                )}

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        ORDER ITEMS
                    ================================================= */}

                    <section className="checkout-section">

                        <div className="checkout-section-heading">

                            <h2>
                                Your Items
                            </h2>

                            <span>
                                {cartItems.length}{" "}
                                {cartItems.length === 1
                                    ? "item"
                                    : "items"}
                            </span>

                        </div>


                        <div className="checkout-items">

                            {cartItems.map(
                                (item) => (

                                    <div
                                        className="checkout-item"
                                        key={item.id}
                                    >

                                        <div className="checkout-item-image">

                                            {item.image ? (

                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                />

                                            ) : (

                                                <span>
                                                    FASHION
                                                </span>

                                            )}

                                        </div>


                                        <div className="checkout-item-info">

                                            <Link
                                                to={`/products/${item.product_id}`}
                                            >
                                                {item.name}
                                            </Link>

                                            <p>

                                                {item.size &&
                                                    `Size: ${item.size}`}

                                                {item.size &&
                                                    item.color &&
                                                    " • "}

                                                {item.color &&
                                                    `Color: ${item.color}`}

                                            </p>

                                            <span>
                                                Qty:{" "}
                                                {item.quantity}
                                            </span>

                                        </div>


                                        <strong>

                                            ₹
                                            {Number(
                                                item.lineTotal ||
                                                Number(item.price) *
                                                Number(item.quantity)
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                        </strong>

                                    </div>

                                )
                            )}

                        </div>

                    </section>

                </div>


                {/* =================================================
                    RIGHT SIDE - SUMMARY
                ================================================= */}

                <aside className="checkout-summary">

                    <h2>
                        Order Summary
                    </h2>


                    <div className="checkout-summary-row">

                        <span>
                            Items
                        </span>

                        <strong>

                            {cartItems.reduce(
                                (sum, item) =>
                                    sum +
                                    Number(
                                        item.quantity
                                    ),
                                0
                            )}

                        </strong>

                    </div>


                    <div className="checkout-summary-row">

                        <span>
                            Subtotal
                        </span>

                        <strong>

                            ₹
                            {Number(
                                total
                            ).toLocaleString(
                                "en-IN"
                            )}

                        </strong>

                    </div>


                    <div className="checkout-summary-row">

                        <span>
                            Shipping
                        </span>

                        <strong className="free">
                            FREE
                        </strong>

                    </div>


                    <div className="checkout-divider"></div>


                    <div className="checkout-total">

                        <span>
                            Total
                        </span>

                        <strong>

                            ₹
                            {Number(
                                total
                            ).toLocaleString(
                                "en-IN"
                            )}

                        </strong>

                    </div>


                    {/* =================================================
                        PLACE ORDER
                    ================================================= */}

                    <button
                        type="button"
                        className="place-order-button"
                        disabled={
                            !selectedAddress
                        }
                        onClick={() =>
                            alert(
                                "Order placement will be connected next."
                            )
                        }
                    >
                        Place Order
                    </button>


                    {!selectedAddress && (

                        <p className="checkout-warning">

                            Please select or add a
                            delivery address.

                        </p>

                    )}


                    <Link
                        to="/cart"
                        className="back-to-cart"
                    >
                        ← Back to Bag
                    </Link>

                </aside>

            </div>

        </div>
    );
};

export default Checkout;


