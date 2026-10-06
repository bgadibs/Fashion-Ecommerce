
const db = require("../config/db");


// =====================================================
// GET PRODUCTS
// =====================================================

exports.getProducts = async (req, res) => {
    try {

        const {
            category,
            featured,
            search
        } = req.query;


        // =================================================
        // BASE QUERY
        // =================================================

        let sql = `
            SELECT
                p.id,
                p.name,
                p.slug,
                p.description,
                p.category_id,
                p.brand,
                p.sku,
                p.base_price,
                p.sale_price,
                p.featured,
                p.status,

                c.name AS category_name,
                c.slug AS category_slug,

                (
                    SELECT pi.image_path
                    FROM product_images pi
                    WHERE pi.product_id = p.id
                    ORDER BY
                        pi.is_primary DESC,
                        pi.sort_order ASC
                    LIMIT 1
                ) AS image

            FROM products p

            LEFT JOIN categories c
                ON p.category_id = c.id

            WHERE p.status = 'active'
        `;


        const params = [];


        // =================================================
        // CATEGORY FILTER
        // =================================================
        // Frontend sends:
        // /products?category=dresses
        //
        // We filter using categories.slug
        // instead of products.category_id
        // =================================================

        if (category) {

            sql += `
                AND c.slug = ?
            `;

            params.push(category);

        }


        // =================================================
        // FEATURED FILTER
        // =================================================

        if (featured === "true") {

            sql += `
                AND p.featured = 1
            `;

        }


        // =================================================
        // SEARCH FILTER
        // =================================================

        if (search) {

            sql += `
                AND (
                    p.name LIKE ?
                    OR p.brand LIKE ?
                    OR p.description LIKE ?
                )
            `;

            const searchValue = `%${search}%`;

            params.push(
                searchValue,
                searchValue,
                searchValue
            );

        }


        // =================================================
        // ORDER PRODUCTS
        // =================================================

        sql += `
            ORDER BY p.created_at DESC
        `;


        // =================================================
        // RUN QUERY
        // =================================================

        const [products] =
            await db.promise().query(
                sql,
                params
            );


        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({
            success: true,
            products
        });


    } catch (error) {

        console.error(
            "GET PRODUCTS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load products"
        });

    }
};



// =====================================================
// GET SINGLE PRODUCT
// =====================================================

exports.getProduct = async (req, res) => {

    try {

        const { id } = req.params;


        // =================================================
        // GET PRODUCT
        // =================================================

        const [products] =
            await db.promise().query(
                `
                SELECT
                    p.*,
                    c.name AS category_name,
                    c.slug AS category_slug

                FROM products p

                LEFT JOIN categories c
                    ON p.category_id = c.id

                WHERE p.id = ?
                `,
                [id]
            );


        // =================================================
        // PRODUCT NOT FOUND
        // =================================================

        if (products.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        }


        const product = products[0];


        // =================================================
        // GET PRODUCT IMAGES
        // =================================================

        const [images] =
            await db.promise().query(
                `
                SELECT
                    id,
                    product_id,
                    image_path,
                    is_primary,
                    sort_order

                FROM product_images

                WHERE product_id = ?

                ORDER BY
                    is_primary DESC,
                    sort_order ASC
                `,
                [product.id]
            );


        // =================================================
        // GET PRODUCT VARIANTS
        // =================================================

        const [variants] =
            await db.promise().query(
                `
                SELECT
                    id,
                    product_id,
                    size,
                    color,
                    sku,
                    price_override,
                    stock_quantity,
                    created_at

                FROM product_variants

                WHERE product_id = ?

                ORDER BY id ASC
                `,
                [product.id]
            );


        // =================================================
        // ATTACH IMAGES AND VARIANTS
        // =================================================

        product.images = images;

        product.variants = variants;


        // =================================================
        // RESPONSE
        // =================================================

        res.status(200).json({
            success: true,
            product
        });


    } catch (error) {

        console.error(
            "GET PRODUCT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load product"
        });

    }
};

