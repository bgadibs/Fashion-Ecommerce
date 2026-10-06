import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminLayout from "./AdminLayout";

import {
    getAdminProducts,
    archiveAdminProduct,
    restoreAdminProduct,
    deleteAdminProduct
} from "../services/api";

import "../css/admin-products.css";


const AdminProducts = () => {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

    const loadProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getAdminProducts();

            console.log(
                "ADMIN PRODUCTS:",
                response.data
            );

            if (response.data.success) {

                setProducts(
                    response.data.products || []
                );

            } else {

                setError(
                    response.data.message ||
                    "Failed to load products"
                );
            }

        } catch (error) {

            console.error(
                "ADMIN PRODUCTS ERROR:",
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

                navigate("/login");

                return;
            }

            setError(
                error.response?.data?.message ||
                "Unable to load products"
            );

        } finally {

            setLoading(false);
        }
    };


    /* =====================================================
       LOAD ON PAGE OPEN
    ===================================================== */

    useEffect(() => {

        loadProducts();

    }, []);


    /* =====================================================
       ARCHIVE PRODUCT
    ===================================================== */

    const handleArchive = async (id) => {

        const confirmArchive =
            window.confirm(
                "Are you sure you want to archive this product?"
            );

        if (!confirmArchive) {
            return;
        }

        try {

            await archiveAdminProduct(id);

            alert(
                "Product archived successfully."
            );

            await loadProducts();

        } catch (error) {

            console.error(
                "ARCHIVE PRODUCT ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to archive product"
            );
        }
    };


    /* =====================================================
       RESTORE PRODUCT
    ===================================================== */

    const handleRestore = async (id) => {

        const confirmRestore =
            window.confirm(
                "Do you want to restore this product?"
            );

        if (!confirmRestore) {
            return;
        }

        try {

            await restoreAdminProduct(id);

            alert(
                "Product restored successfully."
            );

            await loadProducts();

        } catch (error) {

            console.error(
                "RESTORE PRODUCT ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to restore product"
            );
        }
    };


    /* =====================================================
       PERMANENT DELETE PRODUCT
    ===================================================== */

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "WARNING: This will permanently delete the product. Continue?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteAdminProduct(id);

            alert(
                "Product permanently deleted."
            );

            await loadProducts();

        } catch (error) {

            console.error(
                "DELETE PRODUCT ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete product"
            );
        }
    };


    /* =====================================================
       FORMAT CURRENCY
    ===================================================== */

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


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (
            <AdminLayout>

                <div className="admin-loading">
                    Loading products...
                </div>

            </AdminLayout>
        );
    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <AdminLayout>

            <div className="admin-products-page">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="products-page-header">

                    <div>

                        <h1>
                            Products
                        </h1>

                        <p>
                            Manage your fashion products
                        </p>

                    </div>


                    <button
                        type="button"
                        className="add-product-btn"
                        onClick={() =>
                            navigate(
                                "/admin/products/add"
                            )
                        }
                    >
                        + Add Product
                    </button>

                </div>


                {/* =================================================
                   ERROR
                ================================================= */}

                {error && (

                    <div className="dashboard-error">
                        {error}
                    </div>

                )}


                {/* =================================================
                   COUNT
                ================================================= */}

                <div className="products-count">

                    Total Products:

                    <strong>
                        {products.length}
                    </strong>

                </div>


                {/* =================================================
                   EMPTY PRODUCTS
                ================================================= */}

                {products.length === 0 ? (

                    <div className="empty-products">

                        <h3>
                            No products found
                        </h3>

                        <p>
                            Start by adding your first
                            fashion product.
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/products/add"
                                )
                            }
                        >
                            Add Product
                        </button>

                    </div>

                ) : (

                    /* =================================================
                       PRODUCTS TABLE
                    ================================================= */

                    <div className="admin-products-table-wrapper">

                        <table className="admin-products-table">

                            <thead>

                                <tr>

                                    <th>
                                        Image
                                    </th>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Sale Price
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {products.map(
                                    (product) => (

                                        <tr
                                            key={
                                                product.id
                                            }
                                        >


                                            {/* IMAGE */}

                                            <td>

                                                {product.image ? (

                                                    <img
                                                        src={
                                                            product.image
                                                        }
                                                        alt={
                                                            product.name
                                                        }
                                                        className="admin-product-image"
                                                    />

                                                ) : (

                                                    <div className="no-product-image">
                                                        No Image
                                                    </div>

                                                )}

                                            </td>


                                            {/* PRODUCT */}

                                            <td>

                                                <strong>
                                                    {
                                                        product.name
                                                    }
                                                </strong>

                                                <small>
                                                    SKU:{" "}
                                                    {
                                                        product.sku ||
                                                        "-"
                                                    }
                                                </small>

                                            </td>


                                            {/* CATEGORY */}

                                            <td>

                                                {
                                                    product.category_name ||
                                                    "-"
                                                }

                                            </td>


                                            {/* PRICE */}

                                            <td>

                                                {
                                                    formatCurrency(
                                                        product.base_price
                                                    )
                                                }

                                            </td>


                                            {/* SALE PRICE */}

                                            <td>

                                                {product.sale_price
                                                    ? formatCurrency(
                                                        product.sale_price
                                                    )
                                                    : "-"}

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`product-status ${product.status}`}
                                                >
                                                    {
                                                        product.status
                                                    }
                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="product-actions">


                                                    {/* =================================
                                                       EDIT
                                                    ================================= */}

                                                    <button
                                                        type="button"
                                                        className="edit-product-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/products/edit/${product.id}`
                                                            )
                                                        }
                                                    >
                                                        ✏️ Edit
                                                    </button>


                                                    {/* =================================
                                                       ARCHIVE
                                                    ================================= */}

                                                    {product.status !== "archived" && (

                                                        <button
                                                            type="button"
                                                            className="archive-product-btn"
                                                            onClick={() =>
                                                                handleArchive(
                                                                    product.id
                                                                )
                                                            }
                                                        >
                                                            📦 Archive
                                                        </button>

                                                    )}


                                                    {/* =================================
                                                       RESTORE
                                                    ================================= */}

                                                    {product.status === "archived" && (

                                                        <button
                                                            type="button"
                                                            className="restore-product-btn"
                                                            onClick={() =>
                                                                handleRestore(
                                                                    product.id
                                                                )
                                                            }
                                                        >
                                                            ♻️ Restore
                                                        </button>

                                                    )}


                                                    {/* =================================
                                                       DELETE
                                                    ================================= */}

                                                    <button
                                                        type="button"
                                                        className="delete-product-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id
                                                            )
                                                        }
                                                    >
                                                        🗑️ Delete
                                                    </button>


                                                </div>

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


export default AdminProducts;