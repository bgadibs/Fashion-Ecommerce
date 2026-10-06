const db = require("../config/db");

// GET ADDRESSES
exports.getAddresses = async (req, res) => {
    try {

        const [addresses] = await db.promise().query(
            `SELECT *
             FROM addresses
             WHERE user_id = ?
             ORDER BY is_default DESC, id DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            addresses
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to load addresses"
        });
    }
};

// ADD ADDRESS
exports.addAddress = async (req, res) => {
    try {

        const {
            full_name,
            phone,
            line1,
            line2,
            city,
            state,
            postal_code,
            country,
            is_default
        } = req.body;

        if (
            !full_name ||
            !phone ||
            !line1 ||
            !city ||
            !state ||
            !postal_code
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required address fields"
            });
        }

        const makeDefault = Boolean(is_default);

        if (makeDefault) {
            await db.promise().query(
                `UPDATE addresses
                 SET is_default = 0
                 WHERE user_id = ?`,
                [req.user.id]
            );
        }

        const [result] = await db.promise().query(
            `INSERT INTO addresses
            (
                user_id,
                full_name,
                phone,
                line1,
                line2,
                city,
                state,
                postal_code,
                country,
                is_default
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.id,
                full_name,
                phone,
                line1,
                line2 || null,
                city,
                state,
                postal_code,
                country || "India",
                makeDefault ? 1 : 0
            ]
        );

        res.status(201).json({
            success: true,
            message: "Address added successfully",
            addressId: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to add address"
        });
    }
};

// DELETE ADDRESS
exports.deleteAddress = async (req, res) => {
    try {

        await db.promise().query(
            `DELETE FROM addresses
             WHERE id = ?
             AND user_id = ?`,
            [
                req.params.id,
                req.user.id
            ]
        );

        res.json({
            success: true,
            message: "Address deleted"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to delete address"
        });
    }
};