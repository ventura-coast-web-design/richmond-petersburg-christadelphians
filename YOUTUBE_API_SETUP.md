# YouTube API Setup Guide

This guide explains how to set up the YouTube Data API to automatically fetch Bible Unlocked videos.

## 📋 Prerequisites

- A Google account
- Access to Google Cloud Console

## 🔑 Step 1: Get a YouTube Data API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a new project** (or select an existing one)
   - Click "Select a project" at the top
   - Click "NEW PROJECT"
   - Name it something like "Richmond Petersburg Christadelphians Website"
   - Click "CREATE"

3. **Enable YouTube Data API v3**
   - Go to: https://console.cloud.google.com/apis/library
   - Search for "YouTube Data API v3"
   - Click on it
   - Click "ENABLE"

4. **Create credentials**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click "CREATE CREDENTIALS"
   - Select "API key"
   - Copy the API key that's generated

5. **Restrict the API key** (recommended for security)
   - Click on the API key you just created
   - Under "API restrictions":
     - Select "Restrict key"
     - Check only "YouTube Data API v3"
   - Click "SAVE"

## 🔧 Step 2: Set Up Environment Variable

### For Local Development:

Create a `.env` file in the root of your project:

```bash
YOUTUBE_API_KEY=your_actual_api_key_here
```

**Important:** Make sure `.env` is in your `.gitignore` file so you don't commit your API key!

### For Production (Netlify, Vercel, etc.):

Add the environment variable in your hosting platform:

**Netlify:**
1. Go to Site settings → Environment variables
2. Add: `YOUTUBE_API_KEY` = `your_actual_api_key_here`

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add: `YOUTUBE_API_KEY` = `your_actual_api_key_here`

## 📦 Step 3: Install Dependencies

Run the following command to install the required packages:

```bash
npm install
```

This will install:
- `@11ty/eleventy-fetch` - For fetching and caching YouTube data
- `dotenv` - For loading environment variables from `.env` file

## 🚀 Step 4: Build and Test

```bash
# For development with live reload
npm run dev

# For production build
npm run build
```

## 🔄 How It Works

The `src/_data/bibleUnlockedVideos.js` file:
- Fetches the latest shorts from the Bible Unlocked channel
- Caches the results for 1 hour (configurable)
- Automatically extracts video titles, thumbnails, durations, and URLs
- Falls back to placeholder data if no API key is set

## 📊 API Usage Notes

- **Free Tier:** 10,000 quota units per day
- **Each build uses:** ~3-5 quota units
- **This means:** You can build ~2,000-3,000 times per day for free
- **Cache duration:** 1 hour (reduces API calls)

## 🔍 Troubleshooting

### "YOUTUBE_API_KEY not set" warning

**If you see this even though you created a `.env` file:**

1. Make sure you've run `npm install` to install the `dotenv` package
2. Verify your `.env` file is in the root directory (same level as `package.json`)
3. Check your `.env` file has no quotes around the value:
   ```bash
   # ✅ Correct:
   YOUTUBE_API_KEY=AIzaSyAbc123xyz789
   
   # ❌ Incorrect:
   YOUTUBE_API_KEY="AIzaSyAbc123xyz789"
   ```
4. Restart your dev server after creating/editing the `.env` file
5. Make sure there's no space around the `=` sign

**If you haven't set up the API key yet:**
This is normal. The site will use placeholder data until you configure the API key.

### "No videos found" message

1. Verify the channel ID in `src/_data/bibleUnlockedVideos.js` is correct
2. Make sure the Bible Unlocked channel has published Shorts
3. Check your API key is valid and has YouTube Data API v3 enabled

### API quota exceeded

If you exceed your daily quota:
1. Increase the cache duration in the data file (change `duration: "1h"` to `duration: "6h"` or `duration: "1d"`)
2. Request a quota increase from Google Cloud Console
3. Temporarily use placeholder data

## 🎨 Customizing

To fetch more or fewer videos, edit `src/_data/bibleUnlockedVideos.js`:

```javascript
// Change maxResults=10 to your desired number
const searchUrl = `...&maxResults=10&type=video...`;
```

To change the cache duration:

```javascript
const searchData = await EleventyFetch(searchUrl, {
  duration: "1h", // Change to "6h", "1d", etc.
  type: "json"
});
```

## 📝 Support

If you have issues:
1. Check the console output when building
2. Verify your API key is correctly set
3. Ensure the YouTube Data API v3 is enabled in Google Cloud Console

