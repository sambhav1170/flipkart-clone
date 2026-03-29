import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, loading, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (loading) return <div className="p-8 text-center text-gray-500">Loading cart...</div>;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="bg-white p-8 max-w-4xl w-full flex flex-col items-center justify-center min-h-[400px] shadow-sm rounded-sm">
          <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="h-40 mb-6" />
          <h2 className="text-xl text-gray-800 font-medium mb-2">Your cart is empty!</h2>
          <p className="text-sm text-gray-500 mb-6">Explore our wide selection and find something you like</p>
          <Link to="/" className="bg-flipkart-blue text-white px-16 py-3 rounded-sm font-semibold shadow-sm hover:shadow-md transition">
            Shop now
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
  const originalTotal = cartItems.reduce((acc, item) => acc + (parseFloat(item.mrp || item.price) * item.quantity), 0);
  const discountAmount = originalTotal - totalAmount;

  return (
    <div className="container mx-auto px-2 md:px-4 py-6 max-w-[1240px]">
      <div className="flex flex-col lg:flex-row gap-4">
        
        {/* Cart Items List */}
        <div className="flex-grow bg-transparent lg:w-2/3">
          <div className="bg-white rounded-sm shadow-sm mb-4">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h1 className="text-lg font-semibold text-gray-900">Flipkart ({cartItems.length})</h1>
              <div className="text-sm flex items-center gap-1 font-medium bg-gray-50 px-3 py-1 rounded-sm border border-gray-200">
                Deliver to: <span className="font-bold">Bengaluru - 560103</span>
              </div>
            </div>
            
            {cartItems.map((item) => (
              <div key={item.cart_item_id} className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-6">
                <div className="w-28 flex flex-col items-center gap-4 shrink-0">
                  <div className="h-28 flex items-center justify-center p-2">
                    <img src={item.image_url || 'https://via.placeholder.com/300?text=No+Image'} alt={item.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex items-center border border-gray-300 rounded-sm">
                    <button className="px-3 py-0.5 text-lg font-medium hover:bg-gray-100 disabled:opacity-50" disabled={item.quantity <= 1}>-</button>
                    <div className="px-4 py-1 border-x border-gray-300 text-sm font-medium">{item.quantity}</div>
                    <button className="px-3 py-0.5 text-lg font-medium hover:bg-gray-100">+</button>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <Link to={`/products/${item.product_id}`} className="text-base text-gray-900 font-medium hover:text-flipkart-blue transition line-clamp-2 mb-1">
                    {item.name}
                  </Link>
                  {item.brand && <p className="text-sm text-gray-500 mb-4">Brand: {item.brand}</p>}
                  
                  <div className="flex items-end gap-3 mb-6">
                    {item.mrp && item.mrp > item.price && (
                      <span className="text-base text-gray-500 line-through font-medium">₹{parseFloat(item.mrp).toLocaleString('en-IN')}</span>
                    )}
                    <span className="text-xl font-bold text-gray-900 leading-none">₹{parseFloat(item.price).toLocaleString('en-IN')}</span>
                    {item.discount_percent && (
                      <span className="text-sm font-bold text-[#388e3c] tracking-tight">{item.discount_percent}% Off</span>
                    )}
                  </div>

                  <div className="flex items-center gap-6 font-semibold text-base">
                    <button className="uppercase hover:text-flipkart-blue transition">Save for later</button>
                    <button 
                      onClick={() => removeFromCart(item.product_id)} 
                      className="uppercase hover:text-flipkart-blue transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="p-4 bg-white sticky bottom-0 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-end rounded-b-sm">
              <button 
                onClick={() => navigate('/checkout')}
                className="bg-[#fb641b] hover:bg-[#ff5200] text-white px-10 py-3.5 rounded-sm font-semibold text-base shadow-sm transition"
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>

        {/* Price Details */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-sm shadow-sm sticky top-[80px]">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-gray-500 font-semibold uppercase tracking-wide text-sm">Price Details</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex justify-between text-base">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{originalTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Discount</span>
                <span className="text-green-600 font-medium">- ₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base">
                <span>Delivery Charges</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-dashed border-gray-300 pt-4 mt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-lg font-bold">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-green-50/50 rounded-b-sm">
              <p className="text-green-600 font-bold text-sm">
                You will save ₹{discountAmount.toLocaleString('en-IN')} on this order
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
