import React, { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { Product, Order, User } from '../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const emptyProduct = {
  name: '',
  description: '',
  price: 0,
  category: 'Rice',
  imageUrl: '',
  stockQuantity: 0,
  unit: '',
};

const AdminDashboard: React.FC = () => {
  // Product state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<any>(emptyProduct);
  const [productFormLoading, setProductFormLoading] = useState(false);

  // Order state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderStatusLoading, setOrderStatusLoading] = useState<string>('');

  // User and product maps for display
  const [userMap, setUserMap] = useState<{ [uid: string]: User }>({});
  const [productMap, setProductMap] = useState<{ [pid: string]: Product }>({});

  // Load users for display
  const loadUsers = async () => {
    const snap = await getDocs(collection(db, 'users'));
    const map: { [uid: string]: User } = {};
    snap.forEach(doc => {
      const data = doc.data();
      map[doc.id] = {
        uid: doc.id,
        email: data.email,
        displayName: data.displayName,
        isAdmin: data.isAdmin,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      };
    });
    setUserMap(map);
  };
  // Load all products for product name lookup
  const loadProductMap = async () => {
    const allProducts = await productService.getAllProducts();
    const map: { [pid: string]: Product } = {};
    allProducts.forEach(p => { map[p.id] = p; });
    setProductMap(map);
  };

  // Load products
  const loadProducts = async () => {
    setLoadingProducts(true);
    setProductError(null);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err: any) {
      setProductError('Failed to load products.');
    } finally {
      setLoadingProducts(false);
    }
  };

  // Load orders
  const loadOrders = async () => {
    setLoadingOrders(true);
    setOrderError(null);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err: any) {
      setOrderError('Failed to load orders.');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadUsers();
    loadProductMap();
  }, []);

  // Product form handlers
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setShowProductModal(true);
  };
  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setShowProductModal(true);
  };
  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setProductForm(emptyProduct);
  };
  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };
  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormLoading(true);
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productForm);
      } else {
        await productService.addProduct(productForm);
      }
      closeProductModal();
      loadProducts();
      loadProductMap();
    } catch (err) {
      alert('Failed to save product.');
    } finally {
      setProductFormLoading(false);
    }
  };
  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      loadProducts();
      loadProductMap();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  // Order handlers
  const handleOrderStatusChange = async (id: string, status: Order['status']) => {
    setOrderStatusLoading(id);
    try {
      await orderService.updateOrderStatus(id, status);
      loadOrders();
    } catch (err) {
      alert('Failed to update order status.');
    } finally {
      setOrderStatusLoading('');
    }
  };
  const handleCancelOrder = async (id: string) => {
    if (!window.confirm('Cancel this order? This will restore stock.')) return;
    setOrderStatusLoading(id);
    try {
      await orderService.cancelOrder(id);
      loadOrders();
    } catch (err) {
      alert('Failed to cancel order.');
    } finally {
      setOrderStatusLoading('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
      {/* Product Management */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Products</h2>
          <button className="btn btn-primary" onClick={openAddProduct}>Add Product</button>
        </div>
        {productError && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">{productError}</div>}
        {loadingProducts ? (
          <div className="text-center text-gray-500">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-100 rounded-lg bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-2 font-semibold text-gray-700">Category</th>
                  <th className="px-4 py-2 font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-2 font-semibold text-gray-700">Stock</th>
                  <th className="px-4 py-2 font-semibold text-gray-700">Unit</th>
                  <th className="px-4 py-2 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 font-medium">{product.name}</td>
                    <td className="px-4 py-2">{product.category}</td>
                    <td className="px-4 py-2">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2">{product.stockQuantity}</td>
                    <td className="px-4 py-2">{product.unit}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button className="btn btn-outline btn-sm" onClick={() => openEditProduct(product)}>Edit</button>
                      <button className="btn btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative border border-gray-100">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={closeProductModal}>&times;</button>
            <h3 className="text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <form className="space-y-4" onSubmit={handleProductFormSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input name="name" value={productForm.name} onChange={handleProductFormChange} className="input w-full" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" value={productForm.description} onChange={handleProductFormChange} className="input w-full" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (INR)</label>
                  <input name="price" type="number" min={0} value={productForm.price} onChange={handleProductFormChange} className="input w-full" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input name="stockQuantity" type="number" min={0} value={productForm.stockQuantity} onChange={handleProductFormChange} className="input w-full" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select name="category" value={productForm.category} onChange={handleProductFormChange} className="input w-full" required>
                    <option value="Rice">Rice</option>
                    <option value="Groundnuts">Groundnuts</option>
                    <option value="Sunflower Oil">Sunflower Oil</option>
                    <option value="Groundnut Oil">Groundnut Oil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit</label>
                  <input name="unit" value={productForm.unit} onChange={handleProductFormChange} className="input w-full" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input name="imageUrl" value={productForm.imageUrl} onChange={handleProductFormChange} className="input w-full" required />
              </div>
              <button type="submit" className="btn btn-primary w-full" disabled={productFormLoading}>
                {productFormLoading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Order Management */}
      <section>
        <div className="flex items-center justify-between mb-4 mt-12">
          <h2 className="text-2xl font-bold">Orders</h2>
        </div>
        {orderError && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">{orderError}</div>}
        {loadingOrders ? (
          <div className="text-center text-gray-500">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Products</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="px-4 py-2 font-mono text-xs">{order.id}</td>
                    <td className="px-4 py-2">{userMap[order.userId]?.displayName || userMap[order.userId]?.email || order.userId}</td>
                    <td className="px-4 py-2">{order.orderDate?.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <select
                        value={order.status}
                        onChange={e => handleOrderStatusChange(order.id, e.target.value as Order['status'])}
                        className="input"
                        disabled={orderStatusLoading === order.id}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 font-bold text-primary-600">₹{order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-2">
                      <ul className="list-disc ml-4">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {productMap[item.productId]?.name || item.productId} (x{item.quantity})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button className="btn btn-outline btn-sm" onClick={() => handleOrderStatusChange(order.id, order.status)} disabled={orderStatusLoading === order.id}>Update</button>
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button className="btn btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleCancelOrder(order.id)} disabled={orderStatusLoading === order.id}>Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard; 