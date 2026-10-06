const db = require("../config/db");

// =====================================================
// CREATE ORDER
// =====================================================

exports.createOrder = async (req, res) => {
    const connection = await db.promise().getConnection();

    try {

        const {
            address_id,
            payment_method
        } = req.body;

        await connection.beginTransaction();

        // -------------------------------------------------
        // Get address
        // -------------------------------------------------

        const [addresses] = await connection.query(
            `SELECT *
             FROM addresses
             WHERE id = ?
             AND user_id = ?`,
            [
                address_id,
                req.user.id
            ]
        );

        if (addresses.length === 0) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Invalid address"
            });
        }

        const address = addresses[0];

        // -------------------------------------------------
        // Get cart
        // -------------------------------------------------

        const [cart] = await connection.query(
            `SELECT
                ci.id,
                ci.quantity,

                pv.id AS variant_id,
                pv.size,
                pv.color,
                pv.stock_quantity,
                pv.price_override,

                p.name,
                p.base_price,
                p.sale_price

             FROM cart_items ci

             INNER JOIN product_variants pv
                ON ci.product_variant_id = pv.id

             INNER JOIN products p
                ON pv.product_id = p.id

             WHERE ci.user_id = ?

             FOR UPDATE`,
            [req.user.id]
        );

        if (cart.length === 0) {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }

        // -------------------------------------------------
        // Calculate total
        // -------------------------------------------------

        let subtotal = 0;

        for (const item of cart) {

            if (item.quantity > item.stock_quantity) {
                await connection.rollback();

                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${item.name}`
                });
            }

            const price =
                item.price_override ??
                item.sale_price ??
                item.base_price;

            subtotal +=
                Number(price) * Number(item.quantity);
        }

        const shipping = subtotal >= 999 ? 0 : 80;

        const discount = 0;

        const total =
            subtotal +
            shipping -
            discount;

        // -------------------------------------------------
        // Generate order number
        // -------------------------------------------------

        const orderNumber =
            `FS${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // -------------------------------------------------
        // Create order
        // -------------------------------------------------

        const [orderResult] = await connection.query(
            `INSERT INTO orders
            (
                order_number,
                user_id,
                subtotal,
                shipping,
                discount,
                total,
                status,
                payment_method,
                payment_status,

                ship_full_name,
                ship_phone,
                ship_line1,
                ship_line2,
                ship_city,
                ship_state,
                ship_postal,
                ship_country
            )
            VALUES
            (?, ?, ?, ?, ?, ?, 'pending', ?, 'unpaid',
             ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                orderNumber,
                req.user.id,
                subtotal,
                shipping,
                discount,
                total,

                payment_method || "cod",

                address.full_name,
                address.phone,
                address.line1,
                address.line2,
                address.city,
                address.state,
                address.postal_code,
                address.country
            ]
        );

        const orderId = orderResult.insertId;

        // -------------------------------------------------
        // Add order items
        // -------------------------------------------------

        for (const item of cart) {

            const price =
                item.price_override ??
                item.sale_price ??
                item.base_price;

            const lineTotal =
                Number(price) * Number(item.quantity);

            await connection.query(
                `INSERT INTO order_items
                (
                    order_id,
                    product_variant_id,
                    product_name,
                    size,
                    color,
                    unit_price,
                    quantity,
                    line_total
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    orderId,
                    item.variant_id,
                    item.name,
                    item.size,
                    item.color,
                    price,
                    item.quantity,
                    lineTotal
                ]
            );

            // Reduce stock
            await connection.query(
                `UPDATE product_variants
                 SET stock_quantity =
                    stock_quantity - ?
                 WHERE id = ?`,
                [
                    item.quantity,
                    item.variant_id
                ]
            );
        }

        // -------------------------------------------------
        // Empty cart
        // -------------------------------------------------

        await connection.query(
            `DELETE FROM cart_items
             WHERE user_id = ?`,
            [req.user.id]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            orderId,
            orderNumber,
            total
        });

    } catch (error) {

        await connection.rollback();

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to create order"
        });

    } finally {
        connection.release();
    }
};

// =====================================================
// GET CUSTOMER ORDERS
// =====================================================

exports.getMyOrders = async (req, res) => {
    try {

        const [orders] = await db.promise().query(
            `SELECT *
             FROM orders
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            orders
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to load orders"
        });
    }
};

// =====================================================
// GET ORDER DETAILS
// =====================================================

exports.getOrder = async (req, res) => {
    try {

        const [orders] = await db.promise().query(
            `SELECT *
             FROM orders
             WHERE id = ?
             AND user_id = ?`,
            [
                req.params.id,
                req.user.id
            ]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const [items] = await db.promise().query(
            `SELECT *
             FROM order_items
             WHERE order_id = ?
             ORDER BY id`,
            [req.params.id]
        );

        res.json({
            success: true,
            order: orders[0],
            items
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to load order"
        });
    }
};