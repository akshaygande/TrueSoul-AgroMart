import React from 'react';
import { MessageCircle, Search, Info, DollarSign, Package, Truck, HelpCircle } from 'lucide-react';

const AIDemo: React.FC = () => {
  const exampleQueries = [
    {
      icon: <Search className="w-5 h-5" />,
      title: 'Product Search',
      examples: [
        'Find rice products',
        'Show me groundnut oil',
        'What organic products do you have?',
        'I need sunflower oil'
      ]
    },
    {
      icon: <Info className="w-5 h-5" />,
      title: 'Product Information',
      examples: [
        'What is Basmati Rice?',
        'Tell me about groundnut oil benefits',
        'Information about sunflower oil'
      ]
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: 'Pricing',
      examples: [
        'How much does rice cost?',
        'What is the price of groundnut oil?',
        'Price of sunflower oil'
      ]
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: 'Availability',
      examples: [
        'Is rice in stock?',
        'Check groundnut oil availability',
        'How many units of sunflower oil are available?'
      ]
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: 'Shipping & Orders',
      examples: [
        'What are your shipping options?',
        'How do I place an order?',
        'What is your return policy?'
      ]
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: 'General Help',
      examples: [
        'Help me find products',
        'What can you help me with?',
        'I need assistance with shopping'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Shopping Assistant</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Meet your intelligent shopping companion powered by Google's Gemini AI! Our AI assistant can help you find products, 
          check prices, verify stock, and answer questions about our agricultural products with natural language understanding.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use the AI Assistant</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Open the Chat</h3>
                <p className="text-gray-600">Click the chat bubble in the bottom-right corner of any page</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Ask Your Question</h3>
                <p className="text-gray-600">Type your question in natural language - just like talking to a friend</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Get Instant Help</h3>
                <p className="text-gray-600">Receive helpful answers about products, prices, and shopping</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Try These Examples:</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-700">"Find rice products"</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-700">"How much does groundnut oil cost?"</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-700">"Is sunflower oil in stock?"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exampleQueries.map((category, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900">{category.title}</h3>
            </div>
            <div className="space-y-2">
              {category.examples.map((example, exampleIndex) => (
                <div key={exampleIndex} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">"{example}"</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>



      <div className="mt-12 bg-gradient-to-r from-black to-gray-800 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Try It?</h2>
        <p className="text-gray-300 mb-6">
          The AI assistant is available on every page. Look for the chat bubble in the bottom-right corner!
        </p>
        <div className="flex items-center justify-center space-x-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-medium">AI Assistant is Online</span>
        </div>
      </div>
    </div>
  );
};

export default AIDemo; 