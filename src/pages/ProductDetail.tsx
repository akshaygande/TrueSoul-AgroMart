import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product, ProductReview } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Minus, Star } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, serverTimestamp, orderBy } from 'firebase/firestore';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, error, success } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Review state
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [addToCartError, setAddToCartError] = useState<string | null>(null);
  const [addToCartSuccess, setAddToCartSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (!id) return;
      try {
        const prod = await productService.getProductById(id);
        setProduct(prod);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      setReviewLoading(true);
      setReviewError(null);
      try {
        const q = query(collection(db, 'reviews'), where('productId', '==', id), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate() || new Date() })) as ProductReview[];
        setReviews(data);
      } catch (err) {
        setReviewError('Failed to load reviews.');
      } finally {
        setReviewLoading(false);
      }
    };
    fetchReviews();
  }, [id, submitting]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddToCartError(null);
    setAddToCartSuccess(null);
    try {
      await addToCart(product, quantity);
      setAddToCartSuccess('Added to cart!');
    } catch (err: any) {
      setAddToCartError('Could not add to cart.');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || rating === 0 || !comment.trim()) return;
    setSubmitting(true);
    setReviewError(null);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId: id,
        userId: user.uid,
        userName: user.displayName || user.email,
        rating,
        comment,
        createdAt: serverTimestamp(),
      });
      setRating(0);
      setComment('');
      setSubmitting(false);
      // Optionally update product's averageRating
      const newReviews = [...reviews, { id: '', productId: id, userId: user.uid, userName: user.displayName || user.email, rating, comment, createdAt: new Date() }];
      const avg = newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length;
      await productService.updateProduct(id, { averageRating: avg });
    } catch (err) {
      setReviewError('Failed to submit review.');
      setSubmitting(false);
    }
  };

  const averageRating = product?.averageRating || (reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">{product.name}</h1>
          <span className="inline-block text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full mb-2">
            {product.category}
          </span>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center text-yellow-400">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-5 h-5 ${averageRating >= i ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-gray-700 font-medium">{averageRating.toFixed(1)} / 5</span>
            <span className="text-gray-500 text-sm">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
          </div>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <div className="flex items-center space-x-4 mb-2">
            <span className="text-2xl font-bold text-primary-600">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            <span className="text-sm text-gray-500">{product.stockQuantity} {product.unit} in stock</span>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <button
              className="btn btn-outline px-2 py-1"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={1}
              max={product.stockQuantity}
              value={quantity}
              onChange={e => setQuantity(Math.max(1, Math.min(product.stockQuantity, Number(e.target.value))))}
              className="w-12 text-center border border-gray-300 rounded"
            />
            <button
              className="btn btn-outline px-2 py-1"
              onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
              disabled={quantity >= product.stockQuantity}
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              className="btn btn-primary ml-2"
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
            >
              Add to Cart
            </button>
          </div>
          {addToCartError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mt-4">
              {addToCartError}
            </div>
          )}
          {addToCartSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mt-4">
              {addToCartSuccess}
            </div>
          )}
        </div>
      </div>
      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {reviewLoading ? (
          <div className="text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-gray-500">No reviews yet. Be the first to review!</div>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">{r.userName}</span>
                  <div className="flex items-center text-yellow-400">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-4 h-4 ${r.rating >= i ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="text-gray-500 text-xs">{r.createdAt?.toLocaleString()}</span>
                </div>
                <div className="text-gray-700">{r.comment}</div>
              </div>
            ))}
          </div>
        )}
        {/* Review Form */}
        {user ? (
          <form className="mt-8 space-y-4" onSubmit={handleReviewSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setRating(i)}
                    className={`focus:outline-none ${rating >= i ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="w-6 h-6" />
                  </button>
                ))}
                <span className="ml-2 text-gray-700 font-medium">{rating > 0 ? `${rating} / 5` : ''}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                required
                placeholder="Share your experience..."
                maxLength={500}
              />
            </div>
            {reviewError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {reviewError}
              </div>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || rating === 0 || !comment.trim()}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="mt-6 text-gray-600">Sign in to write a review.</div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail; 