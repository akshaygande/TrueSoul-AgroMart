import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface AIAssistantContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  addMessage: (content: string, sender: 'user' | 'assistant') => void;
  clearMessages: () => void;
  setIsOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};

interface AIAssistantProviderProps {
  children: ReactNode;
}

export const AIAssistantProvider: React.FC<AIAssistantProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI shopping assistant. I can help you find products, answer questions about our agricultural goods, and assist with your shopping experience. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (content: string, sender: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        content: "Hello! I'm your AI shopping assistant. I can help you find products, answer questions about our agricultural goods, and assist with your shopping experience. How can I help you today?",
        sender: 'assistant',
        timestamp: new Date(),
      },
    ]);
  };

  const value: AIAssistantContextType = {
    messages,
    isOpen,
    isLoading,
    addMessage,
    clearMessages,
    setIsOpen,
    setIsLoading,
  };

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
}; 