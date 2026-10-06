const db = require("../config/db");

// GET WISHLIST
exports.getWishlist = async (req, res) => {
    try {

        const [items] = await db.promise().query(
            `SELECT
                w.id,
                w.product_id,
                p.name,
                p.slug,
                p.base_price,
                p.sale_price,

                (
                    SELECT pi.image_path
                    FROM product_images pi
                    WHERE pi.product_id = p.id
                    ORDER BY pi.is_primary DESC, pi.sort_order ASC
                    LIMIT 1
                ) AS image

             FROM wishlist w

             INNER JOIN products p
                ON w.product_id = p.id

             WHERE w.user_id = ?

             ORDER BY w.created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            wishlist: items
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to load wishlist"
        });
    }
};

// ADD
exports.addToWishlist = async (req, res) => {
    try {

        const {
            product_id
        } = req.body;

        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        await db.promise().query(
            `INSERT IGNORE INTO wishlist
            (user_id, product_id)
            VALUES (?, ?)`,
            [
                req.user.id,
                product_id
            ]
        );

        res.status(201).json({
            success: true,
            message: "Added to wishlist"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to add to wishlist"
        });
    }
};

// REMOVE
exports.removeFromWishlist = async (req, res) => {
    try {

        await db.promise().query(
            `DELETE FROM wishlist
             WHERE id = ?
             AND user_id = ?`,
            [
                req.params.id,
                req.user.id
            ]
        );

        res.json({
            success: true,
            message: "Removed from wishlist"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to remove from wishlist"
        });
    }
};