import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, MessageCircle, Bot } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await productService.getAllProducts();
        setFeaturedProducts(products.slice(0, 4));
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const categories = [
    {
      name: 'Rice',
      description: 'Premium quality rice varieties',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=600&fit=crop&crop=center',
      href: '/products?category=Rice'
    },
    {
      name: 'Groundnuts',
      description: 'Fresh and nutritious groundnuts',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop&crop=center',
      href: '/products?category=Groundnuts'
    },
    {
      name: 'Sunflower Oil',
      description: 'Pure and healthy sunflower oil',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=600&fit=crop&crop=center',
      href: '/products?category=Sunflower Oil'
    },
    {
      name: 'Groundnut Oil',
      description: 'Traditional groundnut oil',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=600&fit=crop&crop=center',
      href: '/products?category=Groundnut Oil'
    }
  ];

  return (
    <div className="space-y-0 bg-white">
      {/* Hero Section */}
      <section className="hero relative">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop&crop=center" 
            alt="Agricultural products background"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-gray-50/90"></div>
        </div>
        
        <div className="hero-content">
          <h1 className="text-gradient mb-6 font-bold text-5xl md:text-6xl">
            Premium Agricultural Products
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto">
            Discover the finest rice, groundnuts, and oils from our trusted farmers. 
            Quality you can taste, delivered to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="btn btn-primary btn-lg group"
            >
              Shop Now
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/signup"
              className="btn btn-secondary btn-lg"
            >
              Join Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Choose TrueSoul?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to bringing you the highest quality agricultural products with exceptional service.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Premium Quality</h3>
              <p className="text-gray-600">Carefully selected products from trusted farmers with the highest standards.</p>
            </div>
            
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable delivery to your doorstep with careful packaging.</p>
            </div>
            
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Customer Care</h3>
              <p className="text-gray-600">Dedicated support team to ensure your complete satisfaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Product Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our wide range of premium agricultural products, carefully selected for quality and taste.
            </p>
          </div>
          <div className="product-grid">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.href}
                className="product-card group"
              >
                <div className="product-image">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="product-overlay"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-black transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="section bg-black text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6">
              <Bot className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-4xl font-bold mb-6">Meet Your AI Shopping Assistant</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get instant help with product recommendations, pricing, and shopping questions. 
              Our intelligent assistant is here to make your shopping experience seamless.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Smart Product Search</h3>
                  <p className="text-gray-300">Ask for specific products or categories in natural language</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Instant Price & Stock Info</h3>
                  <p className="text-gray-300">Get real-time pricing and availability updates</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Shopping Guidance</h3>
                  <p className="text-gray-300">Receive personalized recommendations and shopping tips</p>
                </div>
              </div>
              
              <Link
                to="/ai-demo"
                className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Try AI Assistant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            
            <div className="bg-gray-900 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-white text-black rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-sm">Find rice products</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-700 rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-sm">I found 3 rice products for you: Basmati Rice, Brown Rice, and White Rice. They range from ₹15 to ₹25 per kg.</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-white text-black rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-sm">How much does groundnut oil cost?</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-700 rounded-lg px-4 py-2 max-w-xs">
                    <p className="text-sm">Groundnut Oil is priced at ₹12 per liter and is currently in stock with 50 units available.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Featured Products</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Check out our most popular products that customers love and trust.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner w-12 h-12"></div>
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="product-card group"
                >
                  <div className="product-image">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="product-overlay"></div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge badge-accent">
                        {product.category}
                      </span>
                      <div className="flex items-center text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.5</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-black transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-black">
                        ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.stockQuantity} {product.unit} in stock
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {!loading && featuredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-6 text-lg">No products found. Add some test products to get started!</p>
            </div>
          )}
          
          {!loading && featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="btn btn-primary btn-lg group"
              >
                View All Products
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section bg-black text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience Quality?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust TrueSoul for their agricultural needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="btn btn-secondary btn-lg"
            >
              Start Shopping
            </Link>
            <Link
              to="/signup"
              className="btn btn-accent btn-lg"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 