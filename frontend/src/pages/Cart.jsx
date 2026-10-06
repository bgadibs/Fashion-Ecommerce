
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    FiMinus,
    FiPlus,
    FiTrash2,
    FiShoppingBag,
} from "react-icons/fi";

import {
    getCart,
    updateCartQuantity,
    removeFromCart,
} from "../services/api";

import "../css/cart.css";


const Cart = () => {

    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);


    // =====================================================
    // LOAD CART
    // =====================================================

    const loadCart = async () => {

        try {

            setLoading(true);

            const response =
                await getCart();

            setItems(
                response.data?.items || []
            );

            setTotal(
                Number(
                    response.data?.total || 0
                )
            );

        } catch (error) {

            console.error(
                "Failed to load cart:",
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
    // LOAD CART ON PAGE OPEN
    // =====================================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            navigate("/login");

            return;
        }

        loadCart();

    }, []);


    // =====================================================
    // CHANGE QUANTITY
    // =====================================================

    const changeQuantity = async (
        item,
        newQuantity
    ) => {

        const quantity =
            Number(newQuantity);

        // Minimum quantity
        if (quantity < 1) {
            return;
        }

        // Check stock
        if (
            quantity >
            Number(item.stock_quantity)
        ) {

            alert(
                `Only ${item.stock_quantity} item(s) available`
            );

            return;
        }

        try {

            setUpdatingId(item.id);

            console.log(
                "Updating cart:",
                {
                    cartItemId: item.id,
                    quantity: quantity
                }
            );

            await updateCartQuantity(
                item.id,
                quantity
            );

            // Reload cart after successful update
            await loadCart();

            // Update navbar badge
            window.dispatchEvent(
                new Event("cartUpdated")
            );

        } catch (error) {

            console.error(
                "Update cart error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update quantity"
            );

        } finally {

            setUpdatingId(null);

        }
    };


    // =====================================================
    // REMOVE ITEM
    // =====================================================

    const handleRemove = async (
        id
    ) => {

        try {

            await removeFromCart(id);

            await loadCart();

            window.dispatchEvent(
                new Event("cartUpdated")
            );

        } catch (error) {

            console.error(
                "Remove cart error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to remove item"
            );
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="cart-loading">
                Loading your bag...
            </div>
        );
    }


    // =====================================================
    // EMPTY CART
    // =====================================================

    if (items.length === 0) {

        return (
            <div className="empty-cart">

                <div className="empty-cart-icon">
                    <FiShoppingBag />
                </div>

                <h1>
                    Your bag is empty
                </h1>

                <p>
                    Discover something beautiful
                    and add it to your bag.
                </p>

                <Link
                    to="/products"
                    className="continue-shopping"
                >
                    Continue Shopping
                </Link>

            </div>
        );
    }


    // =====================================================
    // CART PAGE
    // =====================================================

    return (

        <div className="cart-page">

            {/* HEADER */}

            <div className="cart-header">

                <span>
                    YOUR SHOPPING BAG
                </span>

                <h1>
                    Shopping Bag
                </h1>

                <p>
                    {items.length}{" "}
                    {items.length === 1
                        ? "item"
                        : "items"}{" "}
                    in your bag
                </p>

            </div>


            {/* CART LAYOUT */}

            <div className="cart-layout">


                {/* =================================================
                    CART ITEMS
                ================================================= */}

                <div className="cart-items">

                    {items.map((item) => (

                        <div
                            className="cart-item"
                            key={item.id}
                        >


                            {/* PRODUCT IMAGE */}

                            <div className="cart-item-image">

                                {item.image ? (

                                    <img
                                        src={item.image}
                                        alt={item.name}
                                    />

                                ) : (

                                    <div>
                                        FASHION
                                    </div>

                                )}

                            </div>


                            {/* PRODUCT INFORMATION */}

                            <div className="cart-item-info">

                                <span className="cart-brand">
                                    {item.brand ||
                                        "BGADI Fashion"}
                                </span>


                                <Link
                                    to={`/products/${item.product_id}`}
                                    className="cart-item-name"
                                >
                                    {item.name}
                                </Link>


                                {/* SIZE / COLOR */}

                                <div className="cart-variant">

                                    {item.size && (
                                        <span>
                                            Size:{" "}
                                            {item.size}
                                        </span>
                                    )}

                                    {item.color && (
                                        <span>
                                            Color:{" "}
                                            {item.color}
                                        </span>
                                    )}

                                </div>


                                {/* PRICE */}

                                <div className="cart-item-price">

                                    ₹
                                    {Number(
                                        item.price
                                    ).toLocaleString(
                                        "en-IN"
                                    )}

                                </div>


                                {/* =================================================
                                    QUANTITY
                                ================================================= */}

                                <div className="cart-quantity">

                                    {/* MINUS */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeQuantity(
                                                item,
                                                Number(
                                                    item.quantity
                                                ) - 1
                                            )
                                        }
                                        disabled={
                                            updatingId ===
                                                item.id ||
                                            Number(
                                                item.quantity
                                            ) <= 1
                                        }
                                    >
                                        <FiMinus />
                                    </button>


                                    {/* CURRENT QUANTITY */}

                                    <span>
                                        {updatingId ===
                                        item.id
                                            ? "..."
                                            : item.quantity}
                                    </span>


                                    {/* PLUS */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            changeQuantity(
                                                item,
                                                Number(
                                                    item.quantity
                                                ) + 1
                                            )
                                        }
                                        disabled={
                                            updatingId ===
                                            item.id ||
                                            Number(
                                                item.quantity
                                            ) >=
                                                Number(
                                                    item.stock_quantity
                                                )
                                        }
                                    >
                                        <FiPlus />
                                    </button>

                                </div>


                                {/* STOCK */}

                                <small className="cart-stock">

                                    {Number(
                                        item.stock_quantity
                                    )}{" "}
                                    available

                                </small>

                            </div>


                            {/* REMOVE */}

                            <button
                                type="button"
                                className="remove-cart-item"
                                onClick={() =>
                                    handleRemove(
                                        item.id
                                    )
                                }
                                title="Remove item"
                            >
                                <FiTrash2 />
                            </button>

                        </div>

                    ))}

                </div>


                {/* =================================================
                    ORDER SUMMARY
                ================================================= */}

                <div className="cart-summary">

                    <h2>
                        Order Summary
                    </h2>


                    <div className="summary-row">

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


                    <div className="summary-row">

                        <span>
                            Shipping
                        </span>

                        <strong className="free">
                            FREE
                        </strong>

                    </div>


                    <div className="summary-divider"></div>


                    <div className="summary-total">

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


                    <button
                        type="button"
                        className="checkout-button"
                        onClick={() =>
                            navigate(
                                "/checkout"
                            )
                        }
                    >
                        Proceed to Checkout
                    </button>


                    <Link
                        to="/products"
                        className="continue-shopping-link"
                    >
                        ← Continue Shopping
                    </Link>

                </div>

            </div>

        </div>
    );
};


export default Cart;

