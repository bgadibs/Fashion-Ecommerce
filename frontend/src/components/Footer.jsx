
import { Link } from "react-router-dom";

import {
    FiInstagram,
    FiFacebook,
    FiTwitter,
    FiMail,
    FiPhone,
} from "react-icons/fi";

import { useStore } from "../context/StoreContext";

import "../css/footer.css";


const Footer = () => {

    const {
        settings,
        storeName,
        storeNameParts,
        mainCategories,
    } = useStore();


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

                        {storeNameParts.first}

                        {storeNameParts.second && (

                            <span>
                                {storeNameParts.second}
                            </span>

                        )}

                    </Link>


                    <p>

                        Discover beautiful fashion

                        {mainCategories.length > 0
                            ? ` for ${mainCategories
                                .map((c) =>
                                    c.name.toLowerCase()
                                )
                                .join(", ")}`
                            : ""
                        }.

                        Find your style and wear it
                        with confidence.

                    </p>


                    {/* SOCIAL ICONS */}

                    <div className="social-icons">

                        <a href="#instagram">
                            <FiInstagram />
                        </a>

                        <a href="#facebook">
                            <FiFacebook />
                        </a>

                        <a href="#twitter">
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


                    {mainCategories.map((cat) => (

                        <Link
                            key={cat.id}
                            to={`/products?category=${encodeURIComponent(
                                cat.slug
                            )}`}
                        >
                            {cat.name}
                        </Link>

                    ))}


                    <Link to="/products?featured=true">
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


                    {settings.store_email && (

                        <p>

                            <FiMail />

                            {settings.store_email}

                        </p>

                    )}


                    {settings.store_phone && (

                        <p>

                            <FiPhone />

                            {settings.store_phone}

                        </p>

                    )}


                    {settings.store_address && (

                        <p>

                            📍 {settings.store_address}

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

                    {storeName}.

                    All rights reserved.

                </p>


                <div>

                    <span>
                        Privacy Policy
                    </span>

                    <span>
                        Terms & Conditions
                    </span>

                </div>

            </div>

        </footer>

    );

};


export default Footer;

