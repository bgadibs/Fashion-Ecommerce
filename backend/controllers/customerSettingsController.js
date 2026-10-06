
const db = require("../config/db");


/* =========================================================
   GET CUSTOMER SETTINGS
========================================================= */

const getCustomerSettings = async (req, res) => {

    try {

        const userId = req.user.id;


        /* ================================================
           GET SETTINGS
        ================================================= */

        let [rows] =
            await db.promise().query(
                `
                SELECT
                    user_id,
                    order_notifications,
                    delivery_notifications,
                    promotional_notifications,
                    profile_visibility
                FROM customer_settings
                WHERE user_id = ?
                `,
                [userId]
            );


        /* ================================================
           CREATE DEFAULT SETTINGS IF NOT EXISTS
        ================================================= */

        if (rows.length === 0) {

            await db.promise().query(
                `
                INSERT INTO customer_settings (
                    user_id,
                    order_notifications,
                    delivery_notifications,
                    promotional_notifications,
                    profile_visibility
                )
                VALUES (?, 1, 1, 0, 1)
                `,
                [userId]
            );


            /* ============================================
               GET NEWLY CREATED SETTINGS
            ============================================ */

            [rows] =
                await db.promise().query(
                    `
                    SELECT
                        user_id,
                        order_notifications,
                        delivery_notifications,
                        promotional_notifications,
                        profile_visibility
                    FROM customer_settings
                    WHERE user_id = ?
                    `,
                    [userId]
                );
        }


        return res.json({

            success: true,

            settings: rows[0]

        });

    } catch (error) {

        console.error(
            "GET CUSTOMER SETTINGS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to load customer settings"

        });
    }
};


/* =========================================================
   UPDATE NOTIFICATIONS
========================================================= */

const updateNotifications = async (req, res) => {

    try {

        const userId = req.user.id;


        const {
            order_notifications,
            delivery_notifications,
            promotional_notifications
        } = req.body;


        await db.promise().query(
            `
            INSERT INTO customer_settings (
                user_id,
                order_notifications,
                delivery_notifications,
                promotional_notifications
            )
            VALUES (?, ?, ?, ?)

            ON DUPLICATE KEY UPDATE

                order_notifications =
                    VALUES(order_notifications),

                delivery_notifications =
                    VALUES(delivery_notifications),

                promotional_notifications =
                    VALUES(promotional_notifications)
            `,
            [
                userId,

                order_notifications
                    ? 1
                    : 0,

                delivery_notifications
                    ? 1
                    : 0,

                promotional_notifications
                    ? 1
                    : 0
            ]
        );


        return res.json({

            success: true,

            message:
                "Notification settings updated successfully"

        });

    } catch (error) {

        console.error(
            "UPDATE NOTIFICATIONS ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update notification settings"

        });
    }
};


/* =========================================================
   UPDATE PRIVACY
========================================================= */

const updatePrivacy = async (req, res) => {

    try {

        const userId = req.user.id;


        const {
            profile_visibility
        } = req.body;


        await db.promise().query(
            `
            INSERT INTO customer_settings (
                user_id,
                profile_visibility
            )
            VALUES (?, ?)

            ON DUPLICATE KEY UPDATE

                profile_visibility =
                    VALUES(profile_visibility)
            `,
            [
                userId,

                profile_visibility
                    ? 1
                    : 0
            ]
        );


        return res.json({

            success: true,

            message:
                "Privacy settings updated successfully"

        });

    } catch (error) {

        console.error(
            "UPDATE PRIVACY ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update privacy settings"

        });
    }
};


/* =========================================================
   EXPORT
========================================================= */

module.exports = {

    getCustomerSettings,

    updateNotifications,

    updatePrivacy

};

