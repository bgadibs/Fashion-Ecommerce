
const db = require("../config/db");

// =====================================================
// HELPER: GET EFFECTIVE PRICE
// =====================================================

const getEffectivePrice = (product, variant = null) => {
    if (
        variant &&
        variant.price_override !== null &&
        variant.price_override !== undefined
    ) {
        return Number(variant.price_override);
    }

    if (
        product.sale_price !== null &&
        product.sale_price !== undefined &&
        Number(product.sale_price) > 0
    ) {
        return Number(product.sale_price);
    }

    return Number(product.base_price);
};


// =====================================================
// GET CART
// =====================================================

exports.getCart = async (req, res) => {
    try {
        const [items] = await db.promise().query(
            `SELECT
                ci.id,
                ci.user_id,
                ci.product_id,
                ci.product_variant_id,
                ci.quantity,
                ci.created_at,

                pv.size,
                pv.color,
                pv.stock_quantity,
                pv.price_override,

                p.name,
                p.base_price,
                p.sale_price,
                p.status,

                (
                    SELECT pi.image_path
                    FROM product_images pi
                    WHERE pi.product_id = p.id
                    ORDER BY
                        pi.is_primary DESC,
                        pi.sort_order ASC,
                        pi.id ASC
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
            const price = getEffectivePrice(
                item,
                item.product_variant_id
                    ? item
                    : null
            );

            const quantity = Number(item.quantity);

            const lineTotal = price * quantity;

            total += lineTotal;

            return {
                id: item.id,

                product_id: item.product_id,

                product_variant_id:
                    item.product_variant_id,

                name: item.name,

                size: item.size || null,

                color: item.color || null,

                quantity,

                stock_quantity:
                    item.product_variant_id
                        ? Number(item.stock_quantity)
                        : null,

                base_price:
                    Number(item.base_price),

                sale_price:
                    item.sale_price !== null
                        ? Number(item.sale_price)
                        : null,

                price,

                lineTotal,

                image: item.image || null,

                status: item.status,
            };
        });

        res.json({
            success: true,
            items: cart,
            total: Number(total.toFixed(2)),
            itemCount: cart.reduce(
                (sum, item) =>
                    sum + Number(item.quantity),
                0
            ),
        });

    } catch (error) {
        console.error(
            "GET CART ERROR:",
            error
        );

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

        const productId = Number(product_id);
        const variantId =
            product_variant_id !== null &&
            product_variant_id !== undefined &&
            product_variant_id !== ""
                ? Number(product_variant_id)
                : null;

        const qty = Number(quantity) || 1;


        // =================================================
        // VALIDATE PRODUCT ID
        // =================================================

        if (!productId || productId < 1) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }


        // =================================================
        // VALIDATE QUANTITY
        // =================================================

        if (!Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be at least 1",
            });
        }


        // =================================================
        // GET PRODUCT
        // =================================================

        const [products] =
            await db.promise().query(
                `SELECT
                    id,
                    name,
                    base_price,
                    sale_price,
                    status
                 FROM products
                 WHERE id = ?`,
                [productId]
            );


        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }


        const product = products[0];


        // =================================================
        // CHECK PRODUCT STATUS
        // =================================================

        if (
            product.status &&
            product.status !== "active"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Product is not available",
            });
        }


        // =================================================
        // CHECK WHETHER PRODUCT HAS VARIANTS
        // =================================================

        const [variants] =
            await db.promise().query(
                `SELECT
                    id,
                    product_id,
                    size,
                    color,
                    stock_quantity,
                    price_override
                 FROM product_variants
                 WHERE product_id = ?`,
                [productId]
            );


        const hasVariants =
            variants.length > 0;


        // =================================================
        // PRODUCT HAS VARIANTS
        // =================================================

        if (hasVariants) {

            // -------------------------------------------------
            // VARIANT IS REQUIRED
            // -------------------------------------------------

            if (!variantId) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Please select a size or color before adding the product to cart",
                });
            }


            // -------------------------------------------------
            // FIND SELECTED VARIANT
            // -------------------------------------------------

            const variant =
                variants.find(
                    (item) =>
                        Number(item.id) ===
                        variantId
                );


            if (!variant) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Selected product variant not found",
                });
            }


            // -------------------------------------------------
            // CHECK VARIANT STOCK
            // -------------------------------------------------

            const stock =
                Number(
                    variant.stock_quantity || 0
                );


            if (stock <= 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Selected variant is out of stock",
                });
            }


            if (qty > stock) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Only ${stock} item(s) available for the selected variant`,
                });
            }


            // -------------------------------------------------
            // CHECK EXISTING CART ITEM
            // -------------------------------------------------

            const [existing] =
                await db.promise().query(
                    `SELECT
                        id,
                        quantity
                     FROM cart_items
                     WHERE user_id = ?
                     AND product_id = ?
                     AND product_variant_id = ?
                     LIMIT 1`,
                    [
                        req.user.id,
                        productId,
                        variantId,
                    ]
                );


            if (existing.length > 0) {

                const currentQuantity =
                    Number(
                        existing[0].quantity
                    );

                const newQuantity =
                    currentQuantity + qty;


                // -------------------------------------------------
                // CHECK TOTAL QUANTITY AGAINST STOCK
                // -------------------------------------------------

                if (newQuantity > stock) {
                    return res.status(400).json({
                        success: false,
                        message:
                            `Only ${stock} item(s) available for the selected variant`,
                    });
                }


                // -------------------------------------------------
                // UPDATE EXISTING ITEM
                // -------------------------------------------------

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


                return res.status(200).json({
                    success: true,
                    message:
                        "Cart quantity updated",
                });
            }


            // -------------------------------------------------
            // INSERT NEW VARIANT ITEM
            // -------------------------------------------------

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
                    productId,
                    variantId,
                    qty,
                ]
            );


            return res.status(201).json({
                success: true,
                message:
                    "Product added to cart",
            });
        }


        // =================================================
        // PRODUCT WITHOUT VARIANTS
        // =================================================

        // If a product has no variants, variant ID should
        // not be supplied.

        if (variantId) {
            return res.status(400).json({
                success: false,
                message:
                    "This product does not have variants",
            });
        }


        // =================================================
        // CHECK EXISTING NON-VARIANT CART ITEM
        // =================================================

        const [existing] =
            await db.promise().query(
                `SELECT
                    id,
                    quantity
                 FROM cart_items
                 WHERE user_id = ?
                 AND product_id = ?
                 AND product_variant_id IS NULL
                 LIMIT 1`,
                [
                    req.user.id,
                    productId,
                ]
            );


        // =================================================
        // UPDATE EXISTING ITEM
        // =================================================

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


            return res.status(200).json({
                success: true,
                message:
                    "Cart quantity updated",
            });
        }


        // =================================================
        // INSERT NEW NON-VARIANT ITEM
        // =================================================

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
                productId,
                qty,
            ]
        );


        return res.status(201).json({
            success: true,
            message:
                "Product added to cart",
        });

    } catch (error) {
        console.error(
            "ADD TO CART ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to add product to cart",
        });
    }
};


