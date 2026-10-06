
import { Link } from "react-router-dom";
import "../css/home.css";

const Hero = ({
    homeStats = {},
    loadingStats = false,
}) => {
    const products = homeStats.products ?? 0;
    const customers = homeStats.customers ?? 0;
    const rating = homeStats.rating ?? "0.0";

    return (
        <section className="hero-section">

            <div className="hero-content">

                <span className="hero-small-title">
                    ✨ NEW SEASON 2026
                </span>

                <h1>
                    Style that
                    <br />
                    <span>speaks for you.</span>
                </h1>

                <p>
                    Explore the latest fashion trends for women,
                    men and kids. Find pieces that make every day
                    feel special.
                </p>

                <div className="hero-buttons">

                    <Link
                        to="/products"
                        className="primary-button"
                    >
                        Shop Collection
                    </Link>

                    <Link
                        to="/products?category=women"
                        className="secondary-button"
                    >
                        Explore Women
                    </Link>

                </div>

                <div className="hero-features">

                    {/* PRODUCTS */}
                    <div>
                        <strong>
                            {loadingStats
                                ? "..."
                                : `${products}+`}
                        </strong>

                        <span>
                            Styles
                        </span>
                    </div>

                    {/* CUSTOMERS */}
                    <div>
                        <strong>
                            {loadingStats
                                ? "..."
                                : `${customers}+`}
                        </strong>

                        <span>
                            Happy Customers
                        </span>
                    </div>

                    {/* RATING */}
                    <div>
                        <strong>
                            {loadingStats
                                ? "..."
                                : `${rating}★`}
                        </strong>

                        <span>
                            Customer Rating
                        </span>
                    </div>

                </div>

            </div>

            <div className="hero-image-wrapper">

                <div className="hero-circle"></div>

                <div className="hero-fashion-card">

                    <div className="fashion-placeholder">
                        <span>FASHION</span>

                        <strong>NEW</strong>

                        <small>
                            COLLECTION
                        </small>
                    </div>

                </div>

                <div className="floating-card">

                    <span>NEW</span>

                    <strong>
                        20% OFF
                    </strong>

                    <small>
                        Selected styles
                    </small>

                </div>

            </div>

        </section>
    );
};

export default Hero;

