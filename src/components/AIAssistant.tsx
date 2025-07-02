import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, RotateCcw } from 'lucide-react';
import { useAIAssistant } from '../contexts/AIAssistantContext';
import { geminiService } from '../services/geminiService';
import { useProducts } from '../contexts/ProductContext';

const AIAssistant: React.FC = () => {
  const { isOpen, setIsOpen, messages, addMessage, isLoading, setIsLoading, clearMessages } = useAIAssistant();
  const { products } = useProducts();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update AI service with current products
  useEffect(() => {
    if (products.length > 0) {
      geminiService.setProducts(products);
    }
  }, [products]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage(userMessage, 'user');
    setIsLoading(true);

    try {
      const response = await geminiService.processQuery(userMessage);
      addMessage(response, 'assistant');
    } catch (error) {
      console.error('Error getting AI response:', error);
      addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black hover:bg-gray-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 h-[500px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Bot className="w-6 h-6 text-black" />
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-xs text-gray-500">Powered by Gemini AI</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button onClick={clearMessages} className="p-1">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                message.sender === 'user' ? 'bg-black text-white' : 'bg-gray-100'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center space-x-2 p-4 border-t">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about our products..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-black text-white p-2 rounded-lg disabled:bg-gray-300"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 