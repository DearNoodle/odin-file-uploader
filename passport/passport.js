const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require('@prisma/client');
const { isPasswordValid } = require('./password');

const prisma = new PrismaClient();

const customField = {
  usernameField: 'username',
  passportField: 'password',
};

const verification = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }
    const match = await isPasswordValid(password, user.password);

    if (!match) {
      return done(null, false, { message: 'Incorrect password' });
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
    const user = await prisma.user.findUnique({ where: { id } });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;
