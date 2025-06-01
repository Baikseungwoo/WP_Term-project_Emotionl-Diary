const LocalStrategy = require("passport-local").Strategy;
const { getDBConnection } = require("../models/db");

module.exports = function (passport) {
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  }, async (email, password, done) => {
    try {
      const db = await getDBConnection();
      const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
      await db.close();

      if (!user) return done(null, false, { message: "No user" });
      if (user.password !== password) return done(null, false, { message: "Wrong password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  passport.deserializeUser(async (id, done) => {
    const db = await getDBConnection();
    const user = await db.get("SELECT * FROM users WHERE userId = ?", [id]);
    await db.close();
    done(null, user);
  });
};