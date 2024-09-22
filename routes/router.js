const { Router } = require('express');
const controller = require('../controllers/controller');
const { isAuth, isAdmin } = require('./routeAuth');
const router = Router();

router.get('/', controller.homePageGet);
router.get('/register', controller.registerPageGet);
router.post('/register', controller.registerPost);
router.get('/login', controller.loginPageGet);
router.post('/login', controller.loginPost);
router.get('/user', isAuth, controller.userPageGet);
router.get('/logout', isAuth, controller.logoutGet);

module.exports = router;
