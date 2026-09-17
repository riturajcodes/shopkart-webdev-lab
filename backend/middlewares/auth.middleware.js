const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model');
const { AUTH_COOKIE } = require('../utils/generateToken');

async function protect(req, res, next) {
  try {

    const token = req.cookies[AUTH_COOKIE];

    if (!token) {
      return res.status(401).json({ success: false, message: 'heyo dont have yo token' });
    }

    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const customer = await Customer.findById(payload.customerId);
    
    if (!customer) {
      return res.status(401).json({ success: false, message: 'heyo you are unauthorixed' });
    }

    req.user = customer;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'unauthorized' });
  }
}

module.exports = protect;
