import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { toggleWishlist } from '../api/api';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault(); // Prevent navigating to product detail
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to add to wishlist");
      return;
    }

    setIsWishlisted(!isWishlisted);
    try {
      const res = await toggleWishlist(product.id);
      if (res.action === 'added') setIsWishlisted(true);
      if (res.action === 'removed') setIsWishlisted(false);
    } catch (err) {
      setIsWishlisted(isWishlisted); // Revert on fail
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="bg-white rounded-sm hover:shadow-lg transition-shadow duration-200 relative p-4 h-full flex flex-col border border-gray-100 hover:border-transparent">
        
        <button 
          onClick={handleWishlist}
          className={`absolute top-4 right-4 z-10 transition ${isWishlisted ? 'text-red-500' : 'text-gray-300 hover:text-gray-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>

        {product.rating >= 4.4 && (
          <div className="absolute top-0 left-0 bg-[#fb641b] text-white text-[10px] uppercase font-bold px-2 py-0.5 shadow-sm rounded-br-sm z-10">
            Bestseller
          </div>
        )}

        <div className="h-48 flex items-center justify-center mb-4 p-2 relative group-hover:scale-[1.03] transition-transform duration-300">
          <img 
            src={product.image_url || 'https://via.placeholder.com/300?text=No+Image'} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain mix-blend-multiply"
          />
        </div>

        <div className="flex flex-col flex-grow justify-start">
          {product.brand && (
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 opacity-80">
              {product.brand}
            </div>
          )}
          
          <h3 className="text-sm font-medium text-gray-800 hover:text-flipkart-blue transition mb-1 leading-snug line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2 pt-1">
            <span className="bg-green-600 text-white text-[11px] font-bold px-1.5 py-[2px] rounded-[3px] flex items-center gap-0.5 shadow-sm">
              {product.rating} <Star size={10} fill="currentColor" />
            </span>
            <span className="text-xs font-semibold text-gray-500">
              ({product.rating_count?.toLocaleString() || 0})
            </span>
            <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/fa_62673a.png" alt="f-assured" className="h-[15px] ml-1" />
          </div>

          <div className="mt-auto pt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg font-bold text-gray-900 leading-none">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="text-[13px] text-gray-500 line-through font-medium">₹{parseFloat(product.mrp).toLocaleString('en-IN')}</span>
                  <span className="text-[13px] font-bold text-[#388e3c] tracking-tight">{product.discount_percent}% off</span>
                </>
              )}
            </div>
            {product.stock && product.stock < 10 && (
               <div className="text-xs text-red-500 font-medium mt-1">Only {product.stock} left</div>
            )}
            <div className="text-xs text-black font-medium mt-1">Free delivery</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
