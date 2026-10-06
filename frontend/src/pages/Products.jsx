import { useEffect, useState } from "react";
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

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);

    const search =
        searchParams.get("search") || "";

    const category =
        searchParams.get("category") || "";

    const loadProducts = async () => {

        setLoading(true);

        try {

            const response = await getProducts({
                search: search || undefined,
                category: category || undefined,
            });

            setProducts(
                response.data.products || []
            );

        } catch (error) {

            console.error(
                "Failed to load products",
                error
            );

            setProducts([]);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadProducts();

    }, [search, category]);

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const response =
                    await getCategories();

                setCategories(
                    response.data.categories || []
                );

            } catch (error) {

                console.error(error);

            }
        };

        loadCategories();

    }, []);

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

    return (
        <div className="products-page">

            <section className="products-header">

                <span>
                    FASHION COLLECTION
                </span>

                <h1>
                    {category
                        ? category.replace("-", " ")
                        : "All Products"}
                </h1>

                {search && (
                    <p>
                        Search results for "{search}"
                    </p>
                )}

            </section>

            <div className="products-layout">

                <aside className="filter-sidebar">

                    <h3>
                        Shop By Category
                    </h3>

                    <button
                        className={!category ? "selected" : ""}
                        onClick={() =>
                            handleCategory("")
                        }
                    >
                        All Products
                    </button>

                    {categories.map((item) => (

                        <button
                            key={item.id}
                            className={
                                category === item.slug
                                    ? "selected"
                                    : ""
                            }
                            onClick={() =>
                                handleCategory(item.slug)
                            }
                        >
                            {item.name}
                        </button>

                    ))}

                </aside>

                <main className="products-content">

                    <div className="products-toolbar">

                        <span>
                            {products.length} products
                        </span>

                    </div>

                    {loading ? (

                        <div className="loading-message">
                            Loading products...
                        </div>

                    ) : products.length === 0 ? (

                        <div className="no-products">

                            <div>🛍️</div>

                            <h2>
                                No products found
                            </h2>

                            <p>
                                Try another category or search.
                            </p>

                        </div>

                    ) : (

                        <div className="products-grid">

                            {products.map((product) => (

                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />

                            ))}

                        </div>

                    )}

                </main>

            </div>

        </div>
    );
};

export default Products;