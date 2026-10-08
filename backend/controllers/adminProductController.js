
const db = require("../config/db");


// =====================================================
// GET ALL ADMIN PRODUCTS
// =====================================================

exports.getProducts = async (req, res) => {

    try {

        const [products] = await db.promise().query(`

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
                p.created_at,

                c.name AS category_name,

                (
                    SELECT image_path
                    FROM product_images
                    WHERE product_id = p.id
                    AND is_primary = 1
                    LIMIT 1
                ) AS image

            FROM products p

            LEFT JOIN categories c
                ON p.category_id = c.id

            ORDER BY p.created_at DESC

        `);

        res.json({
            success: true,
            products
        });

    } catch (error) {

        console.error(
            "ADMIN GET PRODUCTS ERROR:",
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


        // -------------------------------------------------
        // GET PRODUCT
        // -------------------------------------------------

        const [products] =
            await db.promise().query(`

                SELECT

                    p.*,

                    c.name AS category_name

                FROM products p

                LEFT JOIN categories c
                    ON p.category_id = c.id

                WHERE p.id = ?

            `, [id]);


        if (products.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        // -------------------------------------------------
        // GET VARIANTS
        // -------------------------------------------------

        const [variants] =
            await db.promise().query(`

                SELECT

                    id,
                    product_id,
                    size,
                    color,
                    sku,
                    price_override,
                    stock_quantity

                FROM product_variants

                WHERE product_id = ?

                ORDER BY id ASC

            `, [id]);


        // -------------------------------------------------
        // GET IMAGES
        // -------------------------------------------------

        const [images] =
            await db.promise().query(`

                SELECT

                    id,
                    product_id,
                    image_path,
                    is_primary,
                    sort_order

                FROM product_images

                WHERE product_id = ?

                ORDER BY sort_order ASC, id ASC

            `, [id]);


        res.json({

            success: true,

            product: products[0],

            variants,

            images

        });


    } catch (error) {

        console.error(
            "ADMIN GET PRODUCT ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to load product"

        });
    }
};


// =====================================================
// CREATE PRODUCT
// Supports:
// 1. Image URL
// 2. Local image upload
// =====================================================

exports.createProduct = async (req, res) => {

    const connection =
        await db.promise().getConnection();

    try {

        const {

            name,

            description,

            category_id,

            brand,

            sku,

            base_price,

            sale_price,

            featured,

            status,

            variants,

            image

        } = req.body;


        // -------------------------------------------------
        // BASIC VALIDATION
        // -------------------------------------------------

        if (
            !name ||
            !String(name).trim() ||
            category_id === undefined ||
            category_id === null ||
            category_id === "" ||
            base_price === undefined ||
            base_price === null ||
            base_price === ""
        ) {

            connection.release();

            return res.status(400).json({

                success: false,

                message:
                    "Product name, category and base price are required"

            });
        }


        // -------------------------------------------------
        // SAFE CATEGORY ID
        // -------------------------------------------------

        const categoryId =
            Number(category_id);


        if (
            !Number.isInteger(categoryId) ||
            categoryId <= 0
        ) {

            connection.release();

            return res.status(400).json({

                success: false,

                message:
                    "Category must be a valid category"

            });
        }


        // -------------------------------------------------
        // SAFE BASE PRICE
        // -------------------------------------------------

        const basePrice =
            Number(base_price);


        if (
            !Number.isFinite(basePrice) ||
            basePrice < 0
        ) {

            connection.release();

            return res.status(400).json({

                success: false,

                message:
                    "Base price must be a valid number"

            });
        }


        // -------------------------------------------------
        // SAFE SALE PRICE
        // -------------------------------------------------

        let salePrice = null;


        if (
            sale_price !== undefined &&
            sale_price !== null &&
            String(sale_price).trim() !== ""
        ) {

            salePrice =
                Number(sale_price);


            if (
                !Number.isFinite(salePrice) ||
                salePrice < 0
            ) {

                connection.release();

                return res.status(400).json({

                    success: false,

                    message:
                        "Sale price must be a valid number"

                });
            }


            // Sale price should not exceed base price
            if (salePrice > basePrice) {

                connection.release();

                return res.status(400).json({

                    success: false,

                    message:
                        "Sale price cannot be greater than base price"

                });
            }
        }


        // -------------------------------------------------
        // SAFE FEATURED VALUE
        // -------------------------------------------------

        const featuredValue =

            featured === "1" ||
            featured === 1 ||
            featured === true
                ? 1
                : 0;


        // -------------------------------------------------
        // SAFE STATUS
        // -------------------------------------------------

        const productStatus =
            status || "active";


        // -------------------------------------------------
        // SLUG
        // -------------------------------------------------

        const slug =

            String(name)
                .toLowerCase()
                .trim()
                .replace(
                    /[^a-z0-9]+/g,
                    "-"
                )
                .replace(
                    /^-+|-+$/g,
                    ""
                );


        // -------------------------------------------------
        // PARSE VARIANTS
        // -------------------------------------------------

        let parsedVariants = [];


        if (typeof variants === "string") {

            try {

                parsedVariants =
                    JSON.parse(variants);

            } catch (error) {

                parsedVariants = [];
            }

        } else if (Array.isArray(variants)) {

            parsedVariants = variants;

        }


        // -------------------------------------------------
        // IMAGE
        // -------------------------------------------------

        let imagePath = null;


        // Local uploaded image
        if (req.file) {

            imagePath =
                `/uploads/products/${req.file.filename}`;

        }

        // Image URL
        else if (
            typeof image === "string" &&
            image.trim()
        ) {

            imagePath =
                image.trim();

        }


        // -------------------------------------------------
        // START TRANSACTION
        // -------------------------------------------------

        await connection.beginTransaction();


        // -------------------------------------------------
        // CHECK CATEGORY
        // -------------------------------------------------

        const [category] =
            await connection.query(`

                SELECT id

                FROM categories

                WHERE id = ?

            `, [categoryId]);


        if (category.length === 0) {

            await connection.rollback();

            connection.release();

            return res.status(400).json({

                success: false,

                message:
                    "Invalid category"

            });
        }


        // -------------------------------------------------
        // INSERT PRODUCT
        // -------------------------------------------------

        const [productResult] =
            await connection.query(`

                INSERT INTO products (

                    name,
                    slug,
                    description,
                    category_id,
                    brand,
                    sku,
                    base_price,
                    sale_price,
                    featured,
                    status

                )

                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

            `, [

                String(name).trim(),

                slug,

                description
                    ? String(description).trim()
                    : null,

                categoryId,

                brand
                    ? String(brand).trim()
                    : null,

                sku
                    ? String(sku).trim()
                    : null,

                basePrice,

                salePrice,

                featuredValue,

                productStatus

            ]);


        const productId =
            productResult.insertId;


        // -------------------------------------------------
        // INSERT VARIANTS
        // -------------------------------------------------

        if (
            Array.isArray(parsedVariants) &&
            parsedVariants.length > 0
        ) {

            for (
                const variant of parsedVariants
            ) {

                const variantSize =
                    variant.size
                        ? String(variant.size).trim()
                        : null;


                const variantColor =
                    variant.color
                        ? String(variant.color).trim()
                        : null;


                const variantSku =
                    variant.sku
                        ? String(variant.sku).trim()
                        : null;


                // -----------------------------------------
                // SAFE PRICE OVERRIDE
                // -----------------------------------------

                let priceOverride = null;


                if (
                    variant.price_override !== undefined &&
                    variant.price_override !== null &&
                    String(
                        variant.price_override
                    ).trim() !== ""
                ) {

                    priceOverride =
                        Number(
                            variant.price_override
                        );


                    if (
                        !Number.isFinite(
                            priceOverride
                        ) ||
                        priceOverride < 0
                    ) {

                        await connection.rollback();

                        connection.release();

                        return res.status(400).json({

                            success: false,

                            message:
                                "Variant price override must be a valid number"

                        });
                    }
                }


                // -----------------------------------------
                // SAFE STOCK
                // -----------------------------------------

                let stockQuantity = 0;


                if (
                    variant.stock_quantity !== undefined &&
                    variant.stock_quantity !== null &&
                    String(
                        variant.stock_quantity
                    ).trim() !== ""
                ) {

                    stockQuantity =
                        Number(
                            variant.stock_quantity
                        );


                    if (
                        !Number.isInteger(
                            stockQuantity
                        ) ||
                        stockQuantity < 0
                    ) {

                        await connection.rollback();

                        connection.release();

                        return res.status(400).json({

                            success: false,

                            message:
                                "Variant stock must be a valid whole number"

                        });
                    }
                }


                await connection.query(`

                    INSERT INTO product_variants (

                        product_id,
                        size,
                        color,
                        sku,
                        price_override,
                        stock_quantity

                    )

                    VALUES (?, ?, ?, ?, ?, ?)

                `, [

                    productId,

                    variantSize,

                    variantColor,

                    variantSku,

                    priceOverride,

                    stockQuantity

                ]);
            }
        }


        // -------------------------------------------------
        // INSERT PRIMARY IMAGE
        // -------------------------------------------------

        if (imagePath) {

            await connection.query(`

                INSERT INTO product_images (

                    product_id,
                    image_path,
                    is_primary,
                    sort_order

                )

                VALUES (?, ?, 1, 0)

            `, [

                productId,

                imagePath

            ]);
        }


        // -------------------------------------------------
        // COMMIT
        // -------------------------------------------------

        await connection.commit();

        connection.release();


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        res.status(201).json({

            success: true,

            message:
                "Product created successfully",

            productId,

            image:
                imagePath

        });


    } catch (error) {

        try {

            await connection.rollback();

        } catch (rollbackError) {

            console.error(
                "ROLLBACK ERROR:",
                rollbackError
            );
        }

        connection.release();


        console.error(
            "CREATE PRODUCT ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to create product",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });
    }
};


