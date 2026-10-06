
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";

import {
    getCategories,
    getProducts,
    getHomeStats,
} from "../services/api";

import "../css/home.css";

const Home = () => {

    /* =========================================
       CATEGORIES
    ========================================= */

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] =
        useState(true);


    /* =========================================
       PRODUCTS
    ========================================= */

    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] =
        useState(true);


    /* =========================================
       HOME STATS
    ========================================= */

    const [homeStats, setHomeStats] = useState({
        customers: 0,
        products: 0,
        orders: 0,
        rating: "0.0",
    });

    const [loadingStats, setLoadingStats] =
        useState(true);


    /* =========================================
       LOAD HOME DATA
    ========================================= */

    useEffect(() => {

        const loadHomeData = async () => {

            /* -------------------------------------
               LOAD CATEGORIES
            ------------------------------------- */

            try {

                const response = await getCategories();

                setCategories(
                    response.data?.categories || []
                );

            } catch (error) {

                console.error(
                    "Failed to load categories:",
                    error
                );

            } finally {

                setLoadingCategories(false);

            }


            /* -------------------------------------
               LOAD PRODUCTS
            ------------------------------------- */

            try {

                const response = await getProducts({
                    featured: 1,
                });

                setProducts(
                    response.data?.products || []
                );

            } catch (error) {

                console.error(
                    "Failed to load products:",
                    error
                );

            } finally {

                setLoadingProducts(false);

            }


            /* -------------------------------------
               LOAD DYNAMIC HOME STATS
            ------------------------------------- */

            try {

                const response = await getHomeStats();

                if (response.data?.success) {

                    setHomeStats(
                        response.data.stats
                    );

                }

            } catch (error) {

                console.error(
                    "Failed to load home statistics:",
                    error
                );

            } finally {

                setLoadingStats(false);

            }

        };


        loadHomeData();

    }, []);


    /* =========================================
       MAIN CATEGORIES
    ========================================= */

    const mainCategories = categories.filter(
        (category) =>
            category.parent_id === null
    );


    return (
        <div className="home-page">


            {/* =====================================
                HERO
            ===================================== */}

            <Hero
                homeStats={homeStats}
                loadingStats={loadingStats}
            />


            {/* =====================================
                SHOP BY CATEGORY
            ===================================== */}

            <section className="home-categories">

                <div className="home-container">

                    <div className="home-heading">

                        <div>

                            <span className="home-eyebrow">
                                EXPLORE
                            </span>

                            <h2>
                                Shop by category
                            </h2>

                        </div>

                        <Link
                            to="/products"
                            className="home-heading-link"
                        >
                            View all
                            <span>→</span>
                        </Link>

                    </div>


                    {loadingCategories ? (

                        <div className="home-loading">
                            Loading categories...
                        </div>

                    ) : mainCategories.length === 0 ? (

                        <div className="home-empty">
                            No categories available.
                        </div>

                    ) : (

                        <div className="home-category-grid">

                            {mainCategories.map(
                                (category) => (

                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                    />

                                )
                            )}

                        </div>

                    )}

                </div>

            </section>


            {/* =====================================
                TRENDING PRODUCTS
            ===================================== */}

            <section className="home-products">

                <div className="home-container">

                    <div className="home-heading">

                        <div>

                            <span className="home-eyebrow">
                                TRENDING NOW
                            </span>

                            <h2>
                                Must-have styles
                            </h2>

                        </div>

                        <Link
                            to="/products"
                            className="home-heading-link"
                        >
                            Shop all
                            <span>→</span>
                        </Link>

                    </div>


                    {loadingProducts ? (

                        <div className="home-loading">
                            Loading products...
                        </div>

                    ) : products.length === 0 ? (

                        <div className="home-empty">

                            <div className="home-empty-icon">
                                ✨
                            </div>

                            <h3>
                                New styles coming soon
                            </h3>

                            <p>
                                We're preparing something
                                beautiful for you.
                            </p>

                        </div>

                    ) : (

                        <div className="home-product-grid">

                            {products
                                .slice(0, 8)
                                .map((product) => (

                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />

                                ))}

                        </div>

                    )}

                </div>

            </section>


            {/* =====================================
                FASHION STORY
            ===================================== */}

            <section className="home-fashion-section">

                <div className="home-container">

                    <div className="home-fashion-banner">

                        <div className="home-fashion-content">

                            <span>
                                THE NEW SEASON
                            </span>

                            <h2>
                                Dress the way
                                <br />
                                you feel.
                            </h2>

                            <p>
                                Discover versatile pieces,
                                timeless essentials and
                                fresh seasonal styles.
                            </p>

                            <Link
                                to="/products"
                                className="home-primary-button"
                            >
                                Explore Collection
                                <span>→</span>
                            </Link>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================
                STORE STATS
            ===================================== */}

            <section className="home-stats">

                <div className="home-container">

                    <div className="home-stats-header">

                        <span className="home-eyebrow">
                            WHY SHOP WITH US
                        </span>

                        <h2>
                            Made for your style
                        </h2>

                    </div>


                    <div className="home-stats-grid">


                        {/* FASHION STYLES */}

                        <div className="home-stat">

                            <div className="home-stat-icon">
                                ✦
                            </div>

                            <div>

                                <strong>
                                    {loadingStats
                                        ? "..."
                                        : `${homeStats.products}+`}
                                </strong>

                                <span>
                                    Fashion Styles
                                </span>

                            </div>

                        </div>


                        {/* CUSTOMERS */}

                        <div className="home-stat">

                            <div className="home-stat-icon">
                                ♡
                            </div>

                            <div>

                                <strong>
                                    {loadingStats
                                        ? "..."
                                        : `${homeStats.customers}+`}
                                </strong>

                                <span>
                                    Happy Customers
                                </span>

                            </div>

                        </div>


                        {/* RATING */}

                        <div className="home-stat">

                            <div className="home-stat-icon">
                                ★
                            </div>

                            <div>

                                <strong>
                                    {loadingStats
                                        ? "..."
                                        : homeStats.rating}
                                </strong>

                                <span>
                                    Customer Rating
                                </span>

                            </div>

                        </div>


                        {/* ORDERS */}

                        <div className="home-stat">

                            <div className="home-stat-icon">
                                ◇
                            </div>

                            <div>

                                <strong>
                                    {loadingStats
                                        ? "..."
                                        : `${homeStats.orders}+`}
                                </strong>

                                <span>
                                    Orders
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================
                FINAL CTA
            ===================================== */}

            <section className="home-final-cta">

                <div className="home-container">

                    <div className="home-final-content">

                        <span className="home-eyebrow">
                            YOUR STYLE STARTS HERE
                        </span>

                        <h2>
                            Find something
                            <br />
                            you'll love.
                        </h2>

                        <p>
                            Explore our latest collection
                            and find your next favorite look.
                        </p>

                        <Link
                            to="/products"
                            className="home-primary-button"
                        >
                            Shop Now
                            <span>→</span>
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default Home;

