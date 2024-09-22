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

module.exports = {
  addNewUser,
};
