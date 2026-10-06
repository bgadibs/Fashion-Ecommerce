const db = require("../config/db");

// =====================================================
// ADMIN DASHBOARD STATS
// =====================================================

exports.getStats = async (req, res) => {
    try {

        // -------------------------------------------------
        // BASIC COUNTS
        // -------------------------------------------------

        const [products] = await db.promise().query(`
            SELECT COUNT(*) AS totalProducts
            FROM products
            WHERE status != 'archived'
        `);

        const [orders] = await db.promise().query(`
            SELECT COUNT(*) AS totalOrders
            FROM orders
        `);

        const [customers] = await db.promise().query(`
            SELECT COUNT(*) AS totalCustomers
            FROM users
            WHERE role = 'customer'
        `);

        const [admins] = await db.promise().query(`
            SELECT COUNT(*) AS totalAdmins
            FROM users
            WHERE role = 'admin'
        `);

        const [superAdmins] = await db.promise().query(`
            SELECT COUNT(*) AS totalSuperAdmins
            FROM users
            WHERE role = 'superadmin'
        `);


        // -------------------------------------------------
        // REVENUE
        // -------------------------------------------------

        const [revenue] = await db.promise().query(`
            SELECT COALESCE(SUM(total), 0) AS totalRevenue
            FROM orders
            WHERE payment_status = 'paid'
        `);


        // -------------------------------------------------
        // ORDER STATUS COUNTS
        // -------------------------------------------------

        const [pending] = await db.promise().query(`
            SELECT COUNT(*) AS pendingOrders
            FROM orders
            WHERE status = 'pending'
        `);

        const [paid] = await db.promise().query(`
            SELECT COUNT(*) AS paidOrders
            FROM orders
            WHERE status = 'paid'
        `);

        const [processing] = await db.promise().query(`
            SELECT COUNT(*) AS processingOrders
            FROM orders
            WHERE status = 'processing'
        `);

        const [shipped] = await db.promise().query(`
            SELECT COUNT(*) AS shippedOrders
            FROM orders
            WHERE status = 'shipped'
        `);

        const [delivered] = await db.promise().query(`
            SELECT COUNT(*) AS deliveredOrders
            FROM orders
            WHERE status = 'delivered'
        `);

        const [cancelled] = await db.promise().query(`
            SELECT COUNT(*) AS cancelledOrders
            FROM orders
            WHERE status = 'cancelled'
        `);

        const [refunded] = await db.promise().query(`
            SELECT COUNT(*) AS refundedOrders
            FROM orders
            WHERE status = 'refunded'
        `);


        // -------------------------------------------------
        // LOW STOCK
        // -------------------------------------------------

        const [lowStock] = await db.promise().query(`
            SELECT COUNT(*) AS lowStockProducts
            FROM product_variants
            WHERE stock_quantity <= 5
        `);


        // -------------------------------------------------
        // OUT OF STOCK
        // -------------------------------------------------

        const [outOfStock] = await db.promise().query(`
            SELECT COUNT(*) AS outOfStockProducts
            FROM product_variants
            WHERE stock_quantity <= 0
        `);


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        res.json({
            success: true,

            stats: {

                totalProducts: products[0].totalProducts,

                totalOrders: orders[0].totalOrders,

                totalCustomers: customers[0].totalCustomers,

                totalAdmins: admins[0].totalAdmins,

                totalSuperAdmins: superAdmins[0].totalSuperAdmins,

                totalRevenue: Number(revenue[0].totalRevenue),

                pendingOrders: pending[0].pendingOrders,

                paidOrders: paid[0].paidOrders,

                processingOrders: processing[0].processingOrders,

                shippedOrders: shipped[0].shippedOrders,

                deliveredOrders: delivered[0].deliveredOrders,

                cancelledOrders: cancelled[0].cancelledOrders,

                refundedOrders: refunded[0].refundedOrders,

                lowStockProducts: lowStock[0].lowStockProducts,

                outOfStockProducts: outOfStock[0].outOfStockProducts
            }
        });

    } catch (error) {

        console.error("ADMIN STATS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard statistics"
        });
    }
};


