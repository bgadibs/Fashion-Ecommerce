import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
    return (
        <Link
            to={`/products?category=${category.id}`}
            className="category-card"
        >
            <img
                src={
                    category.image ||
                    category.image_url ||
                    "/category-placeholder.jpg"
                }
                alt={category.name}
            />

            <div className="category-card-icon">
                ✦
            </div>

            <div className="category-card-content">
                <h3>{category.name}</h3>

                {category.description && (
                    <p>{category.description}</p>
                )}

                <span className="category-card-link">
                    Let's Explore
                    <span>→</span>
                </span>
            </div>
        </Link>
    );
};

export default CategoryCard;

