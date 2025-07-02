# Gemini AI Integration Setup Guide

This guide will help you set up Google's Gemini AI for the intelligent shopping assistant.

## 🚀 Getting Started

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables

Create a `.env` file in the root directory of your project:

```bash
# Firebase Configuration (your existing config)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Gemini AI Configuration (NEW)
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Restart Development Server

After adding the environment variable, restart your development server:

```bash
npm start
```

## 🔧 Features

The Gemini AI integration provides:

- **Natural Language Processing**: Understands complex queries
- **Product Recommendations**: Suggests relevant products
- **Intent Analysis**: Categorizes user queries
- **Context-Aware Responses**: Uses real product data
- **Fallback Handling**: Graceful error handling

## 🧪 Testing the Integration

1. Start the application
2. Click the chat bubble in the bottom-right corner
3. Try any queries about products, pricing, or shopping assistance
4. The AI will respond naturally based on your actual product data

## 🔒 Security Notes

- Never commit your API key to version control
- Add `.env` to your `.gitignore` file
- Use environment variables for all sensitive data
- Monitor your API usage in Google AI Studio

## 🚨 Troubleshooting

### Common Issues

1. **"API Key not found" error**
   - Ensure the environment variable is named `REACT_APP_GEMINI_API_KEY`
   - Restart the development server after adding the key

2. **"Network error" or "API quota exceeded"**
   - Check your internet connection
   - Verify your API key is valid
   - Check your usage limits in Google AI Studio

3. **Fallback responses appearing**
   - Check the browser console for error messages
   - Verify the API key is correctly set
   - Ensure the Gemini service is properly initialized

### Getting Help

- Check the [Google AI Studio documentation](https://ai.google.dev/docs)
- Review the browser console for detailed error messages
- Verify your API key permissions and quotas

## 📊 API Usage

The Gemini API has usage limits and quotas. Monitor your usage in the Google AI Studio dashboard to avoid unexpected charges or service interruptions.

## 🔄 Updating the Integration

To update the Gemini integration:

1. Update the `@google/generative-ai` package: `npm update @google/generative-ai`
2. Check the [official documentation](https://ai.google.dev/docs) for new features
3. Test thoroughly after updates

## 🎯 Advanced Configuration

You can customize the AI behavior by modifying the prompts in `src/services/geminiService.ts`:

- Adjust response tone and style
- Add more context or instructions
- Modify fallback behavior
- Customize product recommendation logic 