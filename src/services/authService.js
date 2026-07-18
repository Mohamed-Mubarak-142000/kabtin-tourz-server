const Admin = require('../models/Admin');
const { signToken } = require('../utils/jwt');

async function login(username, password) {
  const admin = await Admin.findOne({ username });
  if (!admin) {
    const err = new Error('Invalid username or password');
    err.status = 401;
    throw err;
  }

  const matches = await admin.comparePassword(password);
  if (!matches) {
    const err = new Error('Invalid username or password');
    err.status = 401;
    throw err;
  }

  const token = signToken({ id: admin._id.toString(), username: admin.username });
  return { token };
}

module.exports = { login };
