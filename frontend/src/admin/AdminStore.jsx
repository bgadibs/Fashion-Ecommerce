import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import AdminLayout from "./AdminLayout";

import ProductCard from "../components/ProductCard";

import {
    getProducts
} from "../services/api";

import {
    useStore
} from "../context/StoreContext";

import "../css/home.css";
import "../css/admin-store.css";


const AdminStore = () => {

    const navigate = useNavigate();

    const {
        storeName,
        mainCategories: storeCategories,
    } = useStore();


    // =====================================================
    // STATES
    // =====================================================

    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedCategory, setSelectedCategory] =
        useState("all");


    // =====================================================
    // LOAD PRODUCTS
    // =====================================================

    useEffect(() => {

        const loadProducts = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await getProducts();


                console.log(
                    "ADMIN STORE PRODUCTS:",
                    response.data
                );


                /*
                 * Backend may return either:
                 *
                 * response.data
                 *
                 * or
                 *
                 * response.data.products
                 */

                const data =
                    response.data;


                if (Array.isArray(data)) {

                    setProducts(data);

                } else if (
                    Array.isArray(data?.products)
                ) {

                    setProducts(
                        data.products
                    );

                } else {

                    setProducts([]);

                }


            } catch (error) {

                console.error(
                    "ADMIN STORE ERROR:",
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


        loadProducts();

    }, []);


    // =====================================================
    // CATEGORY FILTER
    // =====================================================

    const filteredProducts =
        useMemo(() => {

            if (
                selectedCategory === "all"
            ) {

                return products;

            }


            /* Dynamic filtering by category ID or name */
            return products.filter(
                (product) => {

                    const productCatId =
                        String(
                            product.category_id || ""
                        );

                    const categoryName =
                        String(
                            product.category_name ||
                            product.category ||
                            product.category_slug ||
                            ""
                        ).toLowerCase();

                    const categorySlug =
                        String(
                            product.category_slug ||
                            ""
                        ).toLowerCase();


                    /* Match by category ID */
                    if (
                        productCatId === String(selectedCategory)
                    ) {
                        return true;
                    }

                    /* Fallback: match by name */
                    const selectedLower =
                        String(selectedCategory).toLowerCase();

                    return (
                        categoryName.includes(selectedLower) ||
                        categorySlug.includes(selectedLower)
                    );

                }
            );

        }, [
            products,
            selectedCategory
        ]);


    // =====================================================
    // CATEGORY CLICK
    // =====================================================

    const handleCategoryClick =
        (category) => {

            setSelectedCategory(
                category
            );


            setTimeout(() => {

                const productSection =
                    document.getElementById(
                        "admin-store-products"
                    );


                if (productSection) {

                    productSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }, 100);

        };


    // =====================================================
    // PRODUCT COUNT
    // =====================================================

    const totalProducts =
        products.length;

    const displayedProducts =
        filteredProducts.length;


    // =====================================================
    // CATEGORY TITLE
    // =====================================================

    const getCategoryTitle = () => {

        if (selectedCategory === "all") {
            return "Latest Products";
        }

        /* Find the category by ID or name */
        const match = storeCategories.find(
            (cat) =>
                String(cat.id) === String(selectedCategory) ||
                cat.name.toLowerCase() ===
                    String(selectedCategory).toLowerCase()
        );

        return match
            ? match.name
            : "Latest Products";

    };


    // =====================================================
    // BACK TO DASHBOARD
    // =====================================================

    const handleBackToDashboard = () => {

        navigate(
            "/admin/dashboard"
        );

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <AdminLayout>

            <div className="admin-store-wrapper">


                {/* =================================================
                    ADMIN STORE TOP BAR
                ================================================= */}

                <div className="admin-store-topbar">

                    <div>

                        <span className="admin-store-preview-label">
                            ADMIN STORE PREVIEW
                        </span>

                        <h1>
                            {storeName}
                        </h1>

                        <p>
                            Full customer storefront preview.
                            Your admin session remains active.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="admin-store-back-dashboard"
                        onClick={
                            handleBackToDashboard
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </div>


                {/* =================================================
                    PREVIEW NOTICE
                ================================================= */}

                <div className="admin-store-preview-notice">

                    <div className="admin-store-preview-icon">
                        👁️
                    </div>

                    <div>

                        <strong>
                            Store Preview Mode
                        </strong>

                        <p>
                            You are viewing the complete
                            customer storefront from the
                            Admin Panel. You are not logged
                            out of your admin account.
                        </p>

                    </div>

                </div>


                {/* =================================================
                    FULL HOME PAGE
                ================================================= */}

                <div className="admin-store-home">


                    {/* =================================================
                        HERO
                    ================================================= */}

                    <section className="hero">

                        <div className="hero-content">

                            <div className="hero-content-inner">

                                <span className="hero-eyebrow">
                                    NEW COLLECTION
                                </span>


                                <h1 className="hero-title">

                                    Upgrade Your

                                    <span>
                                        Style Today
                                    </span>

                                </h1>


                                <p className="hero-description">

                                    Fashion for everyone.
                                    Discover our latest
                                    collection of stylish
                                    clothing and accessories.

                                </p>


                                <div className="hero-buttons">

                                    {storeCategories
                                        .slice(0, 2)
                                        .map((cat, idx) => (

                                        <button
                                            key={cat.id}
                                            type="button"
                                            className={
                                                idx === 0
                                                    ? "hero-button"
                                                    : "hero-button-secondary"
                                            }
                                            onClick={() =>
                                                handleCategoryClick(
                                                    cat.id
                                                )
                                            }
                                        >
                                            Shop {cat.name}
                                            {" →"}
                                        </button>

                                    ))}

                                </div>


                                <div className="hero-features">

                                    <div className="hero-feature">

                                        <div className="hero-feature-icon">
                                            🚚
                                        </div>

                                        <div className="hero-feature-text">

                                            <strong>
                                                Fast Delivery
                                            </strong>

                                            <span>
                                                Quick & safe delivery
                                            </span>

                                        </div>

                                    </div>


                                    <div className="hero-feature">

                                        <div className="hero-feature-icon">
                                            🔒
                                        </div>

                                        <div className="hero-feature-text">

                                            <strong>
                                                Secure Shopping
                                            </strong>

                                            <span>
                                                Safe & trusted
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                        <div className="hero-side-label">
                            {storeName.toUpperCase()}
                        </div>

                    </section>


                    {/* =================================================
                        CATEGORIES
                    ================================================= */}

                    <section className="home-categories">

                        <div className="home-container">

                            <div className="home-heading">

                                <div>

                                    <span className="home-eyebrow">
                                        EXPLORE
                                    </span>

                                    <h2>
                                        Shop By Category
                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    className="home-heading-link admin-store-view-all-button"
                                    onClick={() =>
                                        handleCategoryClick(
                                            "all"
                                        )
                                    }
                                >
                                    View All →
                                </button>

                            </div>


                            <div className="home-category-grid">

                                {storeCategories.map(
                                    (cat) => (

                                        <button
                                            key={cat.id}
                                            type="button"
                                            className={`category-card admin-store-category-button ${
                                                String(selectedCategory) ===
                                                String(cat.id)
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleCategoryClick(
                                                    cat.id
                                                )
                                            }
                                        >

                                            {cat.image || cat.image_url ? (

                                                <img
                                                    src={
                                                        cat.image ||
                                                        cat.image_url
                                                    }
                                                    alt={cat.name}
                                                    className="category-icon-img"
                                                />

                                            ) : (

                                                <div className="category-icon">
                                                    ✦
                                                </div>

                                            )}

                                            <h3>
                                                {cat.name}
                                            </h3>

                                            {cat.description && (
                                                <p>
                                                    {cat.description}
                                                </p>
                                            )}

                                        </button>

                                    )
                                )}

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        PRODUCTS
                    ================================================= */}

                    <section
                        id="admin-store-products"
                        className="home-products"
                    >

                        <div className="home-container">


                            <div className="home-heading">

                                <div>

                                    <span className="home-eyebrow">
                                        OUR COLLECTION
                                    </span>

                                    <h2>
                                        {getCategoryTitle()}
                                    </h2>

                                </div>


                                <div className="admin-store-product-summary">

                                    Showing{" "}

                                    <strong>
                                        {displayedProducts}
                                    </strong>

                                    {" "}of{" "}

                                    <strong>
                                        {totalProducts}
                                    </strong>

                                    {" "}products

                                </div>

                            </div>


                            {/* LOADING */}

                            {loading && (

                                <div className="home-loading">

                                    Loading products...

                                </div>

                            )}


                            {/* ERROR */}

                            {!loading &&
                                error && (

                                <div className="home-empty">

                                    <div className="home-empty-icon">
                                        ⚠️
                                    </div>

                                    <h3>
                                        Unable to Load Products
                                    </h3>

                                    <p>
                                        {error}
                                    </p>

                                </div>

                            )}


                            {/* EMPTY */}

                            {!loading &&
                                !error &&
                                filteredProducts.length ===
                                    0 && (

                                <div className="home-empty">

                                    <div className="home-empty-icon">
                                        🛍️
                                    </div>

                                    <h3>
                                        No Products Found
                                    </h3>

                                    <p>
                                        There are no products
                                        available in this
                                        category.
                                    </p>

                                </div>

                            )}


                            {/* PRODUCTS */}

                            {!loading &&
                                !error &&
                                filteredProducts.length >
                                    0 && (

                                <div className="home-product-grid">

                                    {filteredProducts
                                        .slice(0, 8)
                                        .map(
                                            (product) => (

                                                <ProductCard
                                                    key={
                                                        product.id
                                                    }
                                                    product={
                                                        product
                                                    }
                                                />

                                            )
                                        )}

                                </div>

                            )}

                        </div>

                    </section>


                    {/* =================================================
                        FASHION STORY
                    ================================================= */}

                    <section className="home-fashion-section">

                        <div className="home-container">

                            <div className="home-fashion-banner">

                                <div className="home-fashion-content">

                                    <span>
                                        OUR FASHION STORY
                                    </span>

                                    <h2>
                                        Style That
                                        Speaks For You
                                    </h2>

                                    <p>
                                        Discover carefully selected
                                        fashion pieces designed to
                                        make every day feel special.
                                    </p>

                                    <button
                                        type="button"
                                        className="home-primary-button"
                                        onClick={() =>
                                            handleCategoryClick(
                                                "all"
                                            )
                                        }
                                    >
                                        Explore Collection
                                        →
                                    </button>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        FINAL CTA
                    ================================================= */}

                    <section className="home-final-cta">

                        <div className="home-container">

                            <div className="home-final-content">

                                <span className="home-eyebrow">
                                    DISCOVER YOUR STYLE
                                </span>

                                <h2>
                                    Fashion For Everyone
                                </h2>

                                <p>
                                    Explore our latest collections
                                    and find something that feels
                                    uniquely yours.
                                </p>

                                <button
                                    type="button"
                                    className="home-primary-button"
                                    onClick={() =>
                                        handleCategoryClick(
                                            "all"
                                        )
                                    }
                                >
                                    Shop Collection →
                                </button>

                            </div>

                        </div>

                    </section>


                </div>

            </div>

        </AdminLayout>

    );

};


export default AdminStore;