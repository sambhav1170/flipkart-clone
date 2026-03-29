import { useLocation, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="bg-white p-10 max-w-lg w-full rounded-sm shadow-md text-center border-t-4 border-green-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600 font-medium mb-6">Thank you for shopping with Flipkart Clone.</p>
        
        {orderId && (
          <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 mb-8 inline-block w-full">
            <p className="text-sm text-gray-500 uppercase font-semibold mb-1">Order ID</p>
            <p className="text-xl font-bold text-gray-900">#OD{String(orderId).padStart(10, '0')}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/orders" className="text-flipkart-blue font-semibold border border-flipkart-blue hover:bg-blue-50 px-6 py-2.5 rounded-sm transition">
            View Orders
          </Link>
          <Link to="/" className="bg-flipkart-blue text-white font-semibold hover:bg-blue-600 px-6 py-2.5 rounded-sm shadow-sm transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
