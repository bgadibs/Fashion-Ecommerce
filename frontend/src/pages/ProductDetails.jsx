
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiHeart, FiShoppingBag } from "react-icons/fi";

import {
    getProductById,
    addToCart,
    addToWishlist,
} from "../services/api";

import "../css/products.css";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedVariant, setSelectedVariant] =
        useState(null);

    const [cartLoading, setCartLoading] =
        useState(false);

    const [wishlistLoading, setWishlistLoading] =
        useState(false);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response =
                    await getProductById(id);

                setProduct(
                    response.data.product
                );

            } catch (error) {
                console.error(
                    "Failed to load product:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    /* =========================
       LOADING
    ========================= */

    if (loading) {
        return (
            <div className="detail-loading">
                Loading product...
            </div>
        );
    }

    /* =========================
       PRODUCT NOT FOUND
    ========================= */

    if (!product) {
        return (
            <div className="no-products">
                <h2>Product not found</h2>

                <Link to="/products">
                    Back to products
                </Link>
            </div>
        );
    }

    /* =========================
       PRODUCT DATA
    ========================= */

    const variants = Array.isArray(product.variants)
        ? product.variants
        : [];

    const images = Array.isArray(product.images)
        ? product.images
        : [];

    const price =
        selectedVariant?.price_override !== null &&
        selectedVariant?.price_override !== undefined
            ? selectedVariant.price_override
            : product.sale_price !== null &&
              product.sale_price !== undefined &&
              Number(product.sale_price) > 0
            ? product.sale_price
            : product.base_price;

    const primaryImage =
        images.find(
            (image) =>
                Number(image.is_primary) === 1
        )?.image_path ||
        images[0]?.image_path ||
        null;

    /* =========================
       ADD TO BAG
    ========================= */

    const handleAddToBag = async () => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        /*
         * If the product has variants,
         * customer MUST select one.
         */

        if (
            variants.length > 0 &&
            !selectedVariant
        ) {
            alert(
                "Please select a size or color before adding the product to bag."
            );

            return;
        }

        try {
            setCartLoading(true);

            const cartData = {
                product_id: product.id,
                quantity: 1,
            };

            if (selectedVariant) {
                cartData.product_variant_id =
                    selectedVariant.id;
            }

            await addToCart(cartData);

            alert(
                "Product added to bag 🛍️"
            );

            window.dispatchEvent(
                new Event("cartUpdated")
            );

        } catch (error) {
            console.error(
                "Add to bag error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to add product to bag"
            );

        } finally {
            setCartLoading(false);
        }
    };

    /* =========================
       ADD TO WISHLIST
    ========================= */

    const handleWishlist = async () => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setWishlistLoading(true);

            await addToWishlist({
                product_id: product.id,
            });

            alert(
                "Product added to wishlist ❤️"
            );

        } catch (error) {
            console.error(
                "Wishlist error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to add product to wishlist"
            );

        } finally {
            setWishlistLoading(false);
        }
    };

    return (
        <div className="product-details-page">

            {/* =========================
                BREADCRUMB
            ========================= */}

            <div className="breadcrumb">

                <Link to="/">
                    Home
                </Link>

                <span>/</span>

                <Link to="/products">
                    Products
                </Link>

                <span>/</span>

                <strong>
                    {product.name}
                </strong>

            </div>


            {/* =========================
                PRODUCT DETAILS
            ========================= */}

            <div className="product-details-layout">

                {/* =========================
                    IMAGE
                ========================= */}

                <div className="detail-image-section">

                    {primaryImage ? (

                        <img
                            src={primaryImage}
                            alt={product.name}
                        />

                    ) : (

                        <div className="detail-placeholder">
                            FASHION
                        </div>

                    )}

                </div>


                {/* =========================
                    INFORMATION
                ========================= */}

                <div className="detail-info">

                    {product.brand && (
                        <span className="detail-brand">
                            {product.brand}
                        </span>
                    )}


                    <h1>
                        {product.name}
                    </h1>


                    {/* RATING */}

                    <div className="detail-rating">

                        <span>
                            ★★★★★
                        </span>

                        <span>
                            4.8 | 120 Reviews
                        </span>

                    </div>


                    {/* PRICE */}

                    <div className="detail-price">

                        ₹
                        {Number(price).toLocaleString(
                            "en-IN"
                        )}

                        {product.sale_price !== null &&
                            product.sale_price !== undefined &&
                            Number(product.sale_price) > 0 &&
                            Number(product.sale_price) <
                                Number(product.base_price) && (

                            <del>
                                ₹
                                {Number(
                                    product.base_price
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </del>

                        )}

                    </div>


                    {/* DESCRIPTION */}

                    {product.description && (
                        <p className="detail-description">
                            {product.description}
                        </p>
                    )}


                    {/* =========================
                        VARIANTS
                    ========================= */}

                    {variants.length > 0 && (

                        <div className="variant-section">

                            <h3>
                                Select Size / Color
                            </h3>

                            <div className="variant-list">

                                {variants.map(
                                    (variant) => {

                                        const isSelected =
                                            selectedVariant?.id ===
                                            variant.id;

                                        const isOutOfStock =
                                            Number(
                                                variant.stock_quantity || 0
                                            ) <= 0;

                                        return (
                                            <button
                                                type="button"
                                                key={variant.id}
                                                disabled={
                                                    isOutOfStock
                                                }
                                                className={
                                                    isSelected
                                                        ? "variant selected"
                                                        : "variant"
                                                }
                                                onClick={() =>
                                                    setSelectedVariant(
                                                        isSelected
                                                            ? null
                                                            : variant
                                                    )
                                                }
                                            >

                                                {variant.size ||
                                                    "One Size"}

                                                {variant.color &&
                                                    ` • ${variant.color}`}

                                            </button>
                                        );
                                    }
                                )}

                            </div>


                            {/* SELECTION MESSAGE */}

                            {!selectedVariant && (
                                <p className="selected-variant-info">
                                    Please select a size or color.
                                </p>
                            )}


                            {/* SELECTED VARIANT */}

                            {selectedVariant && (

                                <p className="selected-variant-info">

                                    Selected:
                                    {" "}

                                    {selectedVariant.size ||
                                        "One Size"}

                                    {selectedVariant.color &&
                                        ` • ${selectedVariant.color}`}

                                    {" | "}

                                    Stock:
                                    {" "}

                                    {Number(
                                        selectedVariant.stock_quantity || 0
                                    )}

                                </p>

                            )}

                        </div>

                    )}


                    {/* =========================
                        ACTION BUTTONS
                    ========================= */}

                    <div className="detail-actions">

                        <button
                            type="button"
                            className="add-cart-button"
                            onClick={handleAddToBag}
                            disabled={
                                cartLoading ||
                                (
                                    variants.length > 0 &&
                                    !selectedVariant
                                )
                            }
                        >

                            <FiShoppingBag />

                            {cartLoading
                                ? "Adding..."
                                : "Add to Bag"}

                        </button>


                        <button
                            type="button"
                            className="add-wishlist-button"
                            onClick={handleWishlist}
                            disabled={wishlistLoading}
                            title="Add to Wishlist"
                        >

                            <FiHeart />

                        </button>

                    </div>


                    {/* =========================
                        BENEFITS
                    ========================= */}

                    <div className="detail-benefits">

                        <div>
                            🚚

                            <span>
                                Free shipping above ₹999
                            </span>
                        </div>

                        <div>
                            ↩️

                            <span>
                                Easy returns
                            </span>
                        </div>

                        <div>
                            🔒

                            <span>
                                Secure checkout
                            </span>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProductDetails;

