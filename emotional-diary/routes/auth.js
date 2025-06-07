const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const { getDBConnection } = require("../models/db");
const { body, validationResult } = require("express-validator");

// Signup
router.post("/register", 
[
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Invalid email format."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
    body("confirm").custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords do not match.");
      return true;
    }),
    body("phoneNum").isMobilePhone().withMessage("Invalid phone number."),
    body("birthDate").isDate().withMessage("Invalid birth date.")
  ], // used express-validator to validate input

async (req, res) => {
    const { name, email, password, confirm, phoneNum, birthDate } = req.body;

    // 로그 출력
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

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Insert new user
        await db.run("INSERT INTO users (name, email, password, phoneNum, birthDate) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, phoneNum, birthDate]);
        await db.close();

        // 4. Redirect to login page on success
        res.redirect("/login.html?success=1");
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
router.post("/login",
[
    body("email").isEmail().withMessage("Invalid email."),
    body("password").notEmpty().withMessage("Password is required.")
  ], // used express-validator to validate input
 (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).send("Unauthorized");

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Only send userId in the response
      return res.json({ userId: user.userId });
    });
  })(req, res, next);
});

module.exports = router;