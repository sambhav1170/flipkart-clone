const db = require('../config/db');

const getWishlist = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const query = `
      SELECT w.id as wishlist_item_id, p.*, i.image_url 
      FROM wishlist_items w 
      JOIN products p ON w.product_id = p.id 
      LEFT JOIN product_images i ON p.id = i.product_id AND i.is_primary = true
      WHERE w.user_id = $1
      ORDER BY w.added_at DESC
    `;
    const result = await db.query(query, [user_id]);
    res.json({ success: true, data: result.rows, message: 'Wishlist fetched successfully' });
  } catch (err) { next(err); }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.id;
    
    const checkQuery = 'SELECT * FROM wishlist_items WHERE user_id = $1 AND product_id = $2';
    const checkResult = await db.query(checkQuery, [user_id, product_id]);
    
    if (checkResult.rows.length > 0) {
      // Remove from wishlist
      const deleteQuery = 'DELETE FROM wishlist_items WHERE user_id = $1 AND product_id = $2';
      await db.query(deleteQuery, [user_id, product_id]);
      res.json({ success: true, action: 'removed', message: 'Removed from wishlist' });
    } else {
      // Add to wishlist
      const insertQuery = 'INSERT INTO wishlist_items (user_id, product_id) VALUES ($1, $2)';
      await db.query(insertQuery, [user_id, product_id]);
      res.json({ success: true, action: 'added', message: 'Added to wishlist' });
    }
  } catch (err) { next(err); }
};

module.exports = { getWishlist, toggleWishlist };
