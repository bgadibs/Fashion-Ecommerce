
import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    FiHeart,
    FiShoppingBag,
} from "react-icons/fi";

import {
    useState,
} from "react";

import {
    addToWishlist,
} from "../services/api";

import "../css/products.css";


const ProductCard = ({
    product,
}) => {

    const navigate =
        useNavigate();


    /* =====================================================
       STATES
    ===================================================== */

    const [wishlistLoading, setWishlistLoading] =
        useState(false);


    /* =====================================================
       PRICE
    ===================================================== */

    const price =
        product.sale_price ||
        product.base_price ||
        0;


    const originalPrice =
        product.sale_price
            ? product.base_price
            : null;


    /* =====================================================
       DISCOUNT
    ===================================================== */

    const discount =
        originalPrice &&
        originalPrice > price
            ? Math.round(
                (
                    (originalPrice - price) /
                    originalPrice
                ) * 100
            )
            : 0;


    /* =====================================================
       ADD TO WISHLIST
    ===================================================== */

    const handleWishlist = async (e) => {

        e.preventDefault();
        e.stopPropagation();


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


            /*
             * Tell Navbar that wishlist
             * has changed.
             */

            window.dispatchEvent(
                new Event("wishlistUpdated")
            );


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


    /* =====================================================
       QUICK ADD
    ===================================================== */

    const handleQuickAdd = (e) => {

        e.preventDefault();
        e.stopPropagation();


        navigate(
            `/products/${product.id}`
        );

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="product-card">


            {/* =================================================
                PRODUCT IMAGE
            ================================================= */}

            <div className="product-image-wrapper">


                {/* DISCOUNT */}

                {discount > 0 && (

                    <span className="discount-badge">

                        {discount}% OFF

                    </span>

                )}


                {/* =================================================
                    WISHLIST BUTTON
                ================================================= */}

                <button
                    type="button"
                    className="wishlist-button"
                    onClick={handleWishlist}
                    disabled={wishlistLoading}
                    title="Add to Wishlist"
                >

                    <FiHeart />

                </button>


                {/* =================================================
                    PRODUCT IMAGE / LINK
                ================================================= */}

                <Link
                    to={`/products/${product.id}`}
                >

                    {product.image ? (

                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                        />

                    ) : (

                        <div className="product-placeholder">

                            <span>
                                FASHION
                            </span>

                        </div>

                    )}

                </Link>


                {/* =================================================
                    QUICK ADD
                ================================================= */}

                <button
                    type="button"
                    className="quick-add"
                    onClick={handleQuickAdd}
                >

                    <FiShoppingBag />

                    Select Size

                </button>


            </div>


            {/* =================================================
                PRODUCT INFO
            ================================================= */}

            <div className="product-info">


                {/* BRAND */}

                <span className="product-brand">

                    {product.brand ||
                        "FashionHub"}

                </span>


                {/* PRODUCT NAME */}

                <Link
                    to={`/products/${product.id}`}
                    className="product-name"
                >

                    {product.name}

                </Link>


                {/* PRICE */}

                <div className="product-price">

                    <strong>

                        ₹
                        {Number(
                            price
                        ).toLocaleString(
                            "en-IN"
                        )}

                    </strong>


                    {originalPrice && (

                        <del>

                            ₹
                            {Number(
                                originalPrice
                            ).toLocaleString(
                                "en-IN"
                            )}

                        </del>

                    )}

                </div>


                {/* RATING */}

                <div className="product-rating">

                    <span>
                        ★★★★★
                    </span>

                    <small>
                        {" "}4.8
                    </small>

                </div>


            </div>

        </div>

    );

};


export default ProductCard;

