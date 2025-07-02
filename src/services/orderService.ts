import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Order, CartItem } from '../types';
import { productService } from './productService';

const ORDERS_COLLECTION = 'orders';

export const orderService = {
  // Get all orders (admin only)
  async getAllOrders(): Promise<Order[]> {
    try {
      const q = query(collection(db, ORDERS_COLLECTION), orderBy('orderDate', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        orderDate: doc.data().orderDate?.toDate() || new Date(),
      })) as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get orders for a specific user
  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION), 
        where('userId', '==', userId),
        orderBy('orderDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        orderDate: doc.data().orderDate?.toDate() || new Date(),
      })) as Order[];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Get single order by ID
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          orderDate: data.orderDate?.toDate() || new Date(),
        } as Order;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Create new order
  async createOrder(orderData: { userId: string; items: { productId: string; quantity: number }[]; totalAmount: number; status: Order['status']; shippingAddress?: any }): Promise<string> {
    try {
      // Update product stock quantities
      for (const item of orderData.items) {
        const product = await productService.getProductById(item.productId);
        if (product) {
          const newStock = product.stockQuantity - item.quantity;
          if (newStock < 0) {
            throw new Error(`Insufficient stock for ${product.name}`);
          }
          await productService.updateProductStock(item.productId, newStock);
        }
      }

      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
        ...orderData,
        orderDate: serverTimestamp(),
        ...(orderData.shippingAddress ? { shippingAddress: orderData.shippingAddress } : {}),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order status
  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, id);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Cancel order and restore stock
  async cancelOrder(id: string): Promise<void> {
    try {
      const order = await this.getOrderById(id);
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status === 'delivered') {
        throw new Error('Cannot cancel delivered order');
      }

      // Restore product stock quantities
      for (const item of order.items) {
        const product = await productService.getProductById(item.productId);
        if (product) {
          const newStock = product.stockQuantity + item.quantity;
          await productService.updateProductStock(item.productId, newStock);
        }
      }

      // Update order status to cancelled
      await this.updateOrderStatus(id, 'cancelled');
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },
}; 