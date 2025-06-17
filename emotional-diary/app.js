// app.js
const express = require('express');
const session = require("express-session");
const passport = require("passport");
const path = require('path');

require("dotenv").config();
require("./server/passport")(passport); // Load passport strategy

const app = express();

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: "emotion-secret-key",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);

const diaryRoutes = require("./routes/diary");
app.use("/api", diaryRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api', adminRoutes);

const sessionRoutes = require("./routes/session");
app.use("/api", sessionRoutes);

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Admin
app.get("/admin.html", (req, res) => {
    const allowedAdmins = ['1', '2', '3'];
    const userId = String(req.session?.userId || "");

    if (!allowedAdmins.includes(userId)) {
        return res.redirect("/index.html");
    }

    res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Logout
app.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send("Logout failed");
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect("/index.html?logout=1");
        });
    });
});


module.exports = app;


