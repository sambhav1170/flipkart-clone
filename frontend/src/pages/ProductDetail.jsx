import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById, toggleWishlist, fetchProducts, fetchReviews, addReview } from '../api/api';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, Star, Zap, Heart, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Pincode functionality
  const [pincode, setPincode] = useState('');
  const [deliveryMsg, setDeliveryMsg] = useState('');

  // Reviews functionality
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const response = await fetchProductById(id);
        if (response.success) {
          setProduct(response.data);
          const primaryImg = response.data.images?.find(i => i.is_primary)?.image_url;
          setActiveImage(primaryImg || response.data.image_url || 'https://via.placeholder.com/500');
          setIsWishlisted(false);
          
          // Fetch similar products in same category
          const similarRes = await fetchProducts({ category_id: response.data.category_id });
          if (similarRes.success) {
            setSimilarProducts(similarRes.data.filter(p => p.id !== parseFloat(id)).slice(0, 5));
          }

          // Fetch reviews
          const reviewsRes = await fetchReviews(response.data.id);
          if (reviewsRes.success) {
            setReviews(reviewsRes.data);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
    
    // Scroll to top when id changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await addToCart(product.id, 1);
    setAddingToCart(false);
    navigate('/cart');
  };

  const handleBuyNow = async () => {
    setAddingToCart(true);
    await addToCart(product.id, 1);
    setAddingToCart(false);
    navigate('/checkout');
  };

  const handleWishlist = async () => {
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
      setIsWishlisted(isWishlisted);
    }
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length !== 6) {
      setDeliveryMsg('Invalid Pincode');
      return;
    }
    // Mock delivery dates
    const days = Math.floor(Math.random() * 4) + 2; // 2 to 5 days
    const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    setDeliveryMsg(`Delivery by ${date}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to submit a review");
      return;
    }
    setReviewSubmitLoading(true);
    try {
      const res = await addReview(product.id, { rating: userRating, comment: userComment });
      if (res.success) {
        alert("Review uploaded successfully!");
        setUserComment('');
        // Refresh reviews
        const updatedReviews = await fetchReviews(product.id);
        setReviews(updatedReviews.data);
      }
    } catch(err) {
      alert("Failed to submit review");
    } finally {
      setReviewSubmitLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading product details...</div>;
  if (!product) return <div className="p-8 text-center text-red-500">Product not found.</div>;

  return (
    <div className="bg-white max-w-[1700px] mx-auto min-h-screen border border-gray-100 p-4">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Images & Actions */}
        <div className="md:w-5/12 lg:w-4/12 flex flex-col-reverse md:flex-row gap-4 md:sticky top-[80px] h-fit mb-4 md:mb-0">
          {/* Thumbnails */}
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:w-16 snap-x hide-scrollbar pb-2 md:pb-0">
            {product.images?.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveImage(img.image_url)}
                className={`border rounded-sm h-16 w-16 p-1 cursor-pointer flex items-center justify-center ${activeImage === img.image_url ? 'border-flipkart-blue shadow-sm' : 'border-gray-200'}`}
              >
                <img src={img.image_url} className="max-h-full max-w-full object-contain" alt="" />
              </div>
            ))}
          </div>
          
          <div className="flex-1 flex flex-col gap-6">
            <div className="border border-gray-200 rounded-sm p-4 h-[400px] flex items-center justify-center relative hover:border-gray-300 transition group">
              <img 
                src={activeImage} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
              <button 
                onClick={handleWishlist}
                className={`absolute top-4 right-4 bg-white hover:bg-gray-50 p-2.5 rounded-full shadow-sm border border-gray-200 transition ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2.5} />
              </button>
            </div>
            {/* Buttons (Fixed for Mobile Symmetry) */}
            <div className="flex gap-2 font-bold text-xs sm:text-sm w-full">
              <button 
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 bg-[#ff9f00] hover:bg-[#ff9f00]/90 text-white py-3.5 px-4 rounded-sm flex items-center justify-center gap-2 transition shadow-md"
              >
                <ShoppingCart size={18} fill="currentColor" />
                {addingToCart ? 'ADDING...' : 'ADD TO CART'}
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={addingToCart}
                className="flex-1 bg-[#fb641b] hover:bg-[#ff5200] text-white py-3.5 px-4 rounded-sm flex items-center justify-center gap-2 transition shadow-md"
              >
                <Zap size={18} fill="currentColor" />
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-7/12 lg:w-8/12 pt-4">
          
          {/* Breadcrumbs */}
          <div className="flex items-center text-xs text-gray-500 font-medium mb-3">
            <Link to="/" className="hover:text-flipkart-blue transition">Home</Link>
            <ChevronRight size={14} className="mx-1" />
            <Link to={`/products?category_id=${product.category_id}`} className="hover:text-flipkart-blue transition">{product.category_name}</Link>
            {product.brand && (
              <>
                <ChevronRight size={14} className="mx-1" />
                <span className="hover:text-flipkart-blue transition cursor-pointer">{product.brand}</span>
              </>
            )}
            <ChevronRight size={14} className="mx-1" />
            <span className="text-gray-400 line-clamp-1 truncate">{product.name}</span>
          </div>

          <h1 className="text-xl md:text-2xl font-normal text-gray-900 mb-2 leading-tight mt-1">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-4">
            <span className="bg-green-600 text-white text-[13px] font-bold px-1.5 py-[2px] rounded-sm flex items-center gap-1 shadow-sm">
              {product.rating} <Star size={12} fill="currentColor" />
            </span>
            <span className="text-sm font-semibold text-gray-500">
              {product.rating_count?.toLocaleString() || 0} Ratings & Reviews
            </span>
            <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/fa_62673a.png" alt="f-assured" className="h-[21px]" />
          </div>

          <div className="mb-6">
            <span className="text-green-600 text-[13px] font-bold tracking-tight block mb-1">Special price</span>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-3xl font-bold text-gray-900 leading-none">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span className="text-base text-gray-500 line-through font-medium">₹{parseFloat(product.mrp).toLocaleString('en-IN')}</span>
                  <span className="text-base font-bold text-[#388e3c] tracking-tight">{product.discount_percent}% off</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-8 max-w-[300px]">
            <span className="text-sm font-semibold text-gray-800 flex flex-row items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              Delivery Options
            </span>
            <form onSubmit={handlePincodeCheck} className="flex border-b-2 border-flipkart-blue w-full relative">
              <input 
                type="text"
                placeholder="Enter Code"
                className="w-full py-1 focus:outline-none text-sm font-medium"
                maxLength="6"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
              />
              <button className="text-sm text-flipkart-blue font-bold px-4 hover:underline">Check</button>
            </form>
            {deliveryMsg && (
              <p className={`text-sm font-semibold ${deliveryMsg === 'Invalid Pincode' ? 'text-red-500' : 'text-gray-800'}`}>
                {deliveryMsg === 'Invalid Pincode' ? deliveryMsg : (<><span className="text-green-600 font-bold mr-1">Free</span>{deliveryMsg}</>)}
              </p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6 mt-4">
            <h3 className="text-lg font-bold mb-4">Product Description</h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-6 border border-gray-100 rounded-sm mb-8">
              {product.description}
            </p>
            
            {product.specifications && product.specifications.length > 0 && (
              <>
                <h3 className="text-lg font-bold mb-4">Specifications</h3>
                <div className="border border-gray-200 rounded-sm">
                  {product.specifications.map((spec, idx) => (
                    <div key={idx} className={`flex px-6 py-4 ${idx !== product.specifications.length - 1 ? 'border-b border-gray-100' : ''}`}>
                      <div className="w-1/3 text-gray-500 text-sm font-medium">{spec.spec_key}</div>
                      <div className="w-2/3 text-gray-900 text-sm">{spec.spec_value}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="border-t border-gray-200 pt-6 mt-8">
              <h3 className="text-lg font-bold mb-6 flex items-center justify-between">
                Ratings & Reviews
                <div className="flex items-center gap-2">
                  <span className="bg-green-600 text-white px-2 py-0.5 rounded-sm text-sm font-bold flex items-center gap-1">
                    {product.rating} <Star size={12} fill="white" />
                  </span>
                  <span className="text-sm text-gray-500 font-normal">{product.rating_count} Ratings & {reviews.length} Reviews</span>
                </div>
              </h3>

              {/* Write a Review box */}
              <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-sm">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm">Write a Review</h4>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm font-medium text-gray-600">Rate this product:</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        type="button" 
                        key={star} 
                        onClick={() => setUserRating(star)}
                        className={`text-xl focus:outline-none ${userRating >= star ? 'text-flipkart-yellow' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <textarea 
                  className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-flipkart-blue min-h-[80px]" 
                  placeholder="Description..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  required
                ></textarea>
                <button 
                  type="submit" 
                  disabled={reviewSubmitLoading}
                  className="bg-flipkart-blue hover:bg-blue-600 text-white font-semibold shadow-sm rounded-sm mt-3 px-8 py-2 text-sm transition"
                >
                  {reviewSubmitLoading ? "Submitting..." : "Submit Review"}
                </button>
              </form>

              {/* List Reviews */}
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-600 text-white px-1.5 py-0.5 rounded-sm text-[11px] font-bold flex items-center gap-0.5">
                        {review.rating} <Star size={10} fill="white" />
                      </span>
                      <span className="font-semibold text-gray-800 text-sm">{review.rating >= 4 ? 'Excellent' : review.rating === 3 ? 'Good' : 'Poor'}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{review.comment}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <span className="bg-gray-200 text-gray-400 rounded-full w-4 h-4 flex items-center justify-center">✓</span> {review.user_name}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{new Date(review.created_at).toLocaleDateString('en-IN', { year:'numeric', month:'short', day:'numeric' })}</span>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && <p className="text-gray-500 text-sm py-4">No reviews yet. Be the first to review this product!</p>}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <div className="mt-12 bg-white border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
            <h2 className="text-xl font-bold text-gray-900">Similar Products</h2>
            <Link to={`/products?category_id=${product.category_id}`} className="bg-flipkart-blue text-white px-4 py-2 font-semibold text-sm rounded-sm shadow-sm hover:shadow-md transition">VIEW ALL</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {similarProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
