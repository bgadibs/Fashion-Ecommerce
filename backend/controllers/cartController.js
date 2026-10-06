const db = require("../config/db");

// =====================================================
// GET CART
// =====================================================

exports.getCart = async (req, res) => {
    try {
        const [items] = await db.promise().query(
            `SELECT
                ci.id,
                ci.product_id,
                ci.quantity,

                pv.id AS variant_id,
                pv.size,
                pv.color,
                pv.stock_quantity,
                pv.price_override,

                p.id AS product_id,
                p.name,
                p.base_price,
                p.sale_price,

                (
                    SELECT pi.image_path
                    FROM product_images pi
                    WHERE pi.product_id = p.id
                    ORDER BY pi.is_primary DESC, pi.sort_order ASC
                    LIMIT 1
                ) AS image

             FROM cart_items ci

             LEFT JOIN product_variants pv
                ON ci.product_variant_id = pv.id

             INNER JOIN products p
                ON p.id = ci.product_id

             WHERE ci.user_id = ?

             ORDER BY ci.created_at DESC`,
            [req.user.id]
        );

        let total = 0;

        const cart = items.map((item) => {
            const price =
                item.price_override ??
                item.sale_price ??
                item.base_price;

            const lineTotal =
                Number(price) * Number(item.quantity);

            total += lineTotal;

            return {
                ...item,
                price,
                lineTotal,
            };
        });

        res.json({
            success: true,
            items: cart,
            total,
        });

    } catch (error) {
        console.error("GET CART ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load cart",
        });
    }
};


// =====================================================
// ADD TO CART
// =====================================================

exports.addToCart = async (req, res) => {
    try {
        const {
            product_id,
            product_variant_id,
            quantity,
        } = req.body;

        const qty = Number(quantity) || 1;

        if (qty < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity",
            });
        }

        /*
         * PRODUCT ID IS REQUIRED
         */

        if (!product_id) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }


        // =================================================
        // CHECK PRODUCT
        // =================================================

        const [products] = await db.promise().query(
            `SELECT
                id,
                name,
                base_price,
                sale_price,
                status
             FROM products
             WHERE id = ?`,
            [product_id]
        );

        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const product = products[0];


        if (
            product.status &&
            product.status !== "active"
        ) {
            return res.status(400).json({
                success: false,
                message: "Product is not available",
            });
        }


        // =================================================
        // VARIANT SELECTED
        // =================================================

        if (product_variant_id) {

            const [variants] = await db.promise().query(
                `SELECT
                    id,
                    product_id,
                    size,
                    color,
                    stock_quantity,
                    price_override
                 FROM product_variants
                 WHERE id = ?
                 AND product_id = ?`,
                [
                    product_variant_id,
                    product_id,
                ]
            );

            if (variants.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Product variant not found",
                });
            }

            const variant = variants[0];


            // =============================================
            // CHECK VARIANT STOCK
            // =============================================

            if (
                Number(variant.stock_quantity) < qty
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock",
                });
            }


            // =============================================
            // CHECK EXISTING VARIANT CART ITEM
            // =============================================

            const [existing] =
                await db.promise().query(
                    `SELECT
                        id,
                        quantity
                     FROM cart_items
                     WHERE user_id = ?
                     AND product_id = ?
                     AND product_variant_id = ?`,
                    [
                        req.user.id,
                        product_id,
                        product_variant_id,
                    ]
                );


            if (existing.length > 0) {

                const newQuantity =
                    Number(existing[0].quantity) +
                    qty;


                if (
                    newQuantity >
                    Number(variant.stock_quantity)
                ) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "Requested quantity exceeds available stock",
                    });
                }


                await db.promise().query(
                    `UPDATE cart_items
                     SET quantity = ?
                     WHERE id = ?
                     AND user_id = ?`,
                    [
                        newQuantity,
                        existing[0].id,
                        req.user.id,
                    ]
                );

            } else {

                await db.promise().query(
                    `INSERT INTO cart_items
                    (
                        user_id,
                        product_id,
                        product_variant_id,
                        quantity
                    )
                    VALUES (?, ?, ?, ?)`,
                    [
                        req.user.id,
                        product_id,
                        product_variant_id,
                        qty,
                    ]
                );
            }


            return res.status(201).json({
                success: true,
                message: "Product added to cart",
            });
        }


        // =================================================
        // NO VARIANT SELECTED
        // =================================================
        //
        // Size / Color are optional.
        //
        // If the customer does not select a variant,
        // we allow the product to be added directly.
        //
        // For products that have variants, calculate
        // total available stock from all variants.
        // =================================================

        const [variantStock] =
            await db.promise().query(
                `SELECT
                    COALESCE(
                        SUM(stock_quantity),
                        0
                    ) AS total_stock
                 FROM product_variants
                 WHERE product_id = ?`,
                [product_id]
            );

        const totalVariantStock =
            Number(
                variantStock[0]?.total_stock || 0
            );


        // =============================================
        // PRODUCT HAS VARIANTS
        // =============================================

        if (totalVariantStock > 0) {

            const [existing] =
                await db.promise().query(
                    `SELECT
                        id,
                        quantity
                     FROM cart_items
                     WHERE user_id = ?
                     AND product_id = ?
                     AND product_variant_id IS NULL`,
                    [
                        req.user.id,
                        product_id,
                    ]
                );


            const existingQuantity =
                existing.length > 0
                    ? Number(existing[0].quantity)
                    : 0;


            const newQuantity =
                existingQuantity + qty;


            if (
                newQuantity >
                totalVariantStock
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Requested quantity exceeds available stock",
                });
            }


            if (existing.length > 0) {

                await db.promise().query(
                    `UPDATE cart_items
                     SET quantity = ?
                     WHERE id = ?
                     AND user_id = ?`,
                    [
                        newQuantity,
                        existing[0].id,
                        req.user.id,
                    ]
                );

            } else {

                await db.promise().query(
                    `INSERT INTO cart_items
                    (
                        user_id,
                        product_id,
                        product_variant_id,
                        quantity
                    )
                    VALUES (?, ?, NULL, ?)`,
                    [
                        req.user.id,
                        product_id,
                        qty,
                    ]
                );
            }

        } else {

            // =============================================
            // PRODUCT WITHOUT VARIANTS
            // =============================================
            //
            // If there are no variants, we still allow
            // the product to be added.
            //
            // Your products table currently does not have
            // a direct stock_quantity field, so there is
            // no variant stock to validate here.
            // =============================================

            const [existing] =
                await db.promise().query(
                    `SELECT
                        id,
                        quantity
                     FROM cart_items
                     WHERE user_id = ?
                     AND product_id = ?
                     AND product_variant_id IS NULL`,
                    [
                        req.user.id,
                        product_id,
                    ]
                );


            if (existing.length > 0) {

                const newQuantity =
                    Number(existing[0].quantity) +
                    qty;


                await db.promise().query(
                    `UPDATE cart_items
                     SET quantity = ?
                     WHERE id = ?
                     AND user_id = ?`,
                    [
                        newQuantity,
                        existing[0].id,
                        req.user.id,
                    ]
                );

            } else {

                await db.promise().query(
                    `INSERT INTO cart_items
                    (
                        user_id,
                        product_id,
                        product_variant_id,
                        quantity
                    )
                    VALUES (?, ?, NULL, ?)`,
                    [
                        req.user.id,
                        product_id,
                        qty,
                    ]
                );
            }
        }


        res.status(201).json({
            success: true,
            message: "Product added to cart",
        });

    } catch (error) {
        console.error("ADD TO CART ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add product to cart",
        });
    }
};


