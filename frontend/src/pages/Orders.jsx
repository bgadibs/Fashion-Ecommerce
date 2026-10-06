import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getOrders } from "../services/api";

import "../css/orders.css";

const Orders = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await getOrders();

            setOrders(
                response.data.orders || []
            );

        } catch (error) {
            console.error("Orders error:", error);

            if (error.response?.status === 401) {
                navigate("/login");
            }

        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        return `order-status status-${status}`;
    };

    if (loading) {
        return (
            <div className="orders-loading">
                Loading your orders...
            </div>
        );
    }

    return (
        <div className="orders-page">

            <div className="orders-container">

                <div className="orders-heading">
                    <h1>My Orders</h1>

                    <p>
                        View and track all your orders
                    </p>
                </div>


                {orders.length === 0 ? (

                    <div className="empty-orders">

                        <div className="empty-orders-icon">
                            🛍️
                        </div>

                        <h2>
                            No orders yet
                        </h2>

                        <p>
                            Your placed orders will
                            appear here.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/products")
                            }
                        >
                            Start Shopping
                        </button>

                    </div>

                ) : (

                    <div className="orders-list">

                        {orders.map((order) => (

                            <div
                                className="order-card"
                                key={order.id}
                            >

                                <div className="order-card-top">

                                    <div>
                                        <span className="order-label">
                                            Order Number
                                        </span>

                                        <h3>
                                            {order.order_number}
                                        </h3>
                                    </div>

                                    <span
                                        className={getStatusClass(
                                            order.status
                                        )}
                                    >
                                        {order.status}
                                    </span>

                                </div>


                                <div className="order-card-details">

                                    <div>
                                        <span>
                                            Order Date
                                        </span>

                                        <strong>
                                            {new Date(
                                                order.created_at
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                }
                                            )}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Payment
                                        </span>

                                        <strong>
                                            {
                                                order.payment_method
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Payment Status
                                        </span>

                                        <strong>
                                            {
                                                order.payment_status
                                            }
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Total
                                        </span>

                                        <strong className="order-price">
                                            ₹
                                            {Number(
                                                order.total
                                            ).toFixed(2)}
                                        </strong>
                                    </div>

                                </div>


                                <div className="order-card-bottom">

                                    <span>
                                        Order status:{" "}
                                        <strong>
                                            {order.status}
                                        </strong>
                                    </span>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/orders/${order.id}`
                                            )
                                        }
                                    >
                                        View Details
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default Orders;