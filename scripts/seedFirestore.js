const admin = require('firebase-admin');
const { sampleProducts } = require('./seedData');

// Initialize Firebase Admin SDK
const serviceAccount = {
  "type": "service_account",
  "project_id": "gemini-ecommerce-5344d",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "YOUR_PRIVATE_KEY",
  "client_email": "YOUR_CLIENT_EMAIL",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "YOUR_CERT_URL"
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'gemini-ecommerce-5344d'
});

const db = admin.firestore();

async function seedProducts() {
  try {
    console.log('Starting to seed products...');
    
    const batch = db.batch();
    const productsRef = db.collection('products');
    
    sampleProducts.forEach((product, index) => {
      const docRef = productsRef.doc();
      batch.set(docRef, {
        ...product,
        id: docRef.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Added product: ${product.name}`);
    });
    
    await batch.commit();
    console.log('✅ Successfully seeded all products!');
    console.log(`Total products added: ${sampleProducts.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding products:', error);
  } finally {
    process.exit(0);
  }
}

// Alternative: Manual seeding without Admin SDK
async function seedProductsManually() {
  console.log('📋 Manual seeding instructions:');
  console.log('1. Go to Firebase Console > Firestore Database');
  console.log('2. Create a new collection called "products"');
  console.log('3. Add the following documents manually:');
  console.log('');
  
  sampleProducts.forEach((product, index) => {
    console.log(`Document ${index + 1}:`);
    console.log(`Name: ${product.name}`);
    console.log(`Category: ${product.category}`);
    console.log(`Price: $${product.price}`);
    console.log(`Stock: ${product.stockQuantity} ${product.unit}`);
    console.log(`Image: ${product.imageUrl}`);
    console.log(`Description: ${product.description}`);
    console.log('---');
  });
}

// Check if we have service account credentials
if (serviceAccount.private_key_id === 'YOUR_PRIVATE_KEY_ID') {
  console.log('⚠️  Service account not configured. Using manual seeding...');
  seedProductsManually();
} else {
  seedProducts();
} 