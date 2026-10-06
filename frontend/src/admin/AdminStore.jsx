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

import "../css/home.css";
import "../css/admin-store.css";


const AdminStore = () => {

    const navigate = useNavigate();


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


            return products.filter(
                (product) => {

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


                    if (
                        selectedCategory === "women"
                    ) {

                        return (
                            categoryName.includes(
                                "women"
                            ) ||
                            categoryName.includes(
                                "woman"
                            ) ||
                            categorySlug.includes(
                                "women"
                            )
                        );

                    }


                    if (
                        selectedCategory === "men"
                    ) {

                        return (
                            categoryName.includes(
                                "men"
                            ) ||
                            categoryName.includes(
                                "man"
                            ) ||
                            categorySlug.includes(
                                "men"
                            )
                        );

                    }


                    if (
                        selectedCategory === "kids"
                    ) {

                        return (
                            categoryName.includes(
                                "kid"
                            ) ||
                            categoryName.includes(
                                "children"
                            ) ||
                            categorySlug.includes(
                                "kid"
                            )
                        );

                    }


                    if (
                        selectedCategory ===
                        "jewellery"
                    ) {

                        return (
                            categoryName.includes(
                                "jewellery"
                            ) ||
                            categoryName.includes(
                                "jewelry"
                            ) ||
                            categorySlug.includes(
                                "jewellery"
                            ) ||
                            categorySlug.includes(
                                "jewelry"
                            )
                        );

                    }


                    return false;

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

        if (
            selectedCategory === "women"
        ) {

            return "Women's Fashion";

        }


        if (
            selectedCategory === "men"
        ) {

            return "Men's Fashion";

        }


        if (
            selectedCategory === "kids"
        ) {

            return "Kids Fashion";

        }


        if (
            selectedCategory === "jewellery"
        ) {

            return "Jewellery";

        }


        return "Latest Products";

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
                            Fashion Store
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

                                    <button
                                        type="button"
                                        className="hero-button"
                                        onClick={() =>
                                            handleCategoryClick(
                                                "women"
                                            )
                                        }
                                    >
                                        Shop Women
                                        →
                                    </button>


                                    <button
                                        type="button"
                                        className="hero-button-secondary"
                                        onClick={() =>
                                            handleCategoryClick(
                                                "men"
                                            )
                                        }
                                    >
                                        Shop Men
                                        →
                                    </button>

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
                            FASHION STORE
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


                                {/* WOMEN */}

                                <button
                                    type="button"
                                    className={`category-card admin-store-category-button ${
                                        selectedCategory ===
                                        "women"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleCategoryClick(
                                            "women"
                                        )
                                    }
                                >

                                    <div className="category-icon">
                                        👗
                                    </div>

                                    <h3>
                                        Women's Fashion
                                    </h3>

                                    <p>
                                        Latest Trends
                                    </p>

                                </button>


                                {/* MEN */}

                                <button
                                    type="button"
                                    className={`category-card admin-store-category-button ${
                                        selectedCategory ===
                                        "men"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleCategoryClick(
                                            "men"
                                        )
                                    }
                                >

                                    <div className="category-icon">
                                        👔
                                    </div>

                                    <h3>
                                        Men's Fashion
                                    </h3>

                                    <p>
                                        Smart & Stylish
                                    </p>

                                </button>


                                {/* KIDS */}

                                <button
                                    type="button"
                                    className={`category-card admin-store-category-button ${
                                        selectedCategory ===
                                        "kids"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleCategoryClick(
                                            "kids"
                                        )
                                    }
                                >

                                    <div className="category-icon">
                                        🧒
                                    </div>

                                    <h3>
                                        Kids Fashion
                                    </h3>

                                    <p>
                                        Cute & Comfortable
                                    </p>

                                </button>


                                {/* JEWELLERY */}

                                <button
                                    type="button"
                                    className={`category-card admin-store-category-button ${
                                        selectedCategory ===
                                        "jewellery"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleCategoryClick(
                                            "jewellery"
                                        )
                                    }
                                >

                                    <div className="category-icon">
                                        💎
                                    </div>

                                    <h3>
                                        Jewellery
                                    </h3>

                                    <p>
                                        Elegant Collection
                                    </p>

                                </button>


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