const passport = require('../passport/passport');
const query = require('../models/query');
const { body, validationResult } = require('express-validator');

async function homePageGet(req, res) {
  res.render('home');
}

async function registerPageGet(req, res) {
  res.render('register', { errors: null });
}

async function loginPageGet(req, res) {
  res.render('login');
}

async function userPageGet(req, res) {
  const uploads = await query.getAllUploads();
  res.render('user', {
    user: req.user,
  });
}

async function adminPageGet(req, res) {
  res.send('Arrived Admin Page!');
}

const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Username must be between 3 and 10 characters long.'),
  body('password')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Password must be between 3 and 10 characters long.'),
];

const registerPost = [
  validateRegister,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('register', {
        errors: errors.array(),
      });
    }
    try {
      await query.addNewUser(req);
      res.redirect('/login');
    } catch (err) {
      res.status(500).send(err);
    }
  },
];

async function loginPost(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login',
  })(req, res, next);
}

async function logoutGet(req, res) {
  req.logout((err) => {
    if (err) {
      res.status(500).send(err);
    }
    res.redirect('/');
  });
}

module.exports = {
  homePageGet,
  loginPageGet,
  registerPageGet,
  registerPost,
  userPageGet,
  adminPageGet,
  loginPost,
  logoutGet,
};
