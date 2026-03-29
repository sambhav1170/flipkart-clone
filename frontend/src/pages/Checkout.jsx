import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../api/api';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    pincode: '',
    state: '',
    city: '',
    street: ''
  });
  const [step, setStep] = useState('ADDRESS');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { cartItems, loadCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddressChange = async (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));

    // Auto-fill feature when pincode is 6 digits
    if (name === 'pincode' && value.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await response.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setAddress(prev => ({
            ...prev,
            city: postOffice.District,
            state: postOffice.State
          }));
        }
      } catch (err) {
        console.error("Failed to auto-fetch pincode details", err);
      }
    }
  };

  const handleDeliverHere = (e) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.pincode || !address.street || !address.city || !address.state) {
      setError('Please fill out all required address fields');
      return;
    }
    setError('');
    setStep('PAYMENT');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await placeOrder(address);
      if (response.success) {
        await loadCart();
        navigate('/order-success', { state: { orderId: response.data.id } });
      } else {
        setError(response.message || 'Failed to place order');
      }
    } catch (err) {
      setError('An error occurred while placing the order.');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center bg-white m-4 rounded-sm shadow-sm border border-gray-200 max-w-md mx-auto mt-20">
        <h2 className="text-xl font-bold mb-4">No items to checkout</h2>
        <button onClick={() => navigate('/')} className="text-flipkart-blue font-semibold hover:underline">Return to Shop</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1000px]">
      <div className="bg-white shadow-sm rounded-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side - Checkout Form */}
        <div className="md:w-2/3 p-0 border-r border-gray-200 bg-[#f1f3f6]">
          {/* Mock Steps */}
          <div className="bg-white px-6 py-4 mb-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4 text-gray-500 font-medium">
              <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-sm text-xs border border-gray-300 shadow-sm">1</span> LOGIN
            </div>
            <span className="text-sm font-semibold">Test User (test@example.com)</span>
          </div>

          <div className={`bg-flipkart-blue px-6 py-4 flex items-center justify-between shadow-sm transition-colors ${step === 'ADDRESS' ? 'bg-flipkart-blue text-white' : 'bg-white border-b text-gray-500'}`}>
            <div className="flex items-center gap-4 font-medium">
              <span className={`px-2 py-0.5 rounded-sm text-xs font-bold border shadow-sm ${step === 'ADDRESS' ? 'bg-white text-flipkart-blue' : 'bg-gray-200 text-gray-600 border-gray-300'}`}>2</span> DELIVERY ADDRESS
            </div>
            {step === 'PAYMENT' && <button onClick={() => setStep('ADDRESS')} className="text-sm font-semibold text-flipkart-blue hover:underline">CHANGE</button>}
          </div>
          
          {step === 'ADDRESS' && (
            <div className="bg-white px-8 py-6 mb-4 shadow-sm border-b border-gray-200">
              {error && <div className="mb-4 text-red-600 text-sm font-medium p-3 bg-red-50 border border-red-200 rounded-sm">{error}</div>}
              
              <form onSubmit={handleDeliverHere}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[13px] font-medium text-gray-500 mb-1">Name</label>
                    <input type="text" name="fullName" value={address.fullName} onChange={handleAddressChange} className="w-full border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-flipkart-blue text-sm" required />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-500 mb-1">10-digit mobile number</label>
                    <input type="tel" name="phone" value={address.phone} onChange={handleAddressChange} className="w-full border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-flipkart-blue text-sm" required maxLength="10" minLength="10" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-500 mb-1">Pincode (Auto-fills City/State)</label>
                    <input type="text" name="pincode" value={address.pincode} onChange={handleAddressChange} className="w-full border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-flipkart-blue text-sm" required maxLength="6" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-500 mb-1">City/District/Town</label>
                    <input type="text" name="city" value={address.city} onChange={handleAddressChange} className="w-full border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-flipkart-blue text-sm bg-gray-50" required />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-gray-500 mb-1">State</label>
                    <input type="text" name="state" value={address.state} onChange={handleAddressChange} className="w-full border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-flipkart-blue text-sm bg-gray-50" required />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-[13px] font-medium text-gray-500 mb-1">Address (Area and Street)</label>
                  <textarea 
                    name="street"
                    className="w-full border border-gray-300 rounded-sm p-3 focus:outline-none focus:border-flipkart-blue text-sm min-h-[80px]"
                    value={address.street}
                    onChange={handleAddressChange}
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="bg-[#fb641b] hover:bg-[#ff5200] text-white px-10 py-3.5 rounded-sm font-semibold shadow-sm transition text-base"
                >
                  DELIVER HERE
                </button>
              </form>
            </div>
          )}

          <div className="bg-white px-6 py-4 mb-4 flex items-center justify-between shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 text-gray-500 font-medium">
              <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-sm text-xs border border-gray-300 shadow-sm">3</span> ORDER SUMMARY
            </div>
          </div>
          
          <div className={`px-6 py-4 shadow-sm border-t border-gray-200 transition-colors ${step === 'PAYMENT' ? 'bg-flipkart-blue text-white' : 'bg-white text-gray-500'}`}>
            <div className={`flex items-center gap-4 font-medium`}>
              <span className={`px-2 py-0.5 rounded-sm text-xs font-bold border shadow-sm ${step === 'PAYMENT' ? 'bg-white text-flipkart-blue' : 'bg-gray-200 text-gray-600 border-gray-300'}`}>4</span> PAYMENT OPTIONS
            </div>
          </div>

          {step === 'PAYMENT' && (
            <div className="bg-white p-6 shadow-sm border border-gray-100">
              {error && <div className="mb-4 text-red-600 text-sm font-medium p-3 bg-red-50 border border-red-200 rounded-sm">{error}</div>}
              <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
                
                <label className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition ${paymentMethod === 'UPI' ? 'border-flipkart-blue bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="UPI" onChange={() => setPaymentMethod('UPI')} className="w-4 h-4 text-flipkart-blue" />
                  <span className="font-medium text-gray-800">UPI (Google Pay, PhonePe)</span>
                </label>

                <label className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition ${paymentMethod === 'CARD' ? 'border-flipkart-blue bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="CARD" onChange={() => setPaymentMethod('CARD')} className="w-4 h-4 text-flipkart-blue" />
                  <span className="font-medium text-gray-800">Credit / Debit / ATM Card</span>
                </label>

                <label className={`flex items-center gap-3 p-4 border rounded-sm cursor-pointer transition ${paymentMethod === 'COD' ? 'border-flipkart-blue bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <input type="radio" name="payment" value="COD" onChange={() => setPaymentMethod('COD')} className="w-4 h-4 text-flipkart-blue" />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">Cash on Delivery</span>
                    <span className="text-xs text-gray-500">Pay inside by Cash or UPI on exact delivery</span>
                  </div>
                </label>

                <button 
                  type="submit" 
                  disabled={loading || !paymentMethod}
                  className="mt-4 w-[250px] bg-[#fb641b] hover:bg-[#ff5200] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-10 py-3.5 rounded-sm font-semibold shadow-sm transition text-base uppercase"
                >
                  {loading ? 'Processing...' : `Pay ₹${totalAmount.toLocaleString('en-IN')}`}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Side - Cart Summary */}
        <div className="md:w-1/3 p-6 bg-white min-h-full">
          <h3 className="text-gray-500 font-semibold uppercase tracking-wide text-sm mb-4 border-b border-gray-200 pb-4">Order Summary</h3>
          <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-3">
            <span>Price ({cartItems.length} items)</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-medium text-gray-700 mb-4 pb-4 border-b border-gray-200">
            <span>Delivery Charges</span>
            <span className="text-green-600 font-bold">Free</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold text-gray-800 border-b border-gray-200 pb-4 mb-4">
            <span>Total Payable</span>
            <span>₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          
          <div className="mt-8 flex items-center gap-2 p-3 bg-green-50 rounded-sm border border-green-200">
            <img src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/shield_b33c0c.svg" alt="safe" className="h-6" />
            <p className="text-xs text-gray-600 font-medium">
              Safe and Secure Payments. Easy returns. 100% Authentic products.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
