
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";

import {
    getProducts,
    getCategories,
} from "../services/api";

import "../css/products.css";


const Products = () => {

    const [searchParams, setSearchParams] =
        useSearchParams();

    const [products, setProducts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    /* =====================================================
       URL PARAMETERS
    ===================================================== */

    const search =
        searchParams.get("search") || "";

    const category =
        searchParams.get("category") || "";


    /* =====================================================
       LOAD PRODUCTS
    ===================================================== */

    const loadProducts = async () => {

        setLoading(true);

        try {

            const response =
                await getProducts({

                    search:
                        search || undefined,

                    category:
                        category || undefined,

                });


            setProducts(
                Array.isArray(
                    response.data?.products
                )
                    ? response.data.products
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load products:",
                error
            );

            setProducts([]);

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       LOAD PRODUCTS WHEN CATEGORY / SEARCH CHANGES
    ===================================================== */

    useEffect(() => {

        loadProducts();

    }, [search, category]);


    /* =====================================================
       LOAD CATEGORIES
    ===================================================== */

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const response =
                    await getCategories();

                const data =
                    response.data?.categories || [];

                setCategories(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load categories:",
                    error
                );

                setCategories([]);

            }

        };


        loadCategories();

    }, []);


    /* =====================================================
       MAIN CATEGORY
       
       Example:
       
       women
       men
       kids
    ===================================================== */

    const selectedMainCategory =
        useMemo(() => {

            return categories.find(
                (item) =>
                    item.slug === category &&
                    (
                        item.parent_id === null ||
                        item.parent_id === undefined
                    )
            );

        }, [categories, category]);


    /* =====================================================
       SUBCATEGORIES
       
       Only show children of the selected
       main category.
       
       Women:
       Dresses
       Tops

       Men:
       Shirts
       T-Shirts

       Kids:
       Boys
       Girls
    ===================================================== */

    const visibleCategories =
        useMemo(() => {

            /* ---------------------------------------------
               If a main category is selected
            --------------------------------------------- */

            if (selectedMainCategory) {

                return categories.filter(
                    (item) =>
                        Number(item.parent_id) ===
                        Number(selectedMainCategory.id)
                );

            }


            /* ---------------------------------------------
               If a subcategory is selected
               
               Example:
               category=women-dresses

               Show Women subcategories.
            --------------------------------------------- */

            const selectedCategory =
                categories.find(
                    (item) =>
                        item.slug === category
                );


            if (
                selectedCategory &&
                selectedCategory.parent_id
            ) {

                return categories.filter(
                    (item) =>
                        Number(item.parent_id) ===
                        Number(
                            selectedCategory.parent_id
                        )
                );

            }


            /* ---------------------------------------------
               No category selected
               
               Show main categories.
            --------------------------------------------- */

            return categories.filter(
                (item) =>
                    item.parent_id === null ||
                    item.parent_id === undefined
            );

        }, [
            categories,
            category,
            selectedMainCategory,
        ]);


    /* =====================================================
       CATEGORY TITLE
    ===================================================== */

    const selectedCategory =
        categories.find(
            (item) =>
                item.slug === category
        );


    /* =====================================================
       CATEGORY CLICK
    ===================================================== */

    const handleCategory = (value) => {

        const params = {};


        if (value) {

            params.category = value;

        }


        if (search) {

            params.search = search;

        }


        setSearchParams(params);

    };


    /* =====================================================
       DISPLAY TITLE
    ===================================================== */

    const pageTitle =
        selectedCategory
            ? selectedCategory.name
            : "All Products";


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="products-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <section className="products-header">

                <span>
                    FASHION COLLECTION
                </span>


                <h1>
                    {pageTitle}
                </h1>


                {search && (

                    <p>
                        Search results for "{search}"
                    </p>

                )}

            </section>


            {/* =================================================
                PRODUCTS LAYOUT
            ================================================= */}

            <div className="products-layout">


                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside className="filter-sidebar">

                    <h3>
                        Shop By Category
                    </h3>


                    {/* ALL PRODUCTS */}

                    <button
                        className={
                            !category
                                ? "selected"
                                : ""
                        }
                        onClick={() =>
                            handleCategory("")
                        }
                    >
                        All Products
                    </button>


                    {/* =================================================
                        CATEGORY LIST
                        
                        When Women selected:
                        Dresses
                        Tops

                        When Men selected:
                        Shirts
                        T-Shirts

                        When Kids selected:
                        Boys
                        Girls
                    ================================================= */}

                    {visibleCategories.map(
                        (item) => (

                            <button
                                key={item.id}
                                className={
                                    category ===
                                    item.slug
                                        ? "selected"
                                        : ""
                                }
                                onClick={() =>
                                    handleCategory(
                                        item.slug
                                    )
                                }
                            >
                                {item.name}
                            </button>

                        )
                    )}

                </aside>


                {/* =================================================
                    PRODUCTS
                ================================================= */}

                <main className="products-content">


                    {/* TOOLBAR */}

                    <div className="products-toolbar">

                        <span>

                            {loading
                                ? "Loading..."
                                : `${products.length} products`
                            }

                        </span>

                    </div>


                    {/* LOADING */}

                    {loading ? (

                        <div className="loading-message">

                            Loading products...

                        </div>

                    ) : products.length === 0 ? (

                        /* =================================================
                           EMPTY
                        ================================================= */

                        <div className="no-products">

                            <div>
                                🛍️
                            </div>

                            <h2>
                                No products found
                            </h2>

                            <p>
                                Try another category
                                or search.
                            </p>

                        </div>

                    ) : (

                        /* =================================================
                           PRODUCT GRID
                        ================================================= */

                        <div className="products-grid">

                            {products.map(
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

                </main>

            </div>

        </div>

    );

};


export default Products;

