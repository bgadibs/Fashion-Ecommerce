const db = require("../config/db");
const bcrypt = require("bcryptjs");

// =====================================================
// GET ALL ADMINS
// =====================================================

exports.getAdmins = async (req, res) => {
    try {
        const [admins] = await db.promise().query(
            `SELECT
                id,
                name,
                email,
                phone,
                role,
                status,
                created_at
             FROM users
             WHERE role = 'admin'
             ORDER BY created_at DESC`
        );

        res.json({
            success: true,
            admins
        });

    } catch (error) {
        console.error("GET ADMINS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load admins"
        });
    }
};


// =====================================================
// GET SINGLE ADMIN
// =====================================================

exports.getAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const [admins] = await db.promise().query(
            `SELECT
                id,
                name,
                email,
                phone,
                role,
                status,
                created_at
             FROM users
             WHERE id = ?
             AND role = 'admin'`,
            [id]
        );

        if (admins.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.json({
            success: true,
            admin: admins[0]
        });

    } catch (error) {
        console.error("GET ADMIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load admin"
        });
    }
};


// =====================================================
// CREATE ADMIN
// =====================================================

exports.createAdmin = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const [existing] = await db.promise().query(
            `SELECT id
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const [result] = await db.promise().query(
            `INSERT INTO users
            (
                name,
                email,
                phone,
                password,
                role,
                status
            )
            VALUES (?, ?, ?, ?, 'admin', 'active')`,
            [
                name,
                email,
                phone || null,
                hashedPassword
            ]
        );

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            adminId: result.insertId
        });

    } catch (error) {
        console.error("CREATE ADMIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create admin"
        });
    }
};


// =====================================================
// UPDATE ADMIN
// =====================================================

exports.updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            phone,
            password
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const [admin] = await db.promise().query(
            `SELECT id
             FROM users
             WHERE id = ?
             AND role = 'admin'`,
            [id]
        );

        if (admin.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const [existingEmail] = await db.promise().query(
            `SELECT id
             FROM users
             WHERE email = ?
             AND id != ?`,
            [email, id]
        );

        if (existingEmail.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        if (password) {

            const hashedPassword =
                await bcrypt.hash(password, 10);

            await db.promise().query(
                `UPDATE users
                 SET
                    name = ?,
                    email = ?,
                    phone = ?,
                    password = ?,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?
                 AND role = 'admin'`,
                [
                    name,
                    email,
                    phone || null,
                    hashedPassword,
                    id
                ]
            );

        } else {

            await db.promise().query(
                `UPDATE users
                 SET
                    name = ?,
                    email = ?,
                    phone = ?,
                    updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?
                 AND role = 'admin'`,
                [
                    name,
                    email,
                    phone || null,
                    id
                ]
            );
        }

        res.json({
            success: true,
            message: "Admin updated successfully"
        });

    } catch (error) {
        console.error("UPDATE ADMIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update admin"
        });
    }
};


// =====================================================
// ACTIVATE ADMIN
// =====================================================

exports.activateAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.promise().query(
            `UPDATE users
             SET
                status = 'active',
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ?
             AND role = 'admin'`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.json({
            success: true,
            message: "Admin activated successfully"
        });

    } catch (error) {
        console.error("ACTIVATE ADMIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to activate admin"
        });
    }
};


// =====================================================
// DEACTIVATE ADMIN
// =====================================================

exports.deactivateAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.promise().query(
            `UPDATE users
             SET
                status = 'inactive',
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ?
             AND role = 'admin'`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.json({
            success: true,
            message: "Admin deactivated successfully"
        });

    } catch (error) {
        console.error("DEACTIVATE ADMIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to deactivate admin"
        });
    }
};


// =====================================================
// DELETE ADMIN
// =====================================================

exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.promise().query(
            `DELETE FROM users
             WHERE id = ?
             AND role = 'admin'`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.json({
            success: true,
            message: "Admin deleted successfully"
        });

    } catch (error) {
        console.error("DELETE ADMIN ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete admin"
        });
    }
};