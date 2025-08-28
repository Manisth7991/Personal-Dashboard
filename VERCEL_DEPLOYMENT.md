# Environment Variables for Vercel Deployment

## Required Environment Variables

### NextAuth Configuration
NEXTAUTH_SECRET=your_production_nextauth_secret_here
NEXTAUTH_URL=https://your-app-name.vercel.app

### API Keys (Optional - for real API integration)
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key_here
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here

### Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

### Environment
NODE_ENV=production

## Instructions for Vercel Deployment:

1. **Generate NextAuth Secret**:
   ```bash
   openssl rand -base64 32
   ```
   
2. **Set Environment Variables in Vercel**:
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add each variable above

3. **Required for Basic Functionality**:
   - NEXTAUTH_SECRET (required for authentication)
   - NEXTAUTH_URL (set to your production URL)
   - NODE_ENV=production

4. **Optional for Enhanced Features**:
   - NEXT_PUBLIC_NEWS_API_KEY (for real news data)
   - NEXT_PUBLIC_TMDB_API_KEY (for real movie data)
   - GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET (for Google OAuth)

## Notes:
- Your app will work with mock data even without API keys
- The image system uses Picsum Photos (no API key needed)
- Authentication uses credentials provider (no external OAuth required)
