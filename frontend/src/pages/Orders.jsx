import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../api/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await fetchOrders();
        if (response.success) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1200px]">
      <div className="flex items-center gap-2 mb-6 text-sm font-medium">
        <Link to="/" className="text-gray-500 hover:text-flipkart-blue">Home</Link>
        <span className="text-gray-400">&gt;</span>
        <span className="text-gray-800">My Orders</span>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-sm shadow-sm border border-gray-200">
          <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty" className="h-32 mx-auto mb-6 opacity-60" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">You have no orders</h2>
          <Link to="/" className="inline-block mt-4 bg-flipkart-blue text-white px-8 py-2.5 rounded-sm font-semibold shadow-sm hover:shadow-md transition">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-0 rounded-sm shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer group">
              <div className="bg-gray-50/80 p-4 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center rounded-t-sm">
                <div>
                  <span className="text-sm text-gray-500 uppercase font-semibold mr-2">Order ID</span>
                  <span className="font-bold text-gray-800">#OD{String(order.id).padStart(10, '0')}</span>
                </div>
                <div className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-sm border border-gray-200">
                  Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block shadow-sm"></span>
                    <span className="font-bold text-gray-800 text-lg">{order.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 max-w-md line-clamp-2 leading-relaxed">
                    <span className="font-semibold text-gray-800 bg-gray-100 px-1 py-0.5 rounded-sm mr-1">Delivery to:</span> 
                    {order.full_name}, {order.street}, {order.city}, {order.state} - {order.pincode}
                  </p>
                </div>
                <div className="md:text-right border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 w-full md:w-auto">
                  <div className="text-2xl font-black text-gray-900 leading-none mb-1">₹{parseFloat(order.total_amount).toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-500 font-medium mb-3">Total Amount • {order.payment_method}</div>
                  <button className="text-flipkart-blue text-sm font-bold hover:underline group-hover:text-blue-600 flex items-center justify-start md:justify-end gap-1.5 transition">
                    Track your order
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
