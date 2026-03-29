const db = require('../config/db');
const getCart = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const query = `
      SELECT c.id as cart_item_id, c.quantity, p.*, i.image_url 
      FROM cart_items c 
      JOIN products p ON c.product_id = p.id 
      LEFT JOIN product_images i ON p.id = i.product_id AND i.is_primary = true
      WHERE c.user_id = $1
      ORDER BY c.added_at DESC
    `;
    const result = await db.query(query, [user_id]);
    res.json({ success: true, data: result.rows, message: 'Cart fetched successfully' });
  } catch (err) { next(err); }
};

const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const user_id = req.user.id;
    const checkQuery = 'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2';
    const checkResult = await db.query(checkQuery, [user_id, product_id]);
    
    let result;
    if (checkResult.rows.length > 0) {
      const updateQuery = `UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *`;
      result = await db.query(updateQuery, [quantity, user_id, product_id]);
    } else {
      const insertQuery = `INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`;
      result = await db.query(insertQuery, [user_id, product_id, quantity]);
    }
    res.json({ success: true, data: result.rows[0], message: 'Item added to cart' });
  } catch (err) { next(err); }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const query = 'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *';
    const result = await db.query(query, [user_id, id]);
    res.json({ success: true, data: result.rows[0] || {}, message: 'Item removed from cart' });
  } catch (err) { next(err); }
};

module.exports = { getCart, addToCart, removeFromCart };
