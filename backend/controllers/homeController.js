const db = require("../config/db");

// GET HOME PAGE STATISTICS
exports.getHomeStats = async (req, res) => {
    try {
        // Total customers
        const [customerResult] = await db.promise().query(
            `SELECT COUNT(*) AS total
             FROM users
             WHERE role = 'customer'`
        );

        // Total products
        const [productResult] = await db.promise().query(
            `SELECT COUNT(*) AS total
             FROM products`
        );

        // Total orders
        const [orderResult] = await db.promise().query(
            `SELECT COUNT(*) AS total
             FROM orders`
        );

        // Average product/customer rating
        const ratingResult = [
    [{ averageRating: 0 }]
];

        res.status(200).json({
            success: true,
            stats: {
                customers: customerResult[0].total,
                products: productResult[0].total,
                orders: orderResult[0].total,
                rating: Number(
                    ratingResult[0].averageRating
                ).toFixed(1)
            }
        });

    } catch (error) {
        console.error("HOME STATS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load home page statistics"
        });
    }
};