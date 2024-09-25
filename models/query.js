const axios = require('axios');
const { generatePassword } = require('../passport/password');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addNewUser(req) {
  const hashedPassword = await generatePassword(req.body.password);
  await prisma.user.create({
    data: {
      username: req.body.username,
      password: hashedPassword,
    },
  });
}

async function getAllFolders(req) {
  const folders = await prisma.folder.findMany({
    where: {
      userId: req.user.id,
    },
  });
  return folders;
}

async function addFolder(req) {
  const { folderName } = req.body;
  await prisma.folder.create({
    data: {
      name: folderName,
      userId: req.user.id,
    },
  });
}

async function editFolder(req) {
  const folderId = req.params.id;
  const { folderName } = req.body;

  const folder = await prisma.folder.findUnique({
    where: { id: folderId, userId: req.user.id },
  });

  if (!folder) {
    throw new Error('Folder not in Server.');
  }

  await prisma.folder.update({
    where: { id: folderId },
    data: { name: folderName },
  });
}

async function deleteFolder(req) {
  const folderId = req.params.id;
  const folder = await prisma.folder.findUnique({
    where: { id: folderId, userId: req.user.id },
  });
  if (!folder) {
    throw new Error('Folder not in Server.');
  }
  await prisma.folder.delete({
    where: { id: folderId },
  });
}

async function getFiles(req) {
  const files = await prisma.file.findMany({
    where: { userId: req.user.id, folderId: req.params.id || null },
  });
  return files;
}

async function uploadFile(req) {
  const file = req.file;
  console.log(file);
  const fileData = {
    originalname: file.originalname,
    filename: file.filename,
    url: file.path,
    size: file.size,
    userId: req.user.id,
  };

  if (req.params.id !== 'user') {
    fileData.folderId = req.params.id;
  }

  await prisma.file.create({ data: fileData });
}

async function downloadFile(req, res) {
  const file = await prisma.file.findUnique({ where: { id: req.params.id } });
  if (!file) {
    return res.status(404).send('File not found');
  }
  try {
    const response = await axios.get(file.url);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalname}"`); // Set download filename
    res.send(response.data); // Send image data
  } catch (error) {
    console.error('Error downloading file:', error);
    return res.status(500).send('Error downloading file');
  }
}

module.exports = {
  addNewUser,
  getAllFolders,
  addFolder,
  editFolder,
  deleteFolder,
  getFiles,
  uploadFile,
  downloadFile,
};
