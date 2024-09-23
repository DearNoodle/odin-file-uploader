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
  const userId = req.user.id;
  const folders = await prisma.folder.findMany({
    where: {
      userId: userId,
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
    where: { folderId: req.params.id || null },
  });
  return files;
}

async function uploadFile(req) {
  const file = req.file;

  const fileData = {
    name: file.originalname,
    url: 'wip',
    userId: req.user.id,
  };

  if (req.params.id !== 'user') {
    fileData.folderId = req.params.id;
  }

  await prisma.file.create({ data: fileData });
}

module.exports = {
  addNewUser,
  getAllFolders,
  addFolder,
  editFolder,
  deleteFolder,
  getFiles,
  uploadFile,
};
