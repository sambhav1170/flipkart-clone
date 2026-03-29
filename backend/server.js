const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/wishlists', require('./routes/wishlists'));
app.use('/api/reviews', require('./routes/reviews'));

// Base Route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to Flipkart Clone API', data: {} });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Keep event loop alive (workaround for Node clean exit issue)
setInterval(() => {}, 1000 * 60 * 60);
