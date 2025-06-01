const express = require("express");
const router = express.Router();
const passport = require("passport");
const { getDBConnection } = require("../models/db");

// Signup
router.post("/register", async (req, res) => {
    const { name, email, password, confirm, phoneNum, birthDate } = req.body;

    // 로그 출력
    console.log("📩 Received data:", req.body);

    // Password confirmation check
    if (password !== confirm) {
        res.send(`
            <script>
                alert("Passwords do not match!");
                window.location.href = "/signup.html";
            </script>
        `);
    }

    try {
        const db = await getDBConnection();
        await db.run("INSERT INTO users (name, email, password, phoneNum, birthDate) VALUES (?, ?, ?, ?, ?)",
            [name, email, password, phoneNum, birthDate]);
        await db.close();
        res.redirect("/login.html");
    } catch (err) {
        return res.status(500).send(`
            <script>
                alert("Signup Failed (Server Error)");
                window.location.href = "/signup.html";
            </script>
        `);
    }
});

// Login
router.post("/login", passport.authenticate("local", {
    successRedirect: "/main.html",
    failureRedirect: "/login.html?error=1"
}));

module.exports = router;