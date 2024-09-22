const bcrypt = require('bcryptjs');

async function generatePassword(password) {
  return await bcrypt.hash(password, 10);
}

async function isPasswordValid(password, dbPassword) {
  return await bcrypt.compare(password, dbPassword);
}

module.exports = {
  generatePassword,
  isPasswordValid,
};