// =====================================================
// UPDATE CART
// =====================================================

exports.updateCart = async (req, res) => {
    try {
        const cartItemId =
            Number(req.params.id);

        const qty =
            Number(req.body.quantity);


        // =================================================
        // VALIDATE CART ITEM ID
        // =================================================

        if (
            !cartItemId ||
            cartItemId < 1
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid cart item ID",
            });
        }


        // =================================================
        // VALIDATE QUANTITY
        // =================================================

        if (
            !Number.isInteger(qty) ||
            qty < 1
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be at least 1",
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

                    pv.stock_quantity,

                    p.name,
                    p.status

                 FROM cart_items ci

                 INNER JOIN products p
                    ON p.id = ci.product_id

                 LEFT JOIN product_variants pv
                    ON ci.product_variant_id = pv.id

                 WHERE ci.id = ?
                 AND ci.user_id = ?
                 LIMIT 1`,
                [
                    cartItemId,
                    req.user.id,
                ]
            );


        if (items.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Cart item not found",
            });
        }


        const item = items[0];


        // =================================================
        // CHECK PRODUCT STATUS
        // =================================================

        if (
            item.status &&
            item.status !== "active"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Product is no longer available",
            });
        }


        // =================================================
        // VARIANT CART ITEM
        // =================================================

        if (item.product_variant_id) {

            const stock =
                Number(
                    item.stock_quantity || 0
                );


            if (stock <= 0) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Selected variant is out of stock",
                });
            }


            if (qty > stock) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Only ${stock} item(s) available`,
                });
            }
        }


        // =================================================
        // NON-VARIANT PRODUCT
        // =================================================

        // No stock_quantity column exists on the current
        // products table, so there is no stock validation
        // for non-variant products here.
        //
        // If you later add products.stock_quantity,
        // this section can be updated.


        // =================================================
        // UPDATE CART ITEM
        // =================================================

        await db.promise().query(
            `UPDATE cart_items
             SET quantity = ?
             WHERE id = ?
             AND user_id = ?`,
            [
                qty,
                cartItemId,
                req.user.id,
            ]
        );


        res.json({
            success: true,
            message:
                "Cart updated successfully",
        });

    } catch (error) {
        console.error(
            "UPDATE CART ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to update cart",
        });
    }
};


// =====================================================
// REMOVE CART ITEM
// =====================================================

exports.removeFromCart = async (req, res) => {
    try {
        const cartItemId =
            Number(req.params.id);


        // =================================================
        // VALIDATE ID
        // =================================================

        if (
            !cartItemId ||
            cartItemId < 1
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid cart item ID",
            });
        }


        // =================================================
        // DELETE ONLY USER'S OWN CART ITEM
        // =================================================

        const [result] =
            await db.promise().query(
                `DELETE FROM cart_items
                 WHERE id = ?
                 AND user_id = ?`,
                [
                    cartItemId,
                    req.user.id,
                ]
            );


        if (
            result.affectedRows === 0
        ) {
            return res.status(404).json({
                success: false,
                message:
                    "Cart item not found",
            });
        }


        res.json({
            success: true,
            message:
                "Item removed from cart",
        });

    } catch (error) {
        console.error(
            "REMOVE CART ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to remove cart item",
        });
    }
};


