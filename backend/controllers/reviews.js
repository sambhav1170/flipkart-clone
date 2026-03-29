const db = require('../config/db');

const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const query = `
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.product_id = $1 
      ORDER BY r.created_at DESC
    `;
    const result = await db.query(query, [productId]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    next(err);
  }
};

const addReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id; // from auth protect

    // Insert or update review
    const query = `
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT(user_id, product_id) 
      DO UPDATE SET rating = excluded.rating, comment = excluded.comment
      RETURNING *
    `;
    const result = await db.query(query, [user_id, productId, rating, comment]);

    // Recalculate average rating for the product
    const avgQuery = `SELECT ROUND(AVG(rating), 1) as avg_rating, COUNT(id) as cnt FROM reviews WHERE product_id = $1`;
    const avgResult = await db.query(avgQuery, [productId]);
    
    // Update products table
    const newAvg = avgResult.rows[0].avg_rating || 4.0;
    const newCount = avgResult.rows[0].cnt || 100;
    await db.query(`UPDATE products SET rating = $1, rating_count = $2 WHERE id = $3`, [newAvg, newCount, productId]);

    res.status(201).json({ success: true, data: result.rows[0], message: 'Review added successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProductReviews, addReview };
