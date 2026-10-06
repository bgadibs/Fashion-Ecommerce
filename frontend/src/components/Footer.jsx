import { Link } from "react-router-dom";
import {
    FiInstagram,
    FiFacebook,
    FiTwitter,
    FiMail,
    FiPhone,
} from "react-icons/fi";

import "../css/footer.css";

const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-main">

                <div className="footer-brand">

                    <Link to="/" className="footer-logo">
                        Bgadi<span>Fashion</span>
                    </Link>

                    <p>
                        Discover beautiful fashion for women, men and kids.
                        Find your style and wear it with confidence.
                    </p>

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

                <div className="footer-column">
                    <h3>Shop</h3>

                    <Link to="/products?category=women">
                        Women
                    </Link>

                    <Link to="/products?category=men">
                        Men
                    </Link>

                    <Link to="/products?category=kids">
                        Kids
                    </Link>

                    <Link to="/products">
                        New Arrivals
                    </Link>
                </div>

                <div className="footer-column">
                    <h3>Customer Care</h3>

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

                <div className="footer-column contact-column">

                    <h3>Get In Touch</h3>

                    <p>
                        <FiMail />
                        support@fashionhub.com
                    </p>

                    <p>
                        <FiPhone />
                        +91 
                    </p>

                    <p>
                        📍 Hyderabad, India
                    </p>

                </div>

            </div>

            <div className="footer-bottom">

                <p>
                    © 2026 BgadiFashion. All rights reserved.
                </p>

                <div>
                    <span>Privacy Policy</span>
                    <span>Terms & Conditions</span>
                </div>

            </div>

        </footer>
    );
};

export default Footer;