// =====================================================
// ALL ADMIN ORDERS
// =====================================================

exports.getOrders = async (req, res) => {

    try {

        const [orders] = await db.promise().query(`

            SELECT

                o.id,

                o.order_number,

                o.user_id,

                o.subtotal,

                o.shipping,

                o.discount,

                o.total,

                o.status,

                o.payment_method,

                o.payment_status,

                o.created_at,

                o.updated_at,

                u.name AS customer_name,

                u.email AS customer_email

            FROM orders o

            INNER JOIN users u
                ON o.user_id = u.id

            ORDER BY o.created_at DESC

        `);

        res.json({
            success: true,
            orders
        });

    } catch (error) {

        console.error("ADMIN ORDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load orders"
        });
    }
};


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

exports.updateOrderStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;


        const allowedStatuses = [
            "pending",
            "paid",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            "refunded"
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }


        const [result] = await db.promise().query(`

            UPDATE orders

            SET
                status = ?,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = ?

        `, [status, id]);


        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }


        res.json({
            success: true,
            message: "Order status updated successfully"
        });

    } catch (error) {

        console.error("UPDATE ORDER STATUS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update order status"
        });
    }
};


// =====================================================
// RECENT ORDERS
// =====================================================

exports.getRecentOrders = async (req, res) => {

    try {

        const [orders] = await db.promise().query(`

            SELECT

                o.id,

                o.order_number,

                o.total,

                o.status,

                o.payment_status,

                o.created_at,

                u.name AS customer_name,

                u.email AS customer_email

            FROM orders o

            INNER JOIN users u
                ON o.user_id = u.id

            ORDER BY o.created_at DESC

            LIMIT 10

        `);


        res.json({
            success: true,
            orders
        });

    } catch (error) {

        console.error("RECENT ORDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load recent orders"
        });
    }
};


// =====================================================
// CATEGORY PRODUCT COUNTS
// =====================================================

exports.getCategoryStats = async (req, res) => {

    try {

        const [categories] = await db.promise().query(`

            SELECT

                c.id,

                c.name,

                COUNT(p.id) AS product_count

            FROM categories c

            LEFT JOIN products p
                ON c.id = p.category_id
                AND p.status != 'archived'

            GROUP BY
                c.id,
                c.name

            ORDER BY
                product_count DESC

        `);


        res.json({
            success: true,
            categories
        });

    } catch (error) {

        console.error("CATEGORY STATS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load category statistics"
        });
    }
};


// =====================================================
// MONTHLY SALES
// =====================================================

exports.getMonthlySales = async (req, res) => {

    try {

        const [sales] = await db.promise().query(`

            SELECT

                DATE_FORMAT(created_at, '%Y-%m') AS month,

                COALESCE(SUM(total), 0) AS revenue,

                COUNT(*) AS orders

            FROM orders

            WHERE payment_status = 'paid'

            GROUP BY
                DATE_FORMAT(created_at, '%Y-%m')

            ORDER BY
                month ASC

            LIMIT 12

        `);


        res.json({
            success: true,
            sales
        });

    } catch (error) {

        console.error("MONTHLY SALES ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load monthly sales"
        });
    }
};


// =====================================================
// LOW STOCK PRODUCTS
// =====================================================

exports.getLowStockProducts = async (req, res) => {

    try {

        const [products] = await db.promise().query(`

            SELECT

                pv.id AS variant_id,

                p.id AS product_id,

                p.name,

                pv.size,

                pv.color,

                pv.stock_quantity,

                pv.sku

            FROM product_variants pv

            INNER JOIN products p
                ON pv.product_id = p.id

            WHERE pv.stock_quantity <= 5

            ORDER BY
                pv.stock_quantity ASC

            LIMIT 20

        `);


        res.json({
            success: true,
            products
        });

    } catch (error) {

        console.error("LOW STOCK ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load low stock products"
        });
    }
};