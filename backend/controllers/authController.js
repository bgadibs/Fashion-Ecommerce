
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================================
// REGISTER CUSTOMER
// =====================================================

exports.register = async (req, res) => {
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

        const [existingUsers] =
            await db.promise().query(
                "SELECT id FROM users WHERE email = ?",
                [email]
            );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const [result] =
            await db.promise().query(
                `INSERT INTO users
                (
                    name,
                    email,
                    phone,
                    password,
                    role,
                    status
                )
                VALUES (?, ?, ?, ?, 'customer', 'active')`,
                [
                    name,
                    email,
                    phone || null,
                    hashedPassword
                ]
            );

        res.status(201).json({
            success: true,
            message: "Registration successful",
            userId: result.insertId
        });

    } catch (error) {
        console.error(
            "CUSTOMER REGISTER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};


// =====================================================
// LOGIN
// CUSTOMER + ADMIN + SUPER ADMIN
// =====================================================

exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email.
        // This allows customer, admin and superadmin.
        const [users] =
            await db.promise().query(
                `SELECT
                    id,
                    name,
                    email,
                    phone,
                    password,
                    role,
                    status
                 FROM users
                 WHERE email = ?
                 LIMIT 1`,
                [email]
            );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        // Check account status
        if (user.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive"
            });
        }

        // Check password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Never send password to frontend
        delete user.password;

        // Return role with token
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        console.error(
            "LOGIN ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};


// =====================================================
// GET CURRENT USER
// =====================================================

exports.me = async (req, res) => {
    try {
        const [users] =
            await db.promise().query(
                `SELECT
                    id,
                    name,
                    email,
                    phone,
                    role,
                    status,
                    created_at
                 FROM users
                 WHERE id = ?`,
                [req.user.id]
            );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: users[0]
        });

    } catch (error) {
        console.error(
            "GET USER ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to get user"
        });
    }
};

