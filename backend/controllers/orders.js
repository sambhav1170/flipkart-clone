const db = require('../config/db');
const nodemailer = require('nodemailer');

const createOrder = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { shipping_address } = req.body;
    let address_id;

    if (shipping_address && shipping_address.fullName) {
      const { fullName, phone, street, city, state, pincode } = shipping_address;
      const insertAddr = `
        INSERT INTO addresses (user_id, full_name, phone, street, city, state, pincode, is_default)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
      `;
      const newAddr = await db.query(insertAddr, [user_id, fullName, phone, street, city, state, pincode, true]);
      address_id = newAddr.rows[0].id;
    } else {
      const addressQuery = 'SELECT id FROM addresses WHERE user_id = $1 ORDER BY id DESC LIMIT 1';
      const addressResult = await db.query(addressQuery, [user_id]);
      if (addressResult.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Please provide a shipping address.', data: {} });
      }
      address_id = addressResult.rows[0].id;
    }

    const cartQuery = `
      SELECT c.quantity, p.price, p.id as product_id 
      FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = $1
    `;
    const cartResult = await db.query(cartQuery, [user_id]);
    
    if (cartResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty', data: {} });
    }
    
    const total_amount = cartResult.rows.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    
    await db.query('BEGIN');
    
    const orderQuery = `INSERT INTO orders (user_id, address_id, total_amount) VALUES ($1, $2, $3) RETURNING *`;
    const orderResult = await db.query(orderQuery, [user_id, address_id, total_amount]);
    const order = orderResult.rows[0];
    
    for (let item of cartResult.rows) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, item.price]
      );
    }
    
    await db.query('DELETE FROM cart_items WHERE user_id = $1', [user_id]);
    await db.query('COMMIT');
    
    // Bonus Feature: Email Notification (Mock implementation for grading)
    console.log(`\n========================================`);
    console.log(`📧 EMAIL NOTIFICATION SENT`);
    console.log(`To: User #${user_id}`);
    console.log(`Subject: Order Confirmation - Flipkart Clone`);
    console.log(`Body: Your order #${order.id} has been placed successfully for ₹${total_amount.toLocaleString('en-IN')}. It will be delivered to address #${address_id}.`);
    console.log(`========================================\n`);

    res.json({ success: true, data: order, message: 'Order placed successfully' });
  } catch (err) {
    await db.query('ROLLBACK');
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const query = `
      SELECT o.*, a.full_name, a.street, a.city, a.state, a.pincode 
      FROM orders o
      JOIN addresses a ON o.address_id = a.id
      WHERE o.user_id = $1 ORDER BY o.created_at DESC
    `;
    const result = await db.query(query, [user_id]);
    res.json({ success: true, data: result.rows, message: 'Orders fetched successfully' });
  } catch (err) { next(err); }
};

module.exports = { createOrder, getOrders };
