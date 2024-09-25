const { Router } = require('express');
const controller = require('../controllers/controller');

const { isAuth } = require('./routeAuth');
const validateRegister = require('./validateRegister');
const { upload } = require('../configs/cloudinaryConfig');

const router = Router();

router.get('/', controller.homePageGet);
router.get('/register', controller.registerPageGet);
router.post('/register', validateRegister, controller.registerPost);
router.get('/login', controller.loginPageGet);
router.post('/login', controller.loginPost);
router.get('/user', isAuth, controller.userPageGet);
router.get('/upload/:id', isAuth, controller.uploadPageGet);
router.post('/upload/:id', isAuth, upload.single('file'), controller.uploadPost);
router.get('/download/:id', isAuth, controller.downloadGet);

router.get('/folder/:id', isAuth, controller.folderPageGet);
router.get('/add-folder', isAuth, controller.addFolderPageGet);
router.post('/add-folder', isAuth, controller.addFolderPost);
router.get('/edit-folder/:id', isAuth, controller.editFolderPageGet);
router.post('/edit-folder/:id', isAuth, controller.editFolderPost);
router.post('/delete-folder/:id', isAuth, controller.deleteFolderPost);

router.get('/logout', isAuth, controller.logoutGet);

module.exports = router;
