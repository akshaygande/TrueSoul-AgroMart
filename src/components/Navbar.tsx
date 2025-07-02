import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'AI Assistant', href: '/ai-demo' },
  ];

  if (user) {
    navLinks.push({ name: 'My Orders', href: '/orders' });
    if (user.isAdmin) {
      navLinks.push({ name: 'Admin', href: '/admin' });
    }
  }

  return (
    <nav className={`navbar bg-white shadow-none border-b border-gray-100 ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold text-black tracking-tight">TrueSoul</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="nav-link px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side - Cart and User */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-3 text-gray-600 hover:text-black transition-all duration-300 group"
            >
              <ShoppingCart className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 p-3 text-gray-600 hover:text-black transition-all duration-300 group"
                >
                  <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="hidden sm:block font-medium">{user.displayName || user.email}</span>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100">
                      {user.email}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="btn btn-outline btn-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 text-gray-600 hover:text-black transition-all duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-4 py-3 text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!user && (
                <div className="px-4 py-3 space-y-3">
                  <Link
                    to="/login"
                    className="block w-full btn btn-outline text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full btn btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 