const Customer = require('../models/customer.model');
const {
  AUTH_COOKIE,
  generateToken,
  authCookieOptions
} = require('../utils/generateToken');

async function registerCustomer(req, res) {
  
  const { fullName, email, password, phone } = req.body;

  if (!fullName || !email || !password  || !phone) {
    return res.status(400).json({ success: false, message: 'all fields required bro' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'password must contain at least 6 chars' });
  }

  try {
    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return res.status(409).json({ success: false, message: 'why you stealing someone elses email' });
    }

    const customer = await Customer.create({
      fullName,
      email,
      password,
      phone
    });

    return res.status(201).json({
      success: true,

      message: 'Customer created',
      customer: customer.toSafeObject()
    });
  } catch (err) {

    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email taken bro' });
    }
    throw err;
  }
}

async function loginCustomer(req, res) {
  const { email, password } = req.body;
  const customer = await Customer.findOne({ email }).select('+password');
  const isValid = customer && await customer.comparePassword(password);

  if (!isValid) {
    return res.status(401).json({ success: false, message: 'email or password invalid' });
  }

  res.cookie(AUTH_COOKIE, generateToken(customer._id.toString()), authCookieOptions());
  return res.json({
    success: true,
    message: 'Login successful!!',
    customer: customer.toSafeObject()
  });
}

function getProfile(req, res) {
  return res.json(req.user.toSafeObject());
}

function logoutCustomer(req, res) {
  res.clearCookie(AUTH_COOKIE, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  return res.json({ success: true, message: 'Logged out' });
}

async function changePassword(req, res) {;
  const { oldPassword, newPassword } = req.body;
  console.log(req.body)

  if (!oldPassword|| !newPassword) {
    return res.status(400).json({ success: false, message: 'both required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'at least 6 characters' });
  }

  const customer = await Customer.findById(req.user._id).select('+password');
  if (!customer || !(await customer.comparePassword(oldPassword))) {

    return res.status(401).json({ success: false, message: 'Invalid old password' });
  
  }

  customer.password = newPassword;
  await customer.save();
  return res.json({ success: true, message: 'Password changed successfully' });
}

module.exports = {
  registerCustomer, loginCustomer,
  getProfile,
  logoutCustomer,
  changePassword
};
