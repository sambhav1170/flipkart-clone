import { useState, useEffect } from 'react';
import { fetchWishlist, toggleWishlist } from '../api/api';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = async () => {
    try {
      const response = await fetchWishlist();
      if (response.success) {
        setWishlistItems(response.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const response = await toggleWishlist(productId);
      if (response.success) {
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist ({wishlistItems.length})</h1>
        
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading wishlist...</div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlistItems.map(product => (
              <div key={product.wishlist_item_id} className="relative group">
                <ProductCard product={product} />
                <button 
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-3 right-3 bg-white hover:bg-gray-100 p-2 rounded-full shadow-md z-20 text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-sm shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Empty Wishlist</h2>
            <p className="text-gray-500 mb-6">You have no items in your wishlist. Start adding!</p>
            <a href="/products" className="bg-flipkart-blue text-white px-8 py-2 rounded-sm font-semibold hover:shadow-md transition">Explore Products</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
