const db = require('../config/db');

// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category_id, search } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name, i.image_url 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images i ON p.id = i.product_id AND i.is_primary = true
      WHERE 1=1
    `;
    let values = [];
    let paramCount = 1;
    
    if (req.query.category_id) {
      query += ` AND p.category_id = $${paramCount++}`;
      values.push(req.query.category_id);
    }
    
    if (req.query.search) {
      query += ` AND p.name LIKE $${paramCount++}`;
      values.push(`%${req.query.search}%`);
    }
    
    if (req.query.min_price) {
      query += ` AND p.price >= $${paramCount++}`;
      values.push(req.query.min_price);
    }
    
    if (req.query.max_price) {
      query += ` AND p.price <= $${paramCount++}`;
      values.push(req.query.max_price);
    }
    
    if (req.query.brands) {
      const brandList = req.query.brands.split(',');
      const placeholders = brandList.map(() => `$${paramCount++}`).join(',');
      query += ` AND p.brand IN (${placeholders})`;
      values.push(...brandList);
    }
    
    const sort = req.query.sort;
    if (sort === 'price_low') {
      query += ' ORDER BY p.price ASC';
    } else if (sort === 'price_high') {
      query += ' ORDER BY p.price DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY p.rating DESC';
    } else {
      query += ' ORDER BY p.id DESC';
    }
    
    const result = await db.query(query, values);
    
    res.json({ success: true, data: result.rows, message: 'Products fetched successfully' });
  } catch (err) { next(err); }
};

// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const productQuery = `
      SELECT p.*, c.name as category_name, i.image_url 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images i ON p.id = i.product_id AND i.is_primary = true
      WHERE p.id = $1
    `;
    const result = await db.query(productQuery, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found', data: {} });
    }
    
    const product = result.rows[0];
    
    const imagesQuery = 'SELECT image_url, is_primary FROM product_images WHERE product_id = $1 ORDER BY id ASC';
    const imagesResult = await db.query(imagesQuery, [id]);
    product.images = imagesResult.rows;
    
    const specsQuery = 'SELECT spec_key, spec_value FROM product_specifications WHERE product_id = $1';
    const specsResult = await db.query(specsQuery, [id]);
    product.specifications = specsResult.rows;
    
    res.json({ success: true, data: product, message: 'Product fetched successfully' });
  } catch (err) { next(err); }
};

module.exports = { getProducts, getProductById };
