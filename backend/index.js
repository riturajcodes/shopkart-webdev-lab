require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
  const origin = req.headers.origin || 'http://localhost:3000';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'authent service is runnin' });
});

app.use('/customers', require('./routes/customer.routes'));
app.use('/products', require('./routes/product.routes'));
app.use('/wishlist', require('./routes/wishlist.routes'));
app.use('/cart', require('./routes/cart.routes'));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ success: false, message: 'server error' });
});

async function startServer() {
  try {
    if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
      throw new Error('Missing required env vars: MONGO_URI and JWT_SECRET');
    }

    await mongoose.connect(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer()
