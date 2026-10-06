
const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "bgadibs",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "store_bgadibs",

    waitForConnections: true,
    connectionLimit: 10,
    idleTimeout: 60000
});


/* =========================================================
   TEST DATABASE CONNECTION
========================================================= */

db.getConnection((err, connection) => {

    if (err) {

        console.error(
            "❌ MySQL database connection failed:",
            err.message
        );

        return;
    }

    console.log(
        "✅ MySQL database connected successfully"
    );

    console.log(
        `📦 Database: ${
            process.env.DB_NAME || "store_bgadibs"
        }`
    );

    connection.release();
});


module.exports = db;