// =====================================================
// UPDATE PRODUCT
// Supports:
// 1. Image URL
// 2. Local image upload
// =====================================================

exports.updateProduct = async (req, res) => {

    const connection =
        await db.promise().getConnection();

    try {

        const { id } = req.params;


        const {

            name,

            description,

            category_id,

            brand,

            sku,

            base_price,

            sale_price,

            featured,

            status,

            variants,

            image

        } = req.body;


        // -------------------------------------------------
        // BASIC VALIDATION
        // -------------------------------------------------

        if (
            !name ||
            !String(name).trim() ||
            category_id === undefined ||
            category_id === null ||
            category_id === "" ||
            base_price === undefined ||
            base_price === null ||
            base_price === ""
        ) {

            connection.release();

            return res.status(400).json({

                success: false,

                message:
                    "Product name, category and base price are required"

            });
        }


        // -------------------------------------------------
        // SAFE CATEGORY ID
        // -------------------------------------------------

        const categoryId =
            Number(category_id);


        if (
            !Number.isInteger(categoryId) ||
            categoryId <= 0
        ) {

            connection.release();

            return res.status(400).json({

                success: false,

                message:
                    "Category must be a valid category"

            });
        }


        // -------------------------------------------------
        // SAFE BASE PRICE
        // -------------------------------------------------

        const basePrice =
            Number(base_price);


        if (
            !Number.isFinite(basePrice) ||
            basePrice < 0
        ) {

            connection.release();

            return res.status(400).json({

                success: false,

                message:
                    "Base price must be a valid number"

            });
        }


        // -------------------------------------------------
        // SAFE SALE PRICE
        // -------------------------------------------------

        let salePrice = null;


        if (
            sale_price !== undefined &&
            sale_price !== null &&
            String(sale_price).trim() !== ""
        ) {

            salePrice =
                Number(sale_price);


            if (
                !Number.isFinite(salePrice) ||
                salePrice < 0
            ) {

                connection.release();

                return res.status(400).json({

                    success: false,

                    message:
                        "Sale price must be a valid number"

                });
            }


            if (salePrice > basePrice) {

                connection.release();

                return res.status(400).json({

                    success: false,

                    message:
                        "Sale price cannot be greater than base price"

                });
            }
        }


        // -------------------------------------------------
        // SAFE FEATURED VALUE
        // -------------------------------------------------

        const featuredValue =

            featured === "1" ||
            featured === 1 ||
            featured === true
                ? 1
                : 0;


        // -------------------------------------------------
        // SAFE STATUS
        // -------------------------------------------------

        const productStatus =
            status || "active";


        // -------------------------------------------------
        // SLUG
        // -------------------------------------------------

        const slug =

            String(name)
                .toLowerCase()
                .trim()
                .replace(
                    /[^a-z0-9]+/g,
                    "-"
                )
                .replace(
                    /^-+|-+$/g,
                    ""
                );


        // -------------------------------------------------
        // PARSE VARIANTS
        // -------------------------------------------------

        let parsedVariants = [];


        if (typeof variants === "string") {

            try {

                parsedVariants =
                    JSON.parse(variants);

            } catch (error) {

                parsedVariants = [];
            }

        } else if (Array.isArray(variants)) {

            parsedVariants = variants;

        }


        // -------------------------------------------------
        // START TRANSACTION
        // -------------------------------------------------

        await connection.beginTransaction();


        // -------------------------------------------------
        // CHECK PRODUCT
        // -------------------------------------------------

        const [existing] =
            await connection.query(`

                SELECT id

                FROM products

                WHERE id = ?

            `, [id]);


        if (existing.length === 0) {

            await connection.rollback();

            connection.release();

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });
        }


        // -------------------------------------------------
        // CHECK CATEGORY
        // -------------------------------------------------

        const [category] =
            await connection.query(`

                SELECT id

                FROM categories

                WHERE id = ?

            `, [categoryId]);


        if (category.length === 0) {

            await connection.rollback();

            connection.release();

            return res.status(400).json({

                success: false,

                message:
                    "Invalid category"

            });
        }


        // -------------------------------------------------
        // UPDATE PRODUCT
        // -------------------------------------------------

        await connection.query(`

            UPDATE products

            SET

                name = ?,
                slug = ?,
                description = ?,
                category_id = ?,
                brand = ?,
                sku = ?,
                base_price = ?,
                sale_price = ?,
                featured = ?,
                status = ?

            WHERE id = ?

        `, [

            String(name).trim(),

            slug,

            description
                ? String(description).trim()
                : null,

            categoryId,

            brand
                ? String(brand).trim()
                : null,

            sku
                ? String(sku).trim()
                : null,

            basePrice,

            salePrice,

            featuredValue,

            productStatus,

            id

        ]);


        // -------------------------------------------------
        // REPLACE VARIANTS
        // -------------------------------------------------

        await connection.query(`

            DELETE FROM product_variants

            WHERE product_id = ?

        `, [id]);


        if (
            Array.isArray(parsedVariants) &&
            parsedVariants.length > 0
        ) {

            for (
                const variant of parsedVariants
            ) {

                const variantSize =
                    variant.size
                        ? String(variant.size).trim()
                        : null;


                const variantColor =
                    variant.color
                        ? String(variant.color).trim()
                        : null;


                const variantSku =
                    variant.sku
                        ? String(variant.sku).trim()
                        : null;


                // -----------------------------------------
                // SAFE PRICE OVERRIDE
                // -----------------------------------------

                let priceOverride = null;


                if (
                    variant.price_override !== undefined &&
                    variant.price_override !== null &&
                    String(
                        variant.price_override
                    ).trim() !== ""
                ) {

                    priceOverride =
                        Number(
                            variant.price_override
                        );


                    if (
                        !Number.isFinite(
                            priceOverride
                        ) ||
                        priceOverride < 0
                    ) {

                        await connection.rollback();

                        connection.release();

                        return res.status(400).json({

                            success: false,

                            message:
                                "Variant price override must be a valid number"

                        });
                    }
                }


                // -----------------------------------------
                // SAFE STOCK
                // -----------------------------------------

                let stockQuantity = 0;


                if (
                    variant.stock_quantity !== undefined &&
                    variant.stock_quantity !== null &&
                    String(
                        variant.stock_quantity
                    ).trim() !== ""
                ) {

                    stockQuantity =
                        Number(
                            variant.stock_quantity
                        );


                    if (
                        !Number.isInteger(
                            stockQuantity
                        ) ||
                        stockQuantity < 0
                    ) {

                        await connection.rollback();

                        connection.release();

                        return res.status(400).json({

                            success: false,

                            message:
                                "Variant stock must be a valid whole number"

                        });
                    }
                }


                await connection.query(`

                    INSERT INTO product_variants (

                        product_id,
                        size,
                        color,
                        sku,
                        price_override,
                        stock_quantity

                    )

                    VALUES (?, ?, ?, ?, ?, ?)

                `, [

                    id,

                    variantSize,

                    variantColor,

                    variantSku,

                    priceOverride,

                    stockQuantity

                ]);
            }
        }


        // -------------------------------------------------
        // IMAGE UPDATE
        // -------------------------------------------------

        let newImagePath = null;


        // Local uploaded image
        if (req.file) {

            newImagePath =
                `/uploads/products/${req.file.filename}`;

        }

        // Image URL
        else if (
            typeof image === "string" &&
            image.trim()
        ) {

            newImagePath =
                image.trim();

        }


        // Only replace image when
        // a new image was supplied
        if (newImagePath) {

            await connection.query(`

                DELETE FROM product_images

                WHERE product_id = ?

            `, [id]);


            await connection.query(`

                INSERT INTO product_images (

                    product_id,
                    image_path,
                    is_primary,
                    sort_order

                )

                VALUES (?, ?, 1, 0)

            `, [

                id,

                newImagePath

            ]);
        }


        // -------------------------------------------------
        // COMMIT
        // -------------------------------------------------

        await connection.commit();

        connection.release();


        res.json({

            success: true,

            message:
                "Product updated successfully",

            image:
                newImagePath || undefined

        });


    } catch (error) {

        try {

            await connection.rollback();

        } catch (rollbackError) {

            console.error(
                "ROLLBACK ERROR:",
                rollbackError
            );
        }

        connection.release();


        console.error(
            "UPDATE PRODUCT ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to update product",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });
    }
};


