// Sample data seeding script for Firebase Firestore
// Run this script after setting up Firebase to populate initial products

const sampleProducts = [
  {
    name: "Premium Basmati Rice",
    description: "Long-grain aromatic rice with a distinctive fragrance and fluffy texture. Perfect for biryanis and pilafs.",
    price: 12.99,
    category: "Rice",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    stockQuantity: 100,
    unit: "kg",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Organic Brown Rice",
    description: "Nutritious whole grain rice rich in fiber and essential nutrients. Great for healthy meals.",
    price: 8.99,
    category: "Rice",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    stockQuantity: 75,
    unit: "kg",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Jasmine Rice",
    description: "Fragrant Thai jasmine rice with a subtle floral aroma and soft, sticky texture.",
    price: 10.99,
    category: "Rice",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
    stockQuantity: 60,
    unit: "kg",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Raw Groundnuts",
    description: "Fresh, raw groundnuts packed with protein and healthy fats. Perfect for snacking or cooking.",
    price: 6.99,
    category: "Groundnuts",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
    stockQuantity: 50,
    unit: "kg",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Roasted Groundnuts",
    description: "Premium roasted groundnuts with a rich, nutty flavor. Great for snacking and garnishing.",
    price: 7.99,
    category: "Groundnuts",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
    stockQuantity: 40,
    unit: "kg",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Salted Groundnuts",
    description: "Delicious salted groundnuts with the perfect balance of salt and crunch.",
    price: 8.49,
    category: "Groundnuts",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
    stockQuantity: 35,
    unit: "kg",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Pure Sunflower Oil",
    description: "100% pure sunflower oil rich in vitamin E and healthy unsaturated fats. Ideal for cooking and frying.",
    price: 15.99,
    category: "Sunflower Oil",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
    stockQuantity: 30,
    unit: "liters",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Organic Sunflower Oil",
    description: "Certified organic sunflower oil made from premium quality seeds. Perfect for health-conscious cooking.",
    price: 19.99,
    category: "Sunflower Oil",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
    stockQuantity: 25,
    unit: "liters",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Cold-Pressed Sunflower Oil",
    description: "Cold-pressed sunflower oil preserving all natural nutrients and flavor. Best for salads and dressings.",
    price: 22.99,
    category: "Sunflower Oil",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
    stockQuantity: 20,
    unit: "liters",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Traditional Groundnut Oil",
    description: "Traditional groundnut oil with authentic taste and aroma. Perfect for traditional cooking methods.",
    price: 18.99,
    category: "Groundnut Oil",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
    stockQuantity: 28,
    unit: "liters",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Refined Groundnut Oil",
    description: "Refined groundnut oil with neutral taste and high smoke point. Ideal for high-temperature cooking.",
    price: 16.99,
    category: "Groundnut Oil",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
    stockQuantity: 32,
    unit: "liters",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Organic Groundnut Oil",
    description: "Certified organic groundnut oil made from premium organic groundnuts. No chemicals or additives.",
    price: 24.99,
    category: "Groundnut Oil",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
    stockQuantity: 18,
    unit: "liters",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Instructions for using this script:
// 1. Set up Firebase in your project
// 2. Import this data into your Firebase Firestore manually or
// 3. Create a Node.js script to upload this data programmatically

console.log('Sample products data ready for import:');
console.log(JSON.stringify(sampleProducts, null, 2));

// To use this data, you can:
// 1. Copy the products array to your Firebase console
// 2. Create a new collection called 'products'
// 3. Add each product as a new document
// 4. Or create a Node.js script using Firebase Admin SDK to upload this data

module.exports = { sampleProducts }; 