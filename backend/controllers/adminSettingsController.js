
const db = require("../config/db");

/*
=========================================================
GET ADMIN SETTINGS
=========================================================
If no settings row exists, return empty values.
Do NOT insert default values.
*/
const getAdminSettings = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT
                id,
                store_name,
                store_email,
                store_phone,
                store_address,
                currency,
                shipping_threshold,
                new_order_notification,
                low_stock_notification,
                customer_registration_notification,
                allow_order_cancellation,
                created_at,
                updated_at
            FROM admin_settings
            ORDER BY id ASC
            LIMIT 1
        `);

        // Table is empty
        if (rows.length === 0) {
            return res.json({
                success: true,
                settings: {
                    id: null,
                    store_name: "",
                    store_email: "",
                    store_phone: "",
                    store_address: "",
                    currency: "",
                    shipping_threshold: "",
                    new_order_notification: false,
                    low_stock_notification: false,
                    customer_registration_notification: false,
                    allow_order_cancellation: false
                }
            });
        }

        const settings = rows[0];

        return res.json({
            success: true,
            settings: {
                ...settings,
                new_order_notification:
                    Boolean(settings.new_order_notification),

                low_stock_notification:
                    Boolean(settings.low_stock_notification),

                customer_registration_notification:
                    Boolean(settings.customer_registration_notification),

                allow_order_cancellation:
                    Boolean(settings.allow_order_cancellation)
            }
        });

    } catch (error) {
        console.error("GET ADMIN SETTINGS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load admin settings"
        });
    }
};


/*
=========================================================
UPDATE / CREATE ADMIN SETTINGS
=========================================================
If table is empty -> INSERT
If row exists -> UPDATE
*/
const updateAdminSettings = async (req, res) => {
    try {
        const {
            store_name,
            store_email,
            store_phone,
            store_address,
            currency,
            shipping_threshold,
            new_order_notification,
            low_stock_notification,
            customer_registration_notification,
            allow_order_cancellation
        } = req.body;

        // Store name validation
        if (!store_name || !store_name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Store name is required"
            });
        }

        // Currency validation
        if (!currency || !currency.trim()) {
            return res.status(400).json({
                success: false,
                message: "Currency is required"
            });
        }

        // Shipping threshold validation
        if (
            shipping_threshold === "" ||
            shipping_threshold === null ||
            shipping_threshold === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Shipping threshold is required"
            });
        }

        const shippingValue = Number(shipping_threshold);

        if (Number.isNaN(shippingValue) || shippingValue < 0) {
            return res.status(400).json({
                success: false,
                message: "Shipping threshold must be a valid number"
            });
        }

        /*
        -----------------------------------------------------
        CHECK WHETHER SETTINGS ROW ALREADY EXISTS
        -----------------------------------------------------
        */
        const [existingRows] = await db.promise().query(`
            SELECT id
            FROM admin_settings
            ORDER BY id ASC
            LIMIT 1
        `);

        /*
        -----------------------------------------------------
        INSERT FIRST SETTINGS ROW
        -----------------------------------------------------
        */
        if (existingRows.length === 0) {
            await db.promise().query(
                `
                INSERT INTO admin_settings (
                    store_name,
                    store_email,
                    store_phone,
                    store_address,
                    currency,
                    shipping_threshold,
                    new_order_notification,
                    low_stock_notification,
                    customer_registration_notification,
                    allow_order_cancellation
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    store_name.trim(),
                    store_email
                        ? store_email.trim()
                        : null,

                    store_phone
                        ? store_phone.trim()
                        : null,

                    store_address
                        ? store_address.trim()
                        : null,

                    currency.trim(),

                    shippingValue,

                    new_order_notification ? 1 : 0,

                    low_stock_notification ? 1 : 0,

                    customer_registration_notification
                        ? 1
                        : 0,

                    allow_order_cancellation ? 1 : 0
                ]
            );

            return res.json({
                success: true,
                message: "Admin settings created successfully"
            });
        }

        /*
        -----------------------------------------------------
        UPDATE EXISTING SETTINGS
        -----------------------------------------------------
        */
        const settingsId = existingRows[0].id;

        await db.promise().query(
            `
            UPDATE admin_settings
            SET
                store_name = ?,
                store_email = ?,
                store_phone = ?,
                store_address = ?,
                currency = ?,
                shipping_threshold = ?,
                new_order_notification = ?,
                low_stock_notification = ?,
                customer_registration_notification = ?,
                allow_order_cancellation = ?
            WHERE id = ?
            `,
            [
                store_name.trim(),

                store_email
                    ? store_email.trim()
                    : null,

                store_phone
                    ? store_phone.trim()
                    : null,

                store_address
                    ? store_address.trim()
                    : null,

                currency.trim(),

                shippingValue,

                new_order_notification ? 1 : 0,

                low_stock_notification ? 1 : 0,

                customer_registration_notification
                    ? 1
                    : 0,

                allow_order_cancellation ? 1 : 0,

                settingsId
            ]
        );

        return res.json({
            success: true,
            message: "Admin settings updated successfully"
        });

    } catch (error) {
        console.error("UPDATE ADMIN SETTINGS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to save admin settings"
        });
    }
};


/*
=========================================================
PUBLIC SETTINGS
=========================================================
Customer-side pages can use this later for:
- Store name
- Currency
- Shipping threshold
- Other public settings
=========================================================
*/
const getPublicSettings = async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT
                store_name,
                currency,
                shipping_threshold
            FROM admin_settings
            ORDER BY id ASC
            LIMIT 1
        `);

        // No settings have been saved yet
        if (rows.length === 0) {
            return res.json({
                success: true,
                settings: {
                    store_name: "",
                    currency: "",
                    shipping_threshold: ""
                }
            });
        }

        return res.json({
            success: true,
            settings: rows[0]
        });

    } catch (error) {
        console.error("GET PUBLIC SETTINGS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load store settings"
        });
    }
};


module.exports = {
    getAdminSettings,
    updateAdminSettings,
    getPublicSettings
};

