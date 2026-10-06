
const db = require("../config/db");


/* =========================================================
   UPDATE CUSTOMER PROFILE
========================================================= */

const updateCustomerProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            name,
            email,
            phone
        } = req.body;


        /* =====================================================
           VALIDATION
        ===================================================== */

        if (!name || !name.trim()) {

            return res.status(400).json({
                success: false,
                message: "Name is required"
            });

        }


        if (!email || !email.trim()) {

            return res.status(400).json({
                success: false,
                message: "Email is required"
            });

        }


        /* =====================================================
           CHECK EMAIL FORMAT
        ===================================================== */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });

        }


        /* =====================================================
           CHECK WHETHER EMAIL IS USED BY ANOTHER USER
        ===================================================== */

        const [existingUsers] =
            await db.promise().query(
                `
                SELECT id
                FROM users
                WHERE email = ?
                AND id != ?
                LIMIT 1
                `,
                [
                    email.trim(),
                    userId
                ]
            );


        if (existingUsers.length > 0) {

            return res.status(409).json({
                success: false,
                message: "This email address is already in use"
            });

        }


        /* =====================================================
           UPDATE USER
        ===================================================== */

        await db.promise().query(
            `
            UPDATE users
            SET
                name = ?,
                email = ?,
                phone = ?
            WHERE id = ?
            `,
            [
                name.trim(),
                email.trim(),
                phone ? phone.trim() : null,
                userId
            ]
        );


        /* =====================================================
           GET UPDATED USER
        ===================================================== */

        const [rows] =
            await db.promise().query(
                `
                SELECT
                    id,
                    name,
                    email,
                    phone,
                    role
                FROM users
                WHERE id = ?
                LIMIT 1
                `,
                [userId]
            );


        return res.json({

            success: true,

            message:
                "Profile information updated successfully",

            user: rows[0]

        });

    } catch (error) {

        console.error(
            "UPDATE CUSTOMER PROFILE ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to update profile information"

        });
    }
};


module.exports = {
    updateCustomerProfile
};

