const passport = require('../passport/passport');
const query = require('../models/query');
const { validationResult } = require('express-validator');

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
  try {
    const files = await query.getFiles(req);
    const folders = await query.getAllFolders(req);
    res.render('user', { files: files, folders: folders });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to Load User Data');
  }
}

async function uploadPageGet(req, res) {
  res.render('upload', { user: req.user });
}

async function uploadPost(req, res) {
  try {
    await query.uploadFile(req);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to Upload File');
  }
  res.redirect('/user');
}

async function downloadGet(req, res) {
  try {
    await query.downloadFile(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to Download File');
  }
}

async function folderPageGet(req, res) {
  const files = await query.getFiles(req);
  res.render('folder', { id: req.params.id, files: files });
}

async function addFolderPageGet(req, res) {
  res.render('addFolder');
}

async function addFolderPost(req, res) {
  try {
    await query.addFolder(req);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to Add Folder');
  }
  res.redirect('/user');
}

async function editFolderPageGet(req, res) {
  res.render('editFolder', { id: req.params.id });
}

async function editFolderPost(req, res) {
  try {
    await query.editFolder(req);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to Edit Folder');
  }
  res.redirect('/user');
}

async function deleteFolderPost(req, res) {
  try {
    await query.deleteFolder(req);
    res.redirect('/user');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to Delete Folder');
  }
}

async function registerPost(req, res) {
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
    console.error(err);
    res.status(500).send('Failed to Register User');
  }
}

async function loginPost(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login',
  })(req, res, next);
}

async function logoutGet(req, res) {
  req.logout((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Failed to Logout');
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
  uploadPageGet,
  uploadPost,
  downloadGet,
  folderPageGet,
  addFolderPageGet,
  addFolderPost,
  editFolderPageGet,
  editFolderPost,
  deleteFolderPost,
  loginPost,
  logoutGet,
};
