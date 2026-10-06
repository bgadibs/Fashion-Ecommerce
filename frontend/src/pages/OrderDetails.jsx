import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getOrder } from "../services/api";

import "../css/order-details.css";

const OrderDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {

        try {

            const response =
                await getOrder(id);

            setOrder(
                response.data.order
            );

            setItems(
                response.data.items || []
            );

        } catch (error) {

            console.error(
                "Order details error:",
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


    if (loading) {

        return (
            <div className="order-details-loading">
                Loading order...
            </div>
        );
    }


    if (!order) {

        return (
            <div className="order-not-found">

                <h2>
                    Order not found
                </h2>

                <button
                    onClick={() =>
                        navigate("/orders")
                    }
                >
                    Back to Orders
                </button>

            </div>
        );
    }


    return (
        <div className="order-details-page">

            <div className="order-details-container">

                <button
                    className="back-orders-button"
                    onClick={() =>
                        navigate("/orders")
                    }
                >
                    ← Back to Orders
                </button>


                <div className="order-details-header">

                    <div>
                        <span>
                            Order Number
                        </span>

                        <h1>
                            {order.order_number}
                        </h1>

                        <p>
                            Placed on{" "}
                            {new Date(
                                order.created_at
                            ).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric"
                                }
                            )}
                        </p>
                    </div>


                    <span
                        className={`order-detail-status status-${order.status}`}
                    >
                        {order.status}
                    </span>

                </div>


                {/* ==================================
                    ORDER ITEMS
                ================================== */}

                <section className="details-section">

                    <h2>
                        Items in Your Order
                    </h2>

                    <div className="order-items">

                        {items.map((item) => (

                            <div
                                className="order-item"
                                key={item.id}
                            >

                                <div className="order-item-image">
                                    🛍️
                                </div>


                                <div className="order-item-info">

                                    <h3>
                                        {
                                            item.product_name
                                        }
                                    </h3>

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

                                    <span>
                                        Quantity:{" "}
                                        {item.quantity}
                                    </span>

                                </div>


                                <div className="order-item-price">

                                    <span>
                                        ₹
                                        {Number(
                                            item.unit_price
                                        ).toFixed(2)}
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            item.line_total
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>


                {/* ==================================
                    SHIPPING ADDRESS
                ================================== */}

                <section className="details-section">

                    <h2>
                        Delivery Address
                    </h2>

                    <div className="delivery-address">

                        <strong>
                            {order.ship_full_name}
                        </strong>

                        <p>
                            {order.ship_phone}
                        </p>

                        <p>
                            {order.ship_line1}
                        </p>

                        {order.ship_line2 && (
                            <p>
                                {order.ship_line2}
                            </p>
                        )}

                        <p>
                            {order.ship_city},{" "}
                            {order.ship_state}
                        </p>

                        <p>
                            PIN:{" "}
                            {order.ship_postal}
                        </p>

                        <p>
                            {order.ship_country}
                        </p>

                    </div>

                </section>


                {/* ==================================
                    PAYMENT
                ================================== */}

                <section className="details-section">

                    <h2>
                        Payment Information
                    </h2>

                    <div className="payment-information">

                        <div>
                            <span>
                                Payment Method
                            </span>

                            <strong>
                                {order.payment_method}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Payment Status
                            </span>

                            <strong>
                                {order.payment_status}
                            </strong>
                        </div>

                    </div>

                </section>


                {/* ==================================
                    PRICE SUMMARY
                ================================== */}

                <section className="details-section">

                    <h2>
                        Price Details
                    </h2>

                    <div className="price-details">

                        <div>
                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    order.subtotal
                                ).toFixed(2)}
                            </strong>
                        </div>


                        <div>
                            <span>
                                Shipping
                            </span>

                            <strong>
                                {Number(
                                    order.shipping
                                ) === 0
                                    ? "FREE"
                                    : `₹${Number(
                                          order.shipping
                                      ).toFixed(2)}`}
                            </strong>
                        </div>


                        <div>
                            <span>
                                Discount
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    order.discount
                                ).toFixed(2)}
                            </strong>
                        </div>


                        <div className="final-order-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    order.total
                                ).toFixed(2)}
                            </strong>

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
};

export default OrderDetails;