import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useSearchParams
} from "react-router-dom";

import AdminLayout from "./AdminLayout";

import {
    getProducts
} from "../services/api";

import "../css/admin-store.css";

const AdminStoreCategory = () => {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const category =
        searchParams.get("category");


    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // CATEGORY NAME
    // =====================================================

    const getCategoryName = () => {

        if (category === "women") {
            return "Women's Fashion";
        }

        if (category === "men") {
            return "Men's Fashion";
        }

        if (category === "kids") {
            return "Kids Fashion";
        }

        return "Fashion Products";
    };


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    const loadProducts = async () => {

        try {

            setLoading(true);

            setError("");


            const response =
                await getProducts({
                    category
                });


            console.log(
                "ADMIN STORE PRODUCTS:",
                response.data
            );


            if (response.data.success) {

                setProducts(
                    response.data.products || []
                );

            } else {

                setError(
                    response.data.message ||
                    "Unable to load products"
                );

            }

        } catch (error) {

            console.error(
                "ADMIN STORE PRODUCTS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load products"
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD WHEN CATEGORY CHANGES
    // =====================================================

    useEffect(() => {

        if (
            category === "women" ||
            category === "men" ||
            category === "kids"
        ) {

            loadProducts();

        } else {

            setLoading(false);

            setError(
                "Invalid category"
            );

        }

    }, [category]);


    // =====================================================
    // FORMAT PRICE
    // =====================================================

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


    // =====================================================
    // GET PRODUCT IMAGE
    // =====================================================

    const getProductImage = (product) => {

        if (product.image) {
            return product.image;
        }

        if (product.image_url) {
            return product.image_url;
        }

        return null;

    };


    return (
        <AdminLayout>

            <div className="admin-store-category-page">


                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <button
                    type="button"
                    className="admin-store-back-button"
                    onClick={() =>
                        navigate("/admin/store")
                    }
                >
                    ← Back to Store
                </button>


                {/* =================================================
                    CATEGORY HEADER
                ================================================= */}

                <div className="admin-store-category-header">

                    <div>

                        <span className="admin-store-eyebrow">
                            STORE PREVIEW
                        </span>

                        <h1>
                            {getCategoryName()}
                        </h1>

                        <p>
                            Preview products available
                            in this category.
                        </p>

                    </div>


                    <div className="admin-store-product-count">

                        <strong>
                            {products.length}
                        </strong>

                        <span>
                            Products
                        </span>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="admin-store-error">

                        {error}

                    </div>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading ? (

                    <div className="admin-store-loading">

                        <div className="admin-store-loader">
                            Loading products...
                        </div>

                    </div>

                ) : products.length === 0 ? (

                    /* =================================================
                       EMPTY
                    ================================================= */

                    <div className="admin-store-empty">

                        <div className="admin-store-empty-icon">
                            🛍️
                        </div>

                        <h2>
                            No Products Found
                        </h2>

                        <p>
                            There are currently no active
                            products in {getCategoryName()}.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/admin/products/add"
                                )
                            }
                        >
                            + Add Product
                        </button>

                    </div>

                ) : (

                    /* =================================================
                       PRODUCT GRID
                    ================================================= */

                    <div className="admin-store-product-grid">

                        {products.map(
                            (product) => {

                                const image =
                                    getProductImage(
                                        product
                                    );

                                const price =
                                    product.sale_price ||
                                    product.base_price;


                                return (

                                    <div
                                        className="admin-store-product-card"
                                        key={product.id}
                                    >

                                        {/* IMAGE */}

                                        <div className="admin-store-product-image">

                                            {image ? (

                                                <img
                                                    src={image}
                                                    alt={
                                                        product.name
                                                    }
                                                />

                                            ) : (

                                                <div className="admin-store-no-image">
                                                    No Image
                                                </div>

                                            )}

                                        </div>


                                        {/* CONTENT */}

                                        <div className="admin-store-product-content">

                                            <span className="admin-store-product-category">
                                                {product.category_name ||
                                                    getCategoryName()}
                                            </span>

                                            <h3>
                                                {product.name}
                                            </h3>


                                            {product.brand && (

                                                <p className="admin-store-product-brand">
                                                    {product.brand}
                                                </p>

                                            )}


                                            <div className="admin-store-product-price">

                                                {product.sale_price ? (

                                                    <>
                                                        <strong>
                                                            {formatCurrency(
                                                                product.sale_price
                                                            )}
                                                        </strong>

                                                        <span>
                                                            {formatCurrency(
                                                                product.base_price
                                                            )}
                                                        </span>
                                                    </>

                                                ) : (

                                                    <strong>
                                                        {formatCurrency(
                                                            price
                                                        )}
                                                    </strong>

                                                )}

                                            </div>


                                            <div className="admin-store-product-status">

                                                <span>
                                                    Available
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

            </div>

        </AdminLayout>
    );
};

export default AdminStoreCategory;