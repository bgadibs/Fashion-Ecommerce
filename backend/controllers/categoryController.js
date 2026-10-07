
const db = require("../config/db");

// =====================================================
// GET ALL ACTIVE CATEGORIES
// =====================================================

exports.getCategories = async (req, res) => {
    try {

        const [categories] = await db.promise().query(
            `
            SELECT
                id,
                name,
                slug,
                parent_id,
                image,
                sort_order,
                status
            FROM categories
            WHERE status = 'active'
            ORDER BY
                CASE
                    WHEN parent_id IS NULL THEN 0
                    ELSE 1
                END,
                parent_id ASC,
                sort_order ASC,
                id ASC
            `
        );

        res.json({
            success: true,
            categories
        });

    } catch (error) {

        console.error(
            "GET CATEGORIES ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load categories"
        });
    }
};


// =====================================================
// GET CATEGORY BY ID
// =====================================================

exports.getCategory = async (req, res) => {

    try {

        const [categories] = await db.promise().query(
            `
            SELECT
                id,
                name,
                slug,
                parent_id,
                image,
                sort_order,
                status
            FROM categories
            WHERE id = ?
            `,
            [req.params.id]
        );


        if (categories.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Category not found"
            });

        }


        res.json({
            success: true,
            category: categories[0]
        });


    } catch (error) {

        console.error(
            "GET CATEGORY ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load category"
        });

    }

};

