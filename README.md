# Gemini E-commerce - Agricultural Products

A modern, full-stack e-commerce platform built for selling agricultural products like rice, groundnuts, sunflower oil, and groundnut oil.

## 🚀 Features

### Core Features
- **User Authentication**: Sign up, login, logout with Firebase Auth
- **Product Management**: Browse products by category with filtering
- **Shopping Cart**: Add/remove items, update quantities
- **Order Management**: Place orders and track order history
- **Admin Dashboard**: Manage products, view orders, track inventory
- **AI Shopping Assistant**: Intelligent chatbot for product queries and shopping help
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Product Categories
- Rice
- Groundnuts  
- Sunflower Oil
- Groundnut Oil

### Tech Stack
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore + Auth)
- **AI**: Google Gemini AI
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Get your Firebase config

### 3. Configure Firebase

1. Open `src/firebase/config.ts`
2. Replace the placeholder config with your Firebase project credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Configure Gemini AI (Optional but Recommended)

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in the root directory
3. Add your Gemini API key:

```bash
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: If you don't configure Gemini AI, the assistant will use fallback responses. See `GEMINI_SETUP.md` for detailed setup instructions.

### 5. Set Up Firestore Security Rules

In Firebase Console > Firestore Database > Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read products
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users can read/write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

### 6. Run the Application

```bash
# Start development server
npm start
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Navigation component
│   └── AIAssistant.tsx # AI chat assistant component
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication context
│   ├── CartContext.tsx # Shopping cart context
│   ├── ProductContext.tsx # Product management context
│   └── AIAssistantContext.tsx # AI assistant context
├── firebase/           # Firebase configuration
│   └── config.ts       # Firebase setup
├── pages/              # Page components
│   ├── Home.tsx        # Home page
│   ├── Login.tsx       # Login page
│   ├── Signup.tsx      # Signup page
│   ├── Products.tsx    # Product listing
│   ├── ProductDetail.tsx # Product detail
│   ├── Cart.tsx        # Shopping cart
│   ├── Orders.tsx      # Order history
│   ├── AdminDashboard.tsx # Admin panel
│   └── AIDemo.tsx      # AI assistant demo page
├── services/           # API services
│   ├── productService.ts # Product operations
│   ├── orderService.ts   # Order operations
│   ├── aiService.ts      # Legacy AI assistant service
│   └── geminiService.ts  # Gemini AI service
├── types/              # TypeScript type definitions
│   └── index.ts        # Main type definitions
├── utils/              # Utility functions
│   └── cn.ts           # Class name utility
├── App.tsx             # Main app component
├── index.tsx           # App entry point
└── index.css           # Global styles
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Upload the `build` folder to Netlify

## 👥 User Roles

### Customer
- Browse products
- Add items to cart
- Place orders
- View order history

### Admin
- All customer features
- Manage products (add/edit/delete)
- View all orders
- Update order status
- Track inventory

## 🔐 Security Features

- Firebase Authentication
- Firestore security rules
- Protected routes
- Input validation
- XSS protection

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🤖 AI Shopping Assistant

The e-commerce platform includes an intelligent AI assistant that helps users with their shopping experience.

### Features
- **Natural Language Processing**: Ask questions in plain English
- **Product Search**: Find products by name, category, or description
- **Price & Stock Queries**: Get real-time pricing and availability information
- **Shopping Guidance**: Receive personalized recommendations
- **Order Support**: Get help with shipping, returns, and order placement

### How to Use
1. **Access the Assistant**: Click the chat bubble in the bottom-right corner of any page
2. **Ask Questions**: Type your question in natural language
3. **Get Instant Help**: Receive helpful responses about products and shopping

### Example Queries
- "Find rice products"
- "How much does groundnut oil cost?"
- "Is sunflower oil in stock?"
- "What are your shipping options?"
- "Help me find organic products"

### Technical Implementation
- **Frontend**: React component with real-time chat interface
- **AI Engine**: Google Gemini AI for natural language processing
- **Backend**: Intelligent service with product knowledge base
- **Integration**: Seamlessly connected with product catalog and inventory
- **Context Awareness**: Understands current product data and user context
- **Fallback System**: Graceful handling when AI service is unavailable

### Demo Page
Visit `/ai-demo` to see a comprehensive demonstration of the AI assistant capabilities with example queries and features.

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your primary colors
      },
      secondary: {
        // Your secondary colors
      }
    }
  }
}
```

### Styling
Global styles are in `src/index.css`. Component-specific styles use Tailwind CSS classes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🔄 Future Enhancements

- Payment integration (Stripe/PayPal)
- Real-time inventory updates
- Email notifications
- Product reviews and ratings
- Advanced search and filtering
- Multi-language support
- PWA capabilities 