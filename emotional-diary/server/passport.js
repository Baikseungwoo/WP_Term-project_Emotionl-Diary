const LocalStrategy = require("passport-local").Strategy;
const { getDBConnection } = require("../models/db");

// Export a function to configure Passport.js
module.exports = function (passport) {
  
  // Set up LocalStrategy for login authentication using email and password
  passport.use(new LocalStrategy({
    usernameField: "email",      // Use 'email' instead of default 'username'
    passwordField: "password"    // Use 'password' as the password field
  }, async (email, password, done) => {
    try {
      // Connect to the database
      const db = await getDBConnection();

      // Find the user with the given email
      const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
      await db.close();

      // If no user found, fail authentication
      if (!user) return done(null, false, { message: "No user" });

      // If password does not match, fail authentication
      if (user.password !== password) return done(null, false, { message: "Wrong password" });

      // Success: pass the user object to next step
      return done(null, user);

    } catch (err) {
      // If error occurs during DB query
      return done(err);
    }
  }));

  // Store user ID in the session (only minimal info saved)
  passport.serializeUser((user, done) => {
    done(null, user.userId);  // Store only userId in the session
  });

  // When request comes in, use stored userId to retrieve full user info
  passport.deserializeUser(async (id, done) => {
    const db = await getDBConnection();
    const user = await db.get("SELECT * FROM users WHERE userId = ?", [id]);
    await db.close();
    done(null, user);  // Attach user info to req.user
  });
};