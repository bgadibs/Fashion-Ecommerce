import React, {
    useEffect,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import AdminLayout from "./AdminLayout";

import {
    getAdminOrders,
    updateAdminOrderStatus
} from "../services/api";

import "../css/admin-orders.css";


const AdminOrders = () => {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadOrders = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAdminOrders();

            console.log(
                "ADMIN ORDERS:",
                response.data
            );

            if (response.data.success) {

                setOrders(
                    response.data.orders || []
                );

            } else {

                setError(
                    response.data.message ||
                    "Failed to load orders"
                );
            }

        } catch (error) {

            console.error(
                "ADMIN ORDERS ERROR:",
                error
            );

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                localStorage.removeItem(
                    "adminToken"
                );

                localStorage.removeItem(
                    "admin"
                );

                navigate("/admin/login");

                return;
            }

            setError(
                error.response?.data?.message ||
                "Unable to load orders"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadOrders();

    }, []);


    const handleStatusChange =
        async (orderId, status) => {

            try {

                await updateAdminOrderStatus(
                    orderId,
                    status
                );

                await loadOrders();

            } catch (error) {

                console.error(
                    "STATUS UPDATE ERROR:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to update order status"
                );
            }
        };


    const formatCurrency = (amount) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2
            }
        ).format(
            Number(amount || 0)
        );
    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date)
            .toLocaleString("en-IN");
    };


    if (loading) {

        return (
            <AdminLayout>

                <div className="admin-loading">
                    Loading orders...
                </div>

            </AdminLayout>
        );
    }


    return (
        <AdminLayout>

            <div className="admin-orders-page">

                {/* HEADER */}

                <div className="orders-page-header">

                    <div>

                        <h1>
                            Orders
                        </h1>

                        <p>
                            Manage customer orders
                        </p>

                    </div>

                    <button
                        className="refresh-orders-btn"
                        onClick={loadOrders}
                    >
                        🔄 Refresh
                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="dashboard-error">
                        {error}
                    </div>

                )}


                {/* EMPTY */}

                {orders.length === 0 ? (

                    <div className="empty-orders">

                        <h3>
                            No orders found
                        </h3>

                        <p>
                            Customer orders will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="admin-orders-table-wrapper">

                        <table className="admin-orders-table">

                            <thead>

                                <tr>

                                    <th>
                                        Order
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Total
                                    </th>

                                    <th>
                                        Payment
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {orders.map(
                                    (order) => (

                                        <tr
                                            key={
                                                order.id
                                            }
                                        >

                                            <td>

                                                <strong>
                                                    {
                                                        order.order_number
                                                    }
                                                </strong>

                                            </td>


                                            <td>

                                                <strong>
                                                    {
                                                        order.customer_name ||
                                                        "-"
                                                    }
                                                </strong>

                                                <small>
                                                    {
                                                        order.customer_email ||
                                                        "-"
                                                    }
                                                </small>

                                            </td>


                                            <td>

                                                {
                                                    formatDate(
                                                        order.created_at
                                                    )
                                                }

                                            </td>


                                            <td>

                                                <strong>
                                                    {
                                                        formatCurrency(
                                                            order.total
                                                        )
                                                    }
                                                </strong>

                                            </td>


                                            <td>

                                                <span className="payment-info">

                                                    {
                                                        order.payment_method ||
                                                        "-"
                                                    }

                                                    <small>
                                                        {
                                                            order.payment_status ||
                                                            "-"
                                                        }
                                                    </small>

                                                </span>

                                            </td>


                                            <td>

                                                <select
                                                    className={`order-status-select ${order.status}`}
                                                    value={
                                                        order.status
                                                    }
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            order.id,
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="pending">
                                                        Pending
                                                    </option>

                                                    <option value="paid">
                                                        Paid
                                                    </option>

                                                    <option value="processing">
                                                        Processing
                                                    </option>

                                                    <option value="shipped">
                                                        Shipped
                                                    </option>

                                                    <option value="delivered">
                                                        Delivered
                                                    </option>

                                                    <option value="cancelled">
                                                        Cancelled
                                                    </option>

                                                    <option value="refunded">
                                                        Refunded
                                                    </option>

                                                </select>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </AdminLayout>
    );
};

export default AdminOrders;