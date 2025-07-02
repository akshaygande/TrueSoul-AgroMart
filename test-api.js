const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Test the API key
async function testGeminiAPI() {
  try {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ No API key found in environment variables');
      console.log('Please add REACT_APP_GEMINI_API_KEY to your .env file');
      return;
    }
    
    console.log('Testing API key:', apiKey.substring(0, 10) + '...');
    console.log('API Key length:', apiKey.length);
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    console.log('Using gemini-2.0-flash model');
    
    console.log('Model initialized, testing simple query...');
    
    const result = await model.generateContent('Hello, can you respond with "API test successful"?');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ API Test Successful!');
    console.log('Response:', text);
    
  } catch (error) {
    console.error('❌ API Test Failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('429')) {
      console.log('\n🔍 QUOTA ISSUE DETECTED');
      console.log('Solutions:');
      console.log('1. Check your usage at: https://aistudio.google.com/');
      console.log('2. Wait for daily quota reset (midnight PST)');
      console.log('3. Consider upgrading to a paid plan');
      console.log('4. Try again in a few minutes');
    }
    
    if (error.message?.includes('API key') || error.message?.includes('authentication')) {
      console.log('\n🔍 API KEY ISSUE DETECTED');
      console.log('Solutions:');
      console.log('1. Check your API key in .env file');
      console.log('2. Ensure the key is valid and active');
      console.log('3. Restart your development server after updating .env');
    }
    
    if (error.message?.includes('Invalid JSON payload') || error.message?.includes('Unknown name')) {
      console.log('\n🔍 API FORMAT ISSUE DETECTED');
      console.log('The API call format has been fixed. Please try again.');
    }
    
    console.error('Stack:', error.stack);
  }
}

testGeminiAPI(); 