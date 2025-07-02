import { GoogleGenerativeAI } from '@google/generative-ai';
import { Product } from '../types';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');

export class GeminiService {
  private static instance: GeminiService;
  private products: Product[] = [];
  private model: any;

  private constructor() {
    try {
      // Use the latest Gemini model
      this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      console.log('Gemini model initialized successfully with gemini-2.0-flash');
    } catch (error) {
      console.error('Error initializing Gemini model:', error);
      this.model = null;
    }
  }

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  setProducts(products: Product[]) {
    this.products = products;
  }

  async processQuery(query: string): Promise<string> {
    try {
      // Check if API key is configured
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      console.log('API Key configured:', !!apiKey, 'Length:', apiKey?.length);
      
      if (!apiKey || apiKey === '') {
        console.error('Gemini API key not configured');
        return "Gemini AI is not configured. Please add your REACT_APP_GEMINI_API_KEY to the .env file. See GEMINI_SETUP.md for instructions.";
      }

      // Create a comprehensive context with product information
      const context = this.createContext();
      console.log('Context created, products count:', this.products.length);
      
      // Create the prompt for Gemini
      const prompt = this.createPrompt(query, context);
      console.log('Prompt created, length:', prompt.length);
      
      console.log('Attempting to call Gemini API...');
      
      if (!this.model) {
        throw new Error('Gemini model not initialized properly');
      }
      
      // Generate response from Gemini using the correct API format
      const result = await this.model.generateContent(prompt);
      
      console.log('Gemini API call successful');
      
      const response = await result.response;
      const text = response.text();
      
      console.log('Response received, length:', text.length);
      
      return text;
    } catch (error: any) {
      console.error('Gemini API Error Details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        code: error.code
      });
      
      // Provide more specific error messages
      if (error.message?.includes('API key') || error.message?.includes('authentication')) {
        return "Gemini API key is invalid or missing. Please check your REACT_APP_GEMINI_API_KEY in the .env file.";
      }
      
      if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('rate') || error.message?.includes('429')) {
        return `Gemini API quota exceeded or rate limited. 

SOLUTIONS:
1. Check your usage limits in Google AI Studio (https://aistudio.google.com/)
2. Wait for quota reset (usually daily at midnight PST)
3. Upgrade to a paid plan if you need higher limits
4. Try again in a few minutes

Current error: ${error.message}`;
      }
      
      if (error.message?.includes('network') || error.message?.includes('fetch') || error.message?.includes('connection')) {
        return "Network error connecting to Gemini API. Please check your internet connection and try again.";
      }
      
      if (error.message?.includes('timeout')) {
        return "Request timed out. Please try again in a moment.";
      }
      
      // Fallback to basic response if Gemini fails
      return `AI service error: ${error.message || 'Unknown error'}. Please try again or contact support.`;
    }
  }

  private createContext(): string {
    if (this.products.length === 0) {
      return 'No products are currently available in the store.';
    }

    // Group products by category for better context
    const productsByCategory = this.products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        unit: product.unit,
        averageRating: product.averageRating || 0
      });
      return acc;
    }, {} as Record<string, any[]>);

    // Create a more readable format
    let context = 'PRODUCT INVENTORY BY CATEGORY:\n\n';
    
    Object.entries(productsByCategory).forEach(([category, products]) => {
      context += `${category.toUpperCase()}:\n`;
      products.forEach(product => {
        context += `- ${product.name}: ₹${product.price} per ${product.unit} (Stock: ${product.stockQuantity} ${product.unit}) - ${product.description}\n`;
      });
      context += '\n';
    });

    return context;
  }

  private createPrompt(query: string, context: string): string {
    return `You are an AI shopping assistant for TrueSoul, an agricultural products e-commerce store in India. All prices are in Indian Rupees (₹).

PRODUCT INVENTORY:
${context}

CUSTOMER QUERY: "${query}"

Please respond naturally to the customer's query using only the product information provided above. Always mention prices in Indian Rupees (₹). If asked about products not in our inventory, let them know what we do have available.`;
  }
}

export const geminiService = GeminiService.getInstance(); 