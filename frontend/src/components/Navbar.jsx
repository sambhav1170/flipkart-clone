import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, ChevronDown } from 'lucide-react';
import api from '../api/api';
import { CartContext } from '../context/CartContext';
import LoginModal from './LoginModal';

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const delayFn = setTimeout(() => {
        api.get(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
          .then(res => {
            if (res.data.success) {
              setSearchResults(res.data.data.slice(0, 6));
              setShowResults(true);
            }
          })
          .catch(err => console.error(err));
      }, 300);
      return () => clearTimeout(delayFn);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => {
          if (res.data.success) setUser(res.data.data.name);
        })
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowResults(false);
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="bg-flipkart-blue fixed top-0 w-full z-50 shadow-sm border-b border-white/10 hidden md:block" style={{ height: '64px' }}>
      <div className="container mx-auto px-4 lg:px-12 h-full flex items-center justify-between gap-6">
        
        {/* Logo */}
        <Link to="/" className="flex flex-col items-center min-w-min">
          <div className="text-white font-black italic text-[22px] tracking-tight leading-none mb-0.5">
            Flipkart
          </div>
          <div className="text-gray-200 text-[11px] italic flex items-center gap-1 hover:underline">
            Explore <span className="text-flipkart-yellow font-bold">Plus</span>
            <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/plus_aef861.png" alt="plus" className="h-[10px]" />
          </div>
        </Link>
        
        {/* Search Bar */}
        <div className="flex-grow max-w-[550px] ml-4">
          <form onSubmit={handleSearch} className="relative w-full shadow-md rounded-sm bg-white" onBlur={() => setTimeout(() => setShowResults(false), 200)}>
            <div className="flex w-full overflow-hidden rounded-sm relative z-20">
              <input 
                type="text" 
                placeholder="Search for products, brands and more"
                className="w-full py-2.5 px-4 pr-12 focus:outline-none text-gray-800 text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setShowResults(true); }}
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-3 text-flipkart-blue flex items-center justify-center hover:bg-gray-100 transition z-10">
                <Search size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            {/* Live Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 rounded-b-sm max-h-[400px] overflow-y-auto z-50">
                {searchResults.map(product => (
                  <Link 
                    to={`/products/${product.id}`} 
                    key={product.id}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 border-b border-gray-50 transition"
                    onClick={() => { setShowResults(false); setSearchTerm(''); }}
                  >
                    <img src={product.image_url} alt={product.name} className="h-10 w-10 object-contain" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</span>
                      <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">in {product.category_name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 justify-end ml-auto text-white font-medium text-base">
          {user ? (
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-gray-200 transition group relative">
              <User size={20} strokeWidth={2.5} />
              <span className="text-sm font-semibold capitalize flex items-center">{user} <ChevronDown size={14} className="ml-1"/></span>
              
              {/* Dropdown Logout */}
              <div className="absolute top-10 right-0 w-36 bg-white rounded-sm shadow-xl hidden group-hover:flex flex-col text-gray-800 text-sm overflow-hidden z-50">
                <button 
                  onClick={() => navigate('/wishlist')}
                  className="px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 font-medium flex items-center justify-between"
                >
                  Wishlist <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/'; // Hard reload to purge all context memory
                  }}
                  className="px-4 py-3 text-left hover:bg-gray-50 font-medium text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setLoginModalOpen(true)}
              className="bg-white text-flipkart-blue px-10 py-1 rounded-sm shadow-sm font-semibold hover:bg-gray-50 transition border border-gray-200"
            >
              Login
            </button>
          )}
          
          <Link to="/products" className="hidden lg:block hover:text-gray-200 transition font-semibold">
            Products
          </Link>
          
          <Link to="/orders" className="hidden lg:block hover:text-gray-200 transition font-semibold">
            Orders
          </Link>

          <Link to="/cart" className="flex items-center gap-2 hover:text-gray-200 transition font-semibold">
            <div className="relative">
              <ShoppingCart size={20} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-flipkart-yellow text-black text-[11px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold px-1 border-2 border-flipkart-blue shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            Cart
          </Link>
        </div>
      </div>
      
      {/* Login Modal Overlay */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        onLogin={(username) => setUser(username)} 
      />
    </nav>
  );
};

export default Navbar;
