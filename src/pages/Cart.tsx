import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalAmount,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleWhatsAppCheckout = async () => {
    if (items.length === 0) return;
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      // Check if user is authenticated
      if (!user) {
        setError('Please sign in to place an order.');
        setSaving(false);
        return;
      }
      
      console.log('Creating order with data:', {
        userId: user.uid,
        items: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
        totalAmount,
        status: 'pending'
      });
      
      // Save order in Firestore
      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      console.log("DEBUG ORDER:", {
        userId: user.uid,
        items: orderItems,
        totalAmount,
        status: 'pending',
      });
      const orderId = await orderService.createOrder({
        userId: user.uid,
        items: orderItems,
        totalAmount,
        status: 'pending',
      });
      
      console.log('Order created successfully with ID:', orderId);
      setSuccess('Order saved! You will be redirected to WhatsApp.');
      clearCart();
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(`Order could not be saved: ${err.message || 'Please try again.'}`);
      setSaving(false);
      return;
    }
    setSaving(false);
    // WhatsApp message
    const phone = '918309490753';
    let message = `Hello, I want to book the following items from TrueSoul:%0A`;
    items.forEach((item, idx) => {
      message += `%0A${idx + 1}. ${item.product.name} (x${item.quantity}) - ₹${(item.product.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    });
    message += `%0A%0ATotal: ₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    if (user) {
      message += `%0A%0AName: ${user.displayName || ''}`;
      message += `%0AEmail: ${user.email}`;
    } else {
      message += `%0A%0AName: [Enter your name]`;
    }
    message += `%0AAddress: [Enter your address]`;
    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/products" className="btn btn-primary">
          Shop Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h1>
      <div className="bg-white rounded-lg border border-gray-100 p-6 mb-8">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col md:flex-row items-center justify-between border-b border-gray-100 py-4 gap-4"
          >
            <div className="flex items-center gap-4 flex-1">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg border border-gray-100"
              />
              <div>
                <h2 className="text-lg font-semibold mb-1">{item.product.name}</h2>
                <p className="text-sm text-gray-500 mb-1">{item.product.category}</p>
                <span className="text-primary-600 font-bold">₹{item.product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-outline px-2 py-1"
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={e => updateQuantity(item.productId, Math.max(1, Number(e.target.value)))}
                className="w-12 text-center border border-gray-200 rounded"
              />
              <button
                className="btn btn-outline px-2 py-1"
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col items-end min-w-[100px]">
              <span className="text-lg font-bold text-gray-900">
                ₹{(item.product.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <button
                className="btn btn-outline mt-2 text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => removeFromCart(item.productId)}
              >
                <Trash2 className="w-4 h-4 mr-1" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-lg font-medium text-gray-700">
            Total Items: <span className="font-bold">{totalItems}</span>
          </span>
        </div>
        <div>
          <span className="text-2xl font-bold text-primary-600">
            Total: ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={clearCart}>
            Clear Cart
          </button>
          <button
            className="btn btn-primary"
            onClick={handleWhatsAppCheckout}
            disabled={items.length === 0 || saving}
          >
            {saving ? 'Saving...' : 'Checkout on WhatsApp'}
          </button>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mt-4 text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mt-4 text-center">
          {success}
        </div>
      )}
    </div>
  );
};

export default Cart; 