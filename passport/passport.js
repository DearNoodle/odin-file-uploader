const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("../model/db");
const { isPasswordValid } = require("./password");

const customField = {
  usernameField: "username",
  passportField: "password",
};

const verification = async (username, password, done) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = rows[0];

    if (!user) {
      return done(null, false);
    }
    const match = await isPasswordValid(password, user.password);

    if (!match) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

passport.use(new LocalStrategy(customField, verification));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
