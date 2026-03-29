const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const exportUsersLive = require('../export_users'); // Live JSON Syncer

const JWT_SECRET = process.env.JWT_SECRET || 'flipkart_super_secret_key_123';

const register = async (req, res, next) => {
  try {
    let { name, email, password, phone } = req.body;
    
    // Normalize Email to lowercase
    email = email ? email.toLowerCase().trim() : '';

    // Exact Data Validation Rules
    if (!name || name.trim().length < 3) return res.status(400).json({ success: false, message: 'Name must be at least 3 characters long!' });
    if (!password || password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters!' });
    
    // Strict EMail Validation Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a strictly valid email format (e.g. myname@gmail.com)!' });
    }
    
    // Strict 10-Digit Phone Number Regex
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: 'Please provide an exact 10-digit numeric phone number!' });
    }

    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'This email is already registered to another user!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertQuery = `INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`;
    const result = await db.query(insertQuery, [name, email, hashedPassword, phone]);
    const user = result.rows[0];

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    // Instantly Sync Database to Live JSON File
    await exportUsersLive();

    res.json({ success: true, data: { user, token }, message: 'Registration successful' });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    
    // Normalize Email to lowercase
    email = email ? email.toLowerCase().trim() : '';
    
    const result = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    delete user.password;
    
    res.json({ success: true, data: { user, token }, message: 'Login successful' });
  } catch (err) { next(err); }
};

const requestOtp = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ success: false, message: 'Email or phone required' });
    
    // In production, we would integrate SMS/Email gateway.
    res.json({ success: true, message: `Mock OTP sent to ${identifier}! Please use: 123456` });
  } catch (err) { next(err); }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { identifier, otp } = req.body;
    if (otp !== '123456') {
      return res.status(401).json({ success: false, message: 'Invalid OTP. Please use 123456' });
    }

    let userResult = await db.query('SELECT * FROM users WHERE email = $1 OR phone = $2', [identifier, identifier]);
    let user;

    if (userResult.rows.length === 0) {
      const isEmail = identifier.includes('@');
      const email = isEmail ? identifier : null;
      const phone = !isEmail ? identifier : null;
      
      const insertQuery = `INSERT INTO users (name, email, phone, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone, role`;
      const newRes = await db.query(insertQuery, ['Guest Config', email, phone, 'customer']);
      user = newRes.rows[0];
    } else {
      user = userResult.rows[0];
      delete user.password;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, data: { user, token }, message: 'OTP verified successfully' });
  } catch (err) { next(err); }
};

const getMe = async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, name, email, phone, role FROM users WHERE id = $1', [req.user.id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { next(err); }
};

module.exports = { register, login, requestOtp, verifyOtp, getMe };
