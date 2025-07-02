import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Product } from '../types';

const PRODUCTS_COLLECTION = 'products';

export const productService = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get products by category
  async getProductsByCategory(category: Product['category']): Promise<Product[]> {
    try {
      console.log('🔥 Firestore query for category:', category);
      
      // Fetch all products and filter client-side for more reliability
      const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const allProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Product[];
      
      // Filter by category with case-insensitive matching
      const products = allProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      );
      
      console.log('🔥 Firestore returned', allProducts.length, 'total products');
      console.log('🔥 Filtered to', products.length, 'products for category "' + category + '"');
      console.log('🔥 All product categories in DB:', Array.from(new Set(allProducts.map(p => p.category))));
      console.log('🔥 Filtered product categories:', products.map(p => p.category));
      
      return products;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Get single product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Product;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Add new product
  async addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(id: string, productData: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...productData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Update product stock
  async updateProductStock(id: string, quantity: number): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await updateDoc(docRef, {
        stockQuantity: quantity
      });
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  },

  // Decrement product stock atomically
  async decrementProductStock(id: string, quantity: number): Promise<void> {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await runTransaction(db, async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists()) {
        throw new Error('Product does not exist');
      }
      const currentStock = productDoc.data().stockQuantity;
      if (currentStock < quantity) {
        throw new Error('Not enough stock available');
      }
      transaction.update(productRef, {
        stockQuantity: currentStock - quantity,
        updatedAt: serverTimestamp(),
      });
    });
  },
}; 