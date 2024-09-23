function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).render('notAuth');
  }
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    next();
  } else {
    res.status(401).send('You are not an admin to visit this link!');
  }
}

module.exports = { isAuth, isAdmin };
