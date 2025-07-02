import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { Order, Product } from '../types';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productMap, setProductMap] = useState<{ [id: string]: Product }>({});

  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const [ordersData, products] = await Promise.all([
          orderService.getUserOrders(user.uid),
          productService.getAllProducts(),
        ]);
        setOrders(ordersData);
        const map: { [id: string]: Product } = {};
        products.forEach((p) => (map[p.id] = p));
        setProductMap(map);
      } catch (err: any) {
        console.error('Error fetching orders/products:', err);
        setError('Failed to fetch orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersAndProducts();
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>
      {loading && (
        <div className="text-center text-gray-500">Loading orders...</div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center mb-4">{error}</div>
      )}
      {!loading && orders.length === 0 && (
        <div className="text-center text-gray-500">You have not placed any orders yet.</div>
      )}
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-xl p-6 bg-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div>
                <span className="font-semibold">Order ID:</span> <span className="text-gray-700">{order.id}</span>
              </div>
              <div>
                <span className="font-semibold">Status:</span> <span className="capitalize text-primary-600 font-medium">{order.status}</span>
              </div>
              <div>
                <span className="font-semibold">Date:</span> <span className="text-gray-700">{order.orderDate?.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="font-semibold">Items:</span>
              <ul className="list-disc ml-6 mt-1">
                {order.items.map((item, idx) => {
                  const product = productMap[item.productId];
                  return (
                    <li key={idx} className="text-gray-700">
                      {product ? (
                        <>
                          {product.name} (x{item.quantity}) - ₹{(product.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </>
                      ) : (
                        <>Product not found (x{item.quantity})</>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="mt-2">
              <span className="font-semibold">Total:</span> <span className="text-lg font-bold text-primary-600">₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {order.shippingAddress && (
              <div className="mt-2 text-gray-600">
                <span className="font-semibold">Shipping Address:</span> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}, {order.shippingAddress.country}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders; 