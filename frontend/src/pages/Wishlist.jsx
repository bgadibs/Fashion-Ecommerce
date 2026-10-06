
import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    FiHeart,
    FiShoppingBag,
    FiTrash2,
} from "react-icons/fi";

import {
    getWishlist,
    removeFromWishlist,
} from "../services/api";

import "../css/wishlist.css";


const Wishlist = () => {

    const navigate = useNavigate();


    /* =====================================================
       STATES
    ===================================================== */

    const [wishlist, setWishlist] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    /* =====================================================
       LOAD WISHLIST
    ===================================================== */

    const loadWishlist = async () => {

        try {

            setLoading(true);

            const response =
                await getWishlist();

            if (response.data?.success) {

                setWishlist(
                    response.data.wishlist ||
                    response.data.items ||
                    []
                );

            } else {

                setWishlist([]);

            }

        } catch (error) {

            console.error(
                "Failed to load wishlist:",
                error
            );

            if (
                error.response?.status === 401
            ) {

                navigate("/login");

            }

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            navigate("/login");

            return;

        }

        loadWishlist();

    }, []);


    /* =====================================================
       REMOVE FROM WISHLIST
    ===================================================== */

    const handleRemove = async (id) => {

        try {

            await removeFromWishlist(id);


            setWishlist((current) =>
                current.filter(
                    (item) =>
                        item.id !== id
                )
            );


            /* Update Navbar wishlist count */

            window.dispatchEvent(
                new Event("wishlistUpdated")
            );


        } catch (error) {

            console.error(
                "Remove wishlist error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to remove item"
            );

        }
    };


    /* =====================================================
       ADD TO BAG
       ===================================================== */

    const handleAddToBag = (productId) => {

        /*
         * Cart requires product_variant_id.
         *
         * Therefore send the customer to
         * Product Details where they can select
         * size/color before adding to cart.
         */

        navigate(
            `/products/${productId}`
        );

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="wishlist-page">

                <div className="wishlist-loading">

                    Loading wishlist...

                </div>

            </div>

        );

    }


    /* =====================================================
       PAGE
    ===================================================== */

    return (

        <div className="wishlist-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="wishlist-header">

                <span className="wishlist-label">
                    YOUR COLLECTION
                </span>

                <h1>
                    My Wishlist
                </h1>

                <p>
                    Save your favorite styles
                    and shop them whenever you like.
                </p>

            </div>


            {/* =================================================
                EMPTY WISHLIST
            ================================================= */}

            {wishlist.length === 0 ? (

                <div className="wishlist-empty">

                    <div className="wishlist-empty-icon">

                        <FiHeart />

                    </div>


                    <h2>
                        Your wishlist is empty
                    </h2>


                    <p>
                        Save products you love
                        by clicking the heart icon.
                    </p>


                    <Link
                        to="/products"
                        className="wishlist-shop-button"
                    >
                        Explore Products
                    </Link>

                </div>

            ) : (


                /* =================================================
                   WISHLIST PRODUCTS
                ================================================= */

                <div className="wishlist-grid">

                    {wishlist.map((item) => {


                        const product =
                            item.product ||
                            item;


                        const productId =
                            product.product_id ||
                            product.id;


                        const price =
                            product.sale_price ||
                            product.base_price ||
                            0;


                        const image =
                            product.image ||
                            product.image_url;


                        return (

                            <div
                                className="wishlist-card"
                                key={
                                    item.id ||
                                    productId
                                }
                            >


                                {/* =================================================
                                    IMAGE
                                ================================================= */}

                                <div className="wishlist-image">

                                    <Link
                                        to={`/products/${productId}`}
                                    >

                                        {image ? (

                                            <img
                                                src={image}
                                                alt={
                                                    product.name
                                                }
                                            />

                                        ) : (

                                            <div className="wishlist-placeholder">
                                                FASHION
                                            </div>

                                        )}

                                    </Link>

                                </div>


                                {/* =================================================
                                    PRODUCT INFO
                                ================================================= */}

                                <div className="wishlist-info">


                                    <span>
                                        {product.brand ||
                                            "FashionHub"}
                                    </span>


                                    <Link
                                        to={`/products/${productId}`}
                                        className="wishlist-product-name"
                                    >
                                        {product.name}
                                    </Link>


                                    <strong>
                                        ₹
                                        {Number(
                                            price
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>


                                    {/* =================================================
                                        ACTIONS
                                    ================================================= */}

                                    <div className="wishlist-actions">


                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAddToBag(
                                                    productId
                                                )
                                            }
                                        >

                                            <FiShoppingBag />

                                            Add to Bag

                                        </button>


                                        <button
                                            type="button"
                                            className="wishlist-remove"
                                            onClick={() =>
                                                handleRemove(
                                                    item.id
                                                )
                                            }
                                        >

                                            <FiTrash2 />

                                            Remove

                                        </button>


                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );

};


export default Wishlist;

