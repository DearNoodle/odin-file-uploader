const bcrypt = require('bcryptjs');

async function generatePassword(req) {
  return await bcrypt.hash(req.body.password, 123);
}

async function isPasswordValid(password, dbPassword) {
  return await bcrypt.compare(password, dbPassword);
}

module.exports = {
  generatePassword,
  isPasswordValid,
};