// =====================================================
// ARCHIVE PRODUCT
// =====================================================

exports.archiveProduct = async (req, res) => {

    try {

        const { id } = req.params;


        const [result] =
            await db.promise().query(`

                UPDATE products

                SET status = 'archived'

                WHERE id = ?

            `, [id]);


        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });
        }


        res.json({

            success: true,

            message:
                "Product archived successfully"

        });


    } catch (error) {

        console.error(
            "ARCHIVE PRODUCT ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to archive product"

        });
    }
};


// =====================================================
// RESTORE PRODUCT
// =====================================================

exports.restoreProduct = async (req, res) => {

    try {

        const { id } = req.params;


        const [result] =
            await db.promise().query(`

                UPDATE products

                SET status = 'active'

                WHERE id = ?

            `, [id]);


        if (result.affectedRows === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });
        }


        res.json({

            success: true,

            message:
                "Product restored successfully"

        });


    } catch (error) {

        console.error(
            "RESTORE PRODUCT ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to restore product"

        });
    }
};


// =====================================================
// PERMANENT DELETE PRODUCT
// =====================================================

exports.deleteProduct = async (req, res) => {

    const connection =
        await db.promise().getConnection();

    try {

        const { id } = req.params;


        await connection.beginTransaction();


        // -------------------------------------------------
        // CHECK PRODUCT
        // -------------------------------------------------

        const [existing] =
            await connection.query(`

                SELECT id

                FROM products

                WHERE id = ?

            `, [id]);


        if (existing.length === 0) {

            await connection.rollback();

            connection.release();

            return res.status(404).json({

                success: false,

                message:
                    "Product not found"

            });
        }


        // -------------------------------------------------
        // DELETE VARIANTS
        // -------------------------------------------------

        await connection.query(`

            DELETE FROM product_variants

            WHERE product_id = ?

        `, [id]);


        // -------------------------------------------------
        // DELETE IMAGES
        // -------------------------------------------------

        await connection.query(`

            DELETE FROM product_images

            WHERE product_id = ?

        `, [id]);


        // -------------------------------------------------
        // DELETE PRODUCT
        // -------------------------------------------------

        await connection.query(`

            DELETE FROM products

            WHERE id = ?

        `, [id]);


        // -------------------------------------------------
        // COMMIT
        // -------------------------------------------------

        await connection.commit();

        connection.release();


        res.json({

            success: true,

            message:
                "Product permanently deleted"

        });


    } catch (error) {

        try {

            await connection.rollback();

        } catch (rollbackError) {

            console.error(
                "ROLLBACK ERROR:",
                rollbackError
            );
        }

        connection.release();


        console.error(
            "PERMANENT DELETE PRODUCT ERROR:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to permanently delete product"

        });
    }
};

