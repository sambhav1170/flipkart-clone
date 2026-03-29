import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = (email, password) => api.post('/auth/login', { email, password }).then(res => res.data);
export const registerUser = (userData) => api.post('/auth/register', userData).then(res => res.data);
export const requestOtp = (identifier) => api.post('/auth/otp-request', { identifier }).then(res => res.data);
export const verifyOtp = (identifier, otp) => api.post('/auth/otp-verify', { identifier, otp }).then(res => res.data);

export const fetchProducts = (filters = {}) => {
  const { category_id, search, min_price, max_price, brands, sort } = filters;
  let url = '/products';
  const params = new URLSearchParams();
  
  if (category_id) params.append('category_id', category_id);
  if (search) params.append('search', search);
  if (min_price) params.append('min_price', min_price);
  if (max_price) params.append('max_price', max_price);
  if (brands && brands.length > 0) params.append('brands', brands.join(','));
  if (sort) params.append('sort', sort);

  if (params.toString()) url += `?${params.toString()}`;
  return api.get(url).then(res => res.data);
};

export const fetchProductById = (id) => api.get(`/products/${id}`).then(res => res.data);
export const fetchCategories = () => api.get('/categories').then(res => res.data);
export const fetchCart = () => api.get('/cart').then(res => res.data);
export const addToCart = (product_id, quantity) => api.post('/cart', { product_id, quantity }).then(res => res.data);
export const removeFromCart = (id) => api.delete(`/cart/${id}`).then(res => res.data);
export const placeOrder = (shipping_address) => api.post('/orders', { shipping_address }).then(res => res.data);
export const fetchOrders = () => api.get('/orders').then(res => res.data);

export const fetchWishlist = () => api.get('/wishlists').then(res => res.data);
export const toggleWishlist = (product_id) => api.post('/wishlists/toggle', { product_id }).then(res => res.data);

// Reviews
export const fetchReviews = (productId) => api.get(`/reviews/${productId}`).then(res => res.data);
export const addReview = (productId, reviewData) => api.post(`/reviews/${productId}`, reviewData).then(res => res.data);

export default api;
