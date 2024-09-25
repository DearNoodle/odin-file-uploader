const bcrypt = require('bcryptjs');

async function generatePassword(password) {
  return await bcrypt.hash(password, 10);
}

async function isPasswordValid(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
  generatePassword,
  isPasswordValid,
};
