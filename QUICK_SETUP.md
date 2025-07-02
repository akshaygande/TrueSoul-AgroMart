# Quick Gemini AI Setup

## 🚨 Current Issue
You're getting the error: "I'm having trouble connecting to my AI service right now" because the Gemini API key is not configured.

## 🔧 Quick Fix (5 minutes)

### Step 1: Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key (it looks like: `AIzaSyC...`)

### Step 2: Add API Key to .env file
1. Open the `.env` file in your project root
2. Add this line (replace with your actual API key):
```bash
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

### Step 3: Restart the development server
```bash
npm start
```

## ✅ Test It
1. Open the chat bubble in the bottom-right corner
2. Ask any question about your products
3. You should now get real AI responses!

## 🚨 If Still Not Working
Check the browser console (F12) for specific error messages. The AI will now tell you exactly what's wrong:
- "API key is invalid" → Check your key
- "Quota exceeded" → Check usage limits
- "Network error" → Check internet connection

## 📞 Need Help?
- See `GEMINI_SETUP.md` for detailed instructions
- Check the browser console for error details
- Verify your API key is correct

## 🔧 Quick Setup Guide

## 1. Environment Setup

Create a `.env` file in the root directory:

```bash
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start Development Server

```bash
npm start
```

## 4. Test Gemini API

```bash
node test-api.js
```

## 5. Resolving Quota Issues

If you encounter "quota exceeded" or "rate limited" errors:

### Check Your Usage
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Go to your API keys section
3. Check your current usage and limits

### Free Tier Limits
- **Daily quota**: Usually 15 requests per day
- **Rate limit**: 60 requests per minute
- **Reset time**: Daily at midnight PST

### Solutions
1. **Wait for reset**: Quotas reset daily at midnight PST
2. **Upgrade plan**: Consider Google Cloud's paid tier for higher limits
3. **Use sparingly**: The app now includes rate limiting to prevent quota issues
4. **Check billing**: Ensure your Google Cloud account is properly set up

### Testing Without API
If you want to test the app without using Gemini API:
1. Comment out the Gemini service calls in `src/components/AIAssistant.tsx`
2. Use the mock responses for development

## 6. Troubleshooting

### API Key Issues
- Ensure no extra characters in your API key
- Restart the development server after updating `.env`
- Check that the key is active in Google AI Studio

### Network Issues
- Check your internet connection
- Ensure no firewall is blocking the requests
- Try using a different network

### Model Issues
- The app uses `gemini-2.0-flash` (latest model)
- If you get model errors, check Google AI Studio for available models 