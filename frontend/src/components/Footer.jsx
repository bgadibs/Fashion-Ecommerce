
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
    FiInstagram,
    FiFacebook,
    FiTwitter,
    FiMail,
    FiPhone,
} from "react-icons/fi";

import { useStore } from "../context/StoreContext";

import {
    getCategories,
} from "../services/api";

import "../css/footer.css";


const Footer = () => {

    const {
        settings,
        storeName,
        storeNameParts,
    } = useStore();


    /* =====================================================
       STATES
    ===================================================== */

    const [categories, setCategories] =
        useState([]);


    /* =====================================================
       LOAD CATEGORIES
    ===================================================== */

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const response =
                    await getCategories();


                console.log(
                    "FOOTER CATEGORY API RESPONSE:",
                    response.data
                );


                /*
                    Supports different API response formats:

                    {
                        categories: [...]
                    }

                    OR

                    {
                        data: [...]
                    }

                    OR

                    [...]
                */

                const data =
                    response.data?.categories ||
                    response.data?.data ||
                    response.data ||
                    [];


                const categoryList =
                    Array.isArray(data)
                        ? data
                        : [];


                console.log(
                    "FOOTER CATEGORIES:",
                    categoryList
                );


                setCategories(
                    categoryList
                );


            } catch (error) {

                console.error(
                    "Failed to load footer categories:",
                    error
                );

                setCategories([]);

            }

        };


        loadCategories();

    }, []);


    /* =====================================================
       MAIN CATEGORIES ONLY

       Example:

       Women
       Men
       Kids

       Subcategories such as:

       Dresses
       Tops
       Shirts
       Boys
       Girls

       will NOT appear.
    ===================================================== */

    const mainCategories =
        categories.filter((category) => {

            const parentId =
                category.parent_id;


            return (
                parentId === null ||
                parentId === undefined ||
                parentId === 0 ||
                parentId === "0" ||
                parentId === ""
            );

        });


    /* =====================================================
       FALLBACK CATEGORIES

       Used only if the API does not return
       the main categories.

       The actual categories should come
       from the database.
    ===================================================== */

    const displayCategories =
        mainCategories.length > 0
            ? mainCategories
            : [
                {
                    id: "women",
                    name: "Women",
                    slug: "women",
                },
                {
                    id: "men",
                    name: "Men",
                    slug: "men",
                },
                {
                    id: "kids",
                    name: "Kids",
                    slug: "kids",
                },
            ];


    /* =====================================================
       STORE SETTINGS SAFETY
    ===================================================== */

    const safeSettings =
        settings || {};


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <footer className="footer">


            {/* =================================================
                FOOTER MAIN
            ================================================= */}

            <div className="footer-main">


                {/* =================================================
                    BRAND
                ================================================= */}

                <div className="footer-brand">

                    <Link
                        to="/"
                        className="footer-logo"
                    >

                        {storeNameParts?.first || "Fashion"}

                        {storeNameParts?.second && (

                            <span>
                                {storeNameParts.second}
                            </span>

                        )}

                    </Link>


                    <p>

                        Discover beautiful fashion{" "}

                        {displayCategories.length > 0
                            ? `for ${displayCategories
                                .map((c) =>
                                    c.name.toLowerCase()
                                )
                                .join(", ")}`
                            : ""
                        }.

                        Find your style and wear it
                        with confidence.

                    </p>


                    {/* =================================================
                        SOCIAL ICONS
                    ================================================= */}

                    <div className="social-icons">

                        <a
                            href="#instagram"
                            aria-label="Instagram"
                        >
                            <FiInstagram />
                        </a>


                        <a
                            href="#facebook"
                            aria-label="Facebook"
                        >
                            <FiFacebook />
                        </a>


                        <a
                            href="#twitter"
                            aria-label="Twitter"
                        >
                            <FiTwitter />
                        </a>

                    </div>

                </div>


                {/* =================================================
                    SHOP
                ================================================= */}

                <div className="footer-column">

                    <h3>
                        Shop
                    </h3>


                    {displayCategories.map((cat) => (

                        <Link
                            key={cat.id}
                            to={`/products?category=${encodeURIComponent(
                                cat.slug || cat.name
                            )}`}
                        >

                            {cat.name}

                        </Link>

                    ))}


                    {/* NEW ARRIVALS */}

                    <Link
                        to="/products?featured=true"
                    >
                        New Arrivals
                    </Link>

                </div>


                {/* =================================================
                    CUSTOMER CARE
                ================================================= */}

                <div className="footer-column">

                    <h3>
                        Customer Care
                    </h3>


                    <Link to="/orders">
                        Track Order
                    </Link>


                    <Link to="/contact">
                        Contact Us
                    </Link>


                    <Link to="/faq">
                        FAQ
                    </Link>


                    <Link to="/shipping">
                        Shipping
                    </Link>

                </div>


                {/* =================================================
                    GET IN TOUCH
                ================================================= */}

                <div className="footer-column contact-column">

                    <h3>
                        Get In Touch
                    </h3>


                    {/* EMAIL */}

                    {safeSettings.store_email && (

                        <p>

                            <FiMail />

                            <span>
                                {safeSettings.store_email}
                            </span>

                        </p>

                    )}


                    {/* PHONE */}

                    {safeSettings.store_phone && (

                        <p>

                            <FiPhone />

                            <span>
                                {safeSettings.store_phone}
                            </span>

                        </p>

                    )}


                    {/* ADDRESS */}

                    {safeSettings.store_address && (

                        <p>

                            <span>
                                📍
                            </span>

                            <span>
                                {safeSettings.store_address}
                            </span>

                        </p>

                    )}

                </div>

            </div>


            {/* =================================================
                FOOTER BOTTOM
            ================================================= */}

            <div className="footer-bottom">

                <p>

                    © {new Date().getFullYear()}{" "}

                    {storeName || "Fashion Store"}.

                    All rights reserved.

                </p>


                <div>

                    <Link to="/privacy">
                        Privacy Policy
                    </Link>


                    <Link to="/terms">
                        Terms & Conditions
                    </Link>

                </div>

            </div>

        </footer>

    );

};


export default Footer;