// =====================================================
// UPDATE CART
// =====================================================

exports.updateCart = async (req, res) => {
    try {
        const qty = Number(
            req.body.quantity
        );

        if (!qty || qty < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid quantity",
            });
        }


        // =================================================
        // GET CART ITEM
        // =================================================

        const [items] =
            await db.promise().query(
                `SELECT
                    ci.id,
                    ci.product_id,
                    ci.product_variant_id,

                    pv.stock_quantity

                 FROM cart_items ci

                 LEFT JOIN product_variants pv
                    ON ci.product_variant_id = pv.id

                 WHERE ci.id = ?
                 AND ci.user_id = ?`,
                [
                    req.params.id,
                    req.user.id,
                ]
            );


        if (items.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found",
            });
        }


        const item = items[0];


        // =================================================
        // VARIANT CART ITEM
        // =================================================

        if (item.product_variant_id) {

            if (
                qty >
                Number(item.stock_quantity)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Quantity exceeds available stock",
                });
            }

        } else {

            // =================================================
            // NO VARIANT SELECTED
            // =================================================
            //
            // Check total available stock across variants.
            // =================================================

            const [stock] =
                await db.promise().query(
                    `SELECT
                        COALESCE(
                            SUM(stock_quantity),
                            0
                        ) AS total_stock
                     FROM product_variants
                     WHERE product_id = ?`,
                    [item.product_id]
                );


            const totalStock =
                Number(
                    stock[0]?.total_stock || 0
                );


            if (
                totalStock > 0 &&
                qty > totalStock
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Quantity exceeds available stock",
                });
            }
        }


        // =================================================
        // UPDATE QUANTITY
        // =================================================

        await db.promise().query(
            `UPDATE cart_items
             SET quantity = ?
             WHERE id = ?
             AND user_id = ?`,
            [
                qty,
                req.params.id,
                req.user.id,
            ]
        );


        res.json({
            success: true,
            message: "Cart updated",
        });

    } catch (error) {
        console.error(
            "UPDATE CART ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to update cart",
        });
    }
};


// =====================================================
// REMOVE CART ITEM
// =====================================================

exports.removeFromCart = async (req, res) => {
    try {

        const [result] =
            await db.promise().query(
                `DELETE FROM cart_items
                 WHERE id = ?
                 AND user_id = ?`,
                [
                    req.params.id,
                    req.user.id,
                ]
            );


        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found",
            });
        }


        res.json({
            success: true,
            message: "Item removed from cart",
        });

    } catch (error) {
        console.error(
            "REMOVE CART ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to remove cart item",
        });
    }
};