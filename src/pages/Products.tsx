import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Star, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useProducts } from '../contexts/ProductContext';

const Products: React.FC = () => {
  const { products, loading, refreshProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});

  const { addToCart, error, success } = useCart();

  const categories = useMemo(() => ['all', 'Rice', 'Groundnuts', 'Sunflower Oil', 'Groundnut Oil'], []);

  useEffect(() => {
    // Get category from URL params
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams, categories]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesPrice;
  });

  const handleCategoryChange = (category: string) => {
    console.log('🔄 Category changed from "' + selectedCategory + '" to "' + category + '"');
    setSelectedCategory(category);
    if (category === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, value),
    }));
  };

  const handleAddToCart = async (product: Product) => {
    const qty = quantities[product.id] || 1;
    await addToCart(product, qty);
    // Optionally, reload products to update stock
    refreshProducts();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our premium agricultural products, carefully selected for quality and taste.
        </p>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
          {success}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {loading ? 'Loading...' : `${filteredProducts.length} products found`}
        </p>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group block">
              <div className="product-card overflow-hidden group-hover:shadow-md transition-shadow duration-300 border border-gray-100 bg-white">
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">4.5</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-primary-600">
                      ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.stockQuantity} {product.unit} in stock
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      className="btn btn-outline px-2 py-1"
                      onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) - 1)}
                      disabled={(quantities[product.id] || 1) <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={product.stockQuantity}
                      value={quantities[product.id] || 1}
                      onChange={e => handleQuantityChange(product.id, Number(e.target.value))}
                      className="w-12 text-center border border-gray-300 rounded"
                    />
                    <button
                      className="btn btn-outline px-2 py-1"
                      onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)}
                      disabled={(quantities[product.id] || 1) >= product.stockQuantity}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      className="btn btn-primary ml-2"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stockQuantity === 0}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <Link
            to="/"
            className="btn btn-primary"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default Products; 