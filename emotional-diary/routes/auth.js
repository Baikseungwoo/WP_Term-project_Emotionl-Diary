const express = require("express");
const router = express.Router();
const passport = require("passport");
const { getDBConnection } = require("../models/db");

// Signup
router.post("/register", async (req, res) => {
    const { name, email, password, confirm, phoneNum, birthDate } = req.body;


    console.log("📩 Received data:", req.body);

    // 1. Check if passwords match
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

        // 2. Check if email already exists
        const existingUser = await db.get("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUser) {
            await db.close();
            return res.send(`
                        <script>
                            alert("Email already registered. Please use another email.");
                            window.location.href = "/register.html";
                        </script>
                    `);
        }

        // 3. Insert new user
        await db.run("INSERT INTO users (name, email, password, phoneNum, birthDate) VALUES (?, ?, ?, ?, ?)",
            [name, email, password, phoneNum, birthDate]);
        await db.close();

        // 4. Redirect to login page on success
        res.redirect("/login.html");
    } catch (err) {
        return res.status(500).send(`
            <script>
                alert("Signup Failed (Server Error): ${err.message}");
                window.location.href = "/signup.html";
            </script>
        `);
    }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send("Unauthorized");

    req.logIn(user, (err) => {
      if (err) return next(err);

      req.session.userId = user.userId;

      // ✅ Only send userId in the response
      return res.json({ userId: user.userId });
    });
  })(req, res, next);
});


module.exports = router;