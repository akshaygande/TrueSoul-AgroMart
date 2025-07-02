import { Product } from '../types';

// Mock AI service - in a real implementation, this would connect to an AI API
export class AIService {
  private static instance: AIService;
  private products: Product[] = [];

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  setProducts(products: Product[]) {
    this.products = products;
  }

  async processQuery(query: string): Promise<string> {
    const lowerQuery = query.toLowerCase();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Product search queries
    if (lowerQuery.includes('find') || lowerQuery.includes('search') || lowerQuery.includes('looking for')) {
      return this.handleProductSearch(query);
    }

    // Product information queries
    if (lowerQuery.includes('what is') || lowerQuery.includes('tell me about') || lowerQuery.includes('information')) {
      return this.handleProductInfo(query);
    }

    // Price queries
    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('how much')) {
      return this.handlePriceQuery(query);
    }

    // Availability queries
    if (lowerQuery.includes('available') || lowerQuery.includes('in stock') || lowerQuery.includes('stock')) {
      return this.handleAvailabilityQuery(query);
    }

    // Order and shipping queries
    if (lowerQuery.includes('order') || lowerQuery.includes('shipping') || lowerQuery.includes('delivery')) {
      return this.handleOrderQuery(query);
    }

    // General help queries
    if (lowerQuery.includes('help') || lowerQuery.includes('support') || lowerQuery.includes('assist')) {
      return this.handleHelpQuery();
    }

    // Default response
    return this.handleGeneralQuery(query);
  }

  private handleProductSearch(query: string): string {
    const searchTerms = query.toLowerCase().split(' ').filter(word => 
      word.length > 2 && !['find', 'search', 'looking', 'for', 'a', 'an', 'the', 'is', 'are', 'in', 'on', 'at'].includes(word)
    );

    if (searchTerms.length === 0) {
      return "I'd be happy to help you find products! Could you please tell me what specific agricultural products you're looking for? For example, you could ask for 'organic vegetables', 'fresh fruits', 'dairy products', or 'grains'.";
    }

    const matchingProducts = this.products.filter(product =>
      searchTerms.some(term =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      )
    );

    if (matchingProducts.length === 0) {
      return `I couldn't find any products matching "${query}". We have a variety of agricultural products including organic vegetables, fresh fruits, dairy products, grains, and more. Could you try a different search term or browse our products page?`;
    }

    if (matchingProducts.length === 1) {
      const product = matchingProducts[0];
      return `I found "${product.name}" for you! It's priced at $${product.price} and is currently ${product.stockQuantity > 0 ? 'in stock' : 'out of stock'}. ${product.description} You can view more details on our products page.`;
    }

    const productNames = matchingProducts.slice(0, 3).map(p => p.name).join(', ');
    return `I found ${matchingProducts.length} products matching your search: ${productNames}${matchingProducts.length > 3 ? ' and more' : ''}. You can browse all our products on our products page to see full details and prices.`;
  }

  private handleProductInfo(query: string): string {
    const searchTerms = query.toLowerCase().split(' ').filter(word => 
      word.length > 2 && !['what', 'is', 'tell', 'me', 'about', 'information', 'on', 'the', 'a', 'an'].includes(word)
    );

    if (searchTerms.length === 0) {
      return "I'd be happy to provide information about our products! Could you please specify which product you'd like to know more about?";
    }

    const matchingProduct = this.products.find(product =>
      searchTerms.some(term =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      )
    );

    if (!matchingProduct) {
      return `I couldn't find specific information about "${query}". We offer a wide range of agricultural products. Could you please specify the product name or browse our products page for detailed information?`;
    }

    return `${matchingProduct.name} is a ${matchingProduct.category} product. ${matchingProduct.description} It's priced at $${matchingProduct.price} and is currently ${matchingProduct.stockQuantity > 0 ? `in stock with ${matchingProduct.stockQuantity} units available` : 'out of stock'}.`;
  }

  private handlePriceQuery(query: string): string {
    const searchTerms = query.toLowerCase().split(' ').filter(word => 
      word.length > 2 && !['price', 'cost', 'how', 'much', 'is', 'the', 'a', 'an', 'does', 'it', 'cost'].includes(word)
    );

    if (searchTerms.length === 0) {
      return "I'd be happy to help you with pricing information! Could you please specify which product you're asking about? Our prices range from $2 for basic vegetables to $50 for premium organic products.";
    }

    const matchingProduct = this.products.find(product =>
      searchTerms.some(term =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      )
    );

    if (!matchingProduct) {
      return `I couldn't find pricing information for "${query}". Our products range in price from $2 to $50 depending on the type and quality. You can browse our products page to see current prices for all items.`;
    }

    return `${matchingProduct.name} is priced at $${matchingProduct.price}. ${matchingProduct.stockQuantity > 0 ? 'It\'s currently in stock and ready for purchase.' : 'It\'s currently out of stock, but you can check back later for availability.'}`;
  }

  private handleAvailabilityQuery(query: string): string {
    const searchTerms = query.toLowerCase().split(' ').filter(word => 
      word.length > 2 && !['available', 'in', 'stock', 'have', 'you', 'got', 'any', 'is', 'it'].includes(word)
    );

    if (searchTerms.length === 0) {
      const inStockCount = this.products.filter(p => p.stockQuantity > 0).length;
      const totalCount = this.products.length;
      return `We currently have ${inStockCount} out of ${totalCount} products in stock. Our inventory is updated regularly, and we restock popular items frequently. Is there a specific product you're looking for?`;
    }

    const matchingProduct = this.products.find(product =>
      searchTerms.some(term =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      )
    );

    if (!matchingProduct) {
      return `I couldn't find availability information for "${query}". You can check our products page for current stock levels of all our agricultural products.`;
    }

    if (matchingProduct.stockQuantity > 0) {
      return `${matchingProduct.name} is currently in stock with ${matchingProduct.stockQuantity} units available. You can add it to your cart and place an order right away!`;
    } else {
      return `${matchingProduct.name} is currently out of stock. We typically restock this item within 1-2 weeks. You can check back later or browse our other available products.`;
    }
  }

  private handleOrderQuery(query: string): string {
    if (query.toLowerCase().includes('shipping') || query.toLowerCase().includes('delivery')) {
      return "We offer standard shipping within 3-5 business days and express shipping within 1-2 business days. Shipping costs vary based on your location and order size. You can see shipping options and costs when you proceed to checkout.";
    }

    if (query.toLowerCase().includes('return') || query.toLowerCase().includes('refund')) {
      return "We have a 30-day return policy for all our products. If you're not satisfied with your purchase, you can return it for a full refund. Please contact our customer service team for return instructions.";
    }

    return "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or sign in to complete your purchase. We accept all major credit cards and offer secure payment processing.";
  }

  private handleHelpQuery(): string {
    return "I'm here to help! I can assist you with:\n• Finding specific products\n• Product information and pricing\n• Stock availability\n• Ordering and shipping information\n• General questions about our agricultural products\n\nJust ask me anything about our products or services!";
  }

  private handleGeneralQuery(query: string): string {
    const responses = [
      "That's an interesting question! I'm here to help you with your shopping experience. Could you please rephrase your question or ask about our products, pricing, or ordering process?",
      "I'd be happy to help you with that! However, I'm specifically designed to assist with questions about our agricultural products and shopping experience. Could you ask about our products, prices, or ordering process?",
      "I'm not sure I understood that completely. I'm your shopping assistant and can help you find products, check prices, verify stock, and assist with orders. What would you like to know about our agricultural products?",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export const aiService = AIService.getInstance(); 