
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import "../css/home.css";

const Hero = ({
    homeStats = {},
    loadingStats = false,
}) => {

    const {
        storeName,
        mainCategories,
    } = useStore();

    const products = homeStats.products ?? 0;
    const customers = homeStats.customers ?? 0;
    const rating = homeStats.rating ?? "0.0";

    /* First category for the "Explore" button */
    const firstCategory =
        mainCategories.length > 0
            ? mainCategories[0]
            : null;

    return (
        <section className="hero-section">

            <div className="hero-content">

                <span className="hero-small-title">
                    ✨ NEW SEASON {new Date().getFullYear()}
                </span>

                <h1>
                    Style that
                    <br />
                    <span>speaks for you.</span>
                </h1>

                <p>
                    Explore the latest fashion trends
                    {mainCategories.length > 0
                        ? ` for ${mainCategories
                              .map((c) => c.name.toLowerCase())
                              .join(", ")}`
                        : ""
                    }.
                    Find pieces that make every day
                    feel special.
                </p>

                <div className="hero-buttons">

                    <Link
                        to="/products"
                        className="primary-button"
                    >
                        Shop Collection
                    </Link>

                    {firstCategory && (

                        <Link
                            to={`/products?category=${firstCategory.id}`}
                            className="secondary-button"
                        >
                            Explore {firstCategory.name}
                        </Link>

                    )}

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
                        <span>{storeName.toUpperCase()}</span>

                        <strong>NEW</strong>

                        <small>
                            COLLECTION
                        </small>
                    </div>

                </div>

                <div className="floating-card">

                    <span>NEW</span>

                    <strong>
                        {new Date().getFullYear()}
                    </strong>

                    <small>
                        Latest styles
                    </small>

                </div>

            </div>

        </section>
    );
};

export default Hero;

