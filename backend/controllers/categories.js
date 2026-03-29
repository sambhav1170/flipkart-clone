const db = require('../config/db');

// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY id');
    
    res.json({
      success: true,
      data: result.rows,
      message: 'Categories fetched successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories
};
