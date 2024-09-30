import React, { useEffect, useState } from 'react';
import '../Assets/css/Userdetails.css'; // Ensure this CSS file has relevant styles or use Tailwind CSS
import axios from '../api/api';

export default function Userorder() {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const response = await axios.get('/fetchorderapi', {
        headers: {
          'x-access-token': localStorage.getItem('token'),
        },
      });
      setOrders(response.data.orders);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const cancelOrder = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await axios.delete(`/deleteorderapi/${id}`, {
          headers: {
            'x-access-token': localStorage.getItem('token'),
          },
        });
        getOrders();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-6 w-11/12 m-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Order Details</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OrderId</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((item, index) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.paymentMethod}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.orderStatus}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.paymentStatus}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {item.paymentStatus !== 'Paid' && (
                      <button
                        onClick={() => cancelOrder(item._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
