const express = require('express');
const session = require("express-session");
const passport = require("passport");
const path = require('path');

require("dotenv").config();
require("./server/passport")(passport); // Load passport strategy

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Parse form data 
app.use(express.urlencoded({ extended: true }));
// Parse JSON data 
app.use(express.json());

// Session configuration
app.use(session({
    secret: "emotion-secret-key",
    resave: false,
    saveUninitialized: false
}));

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect authentication routes
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

// Serve the default welcome page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});

// Login

// Logout
app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send("Logout failed");
        }
        req.session.destroy(() => {
            res.redirect("/index.html?logout=1");
        });
    });
});