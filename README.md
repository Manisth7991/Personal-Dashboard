# Personalized Content Dashboard

A modern, responsive dashboard application built with Next.js 14, React, TypeScript, and Tailwind CSS. This dashboard provides users with a personalized feed of news, movie recommendations, and social media content, featuring advanced state management, drag-and-drop functionality, and comprehensive testing.

## 🚀 Features

### Core Features
- **Personalized Content Feed**: Combines news, movies, and social media posts
- **User Preferences**: Customizable categories, language, and region settings
- **Favorites System**: Save and organize preferred content
- **Advanced Search**: Debounced global search across all content types
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### Advanced UI/UX
- **Dark/Light Mode**: Automatic system detection with manual override
- **Drag & Drop**: Reorder content cards with smooth animations
- **Infinite Scroll**: Seamless content loading
- **Smooth Animations**: Powered by Framer Motion
- **Interactive Components**: Hover effects, transitions, and micro-interactions

### Technical Features
- **State Management**: Redux Toolkit with RTK Query for API handling
- **Data Persistence**: Redux Persist for favorites and preferences
- **Real-time Updates**: Auto-refresh capabilities
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Performance Optimized**: Code splitting and lazy loading

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + RTK Query
- **Data Persistence**: Redux Persist
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library + Cypress
- **Code Quality**: ESLint + TypeScript

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personalized-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure API keys** (see API Setup section below)

5. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Setup

### Required API Keys

#### 1. NewsAPI
- Visit [NewsAPI](https://newsapi.org/)
- Sign up for a free account
- Get your API key
- Add to `.env.local`:
  ```
  NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key_here
  ```

#### 2. TMDB (The Movie Database)
- Visit [TMDB](https://www.themoviedb.org/settings/api)
- Create an account and request an API key
- Add to `.env.local`:
  ```
  NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
  ```

#### 3. Social Media (Mock Data)
The social media content uses mock data, so no API key is required. In a production environment, you would integrate with:
- Twitter API v2
- Instagram Basic Display API
- Facebook Graph API

### Environment Variables
```env
# API Keys
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key_here
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here

# App Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## 🏗️ Project Structure

```
personalized-dashboard/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page
│   │   └── providers.tsx       # Redux & Theme providers
│   ├── components/             # React components
│   │   ├── content/            # Content-related components
│   │   │   ├── content-card.tsx
│   │   │   └── content-grid.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── header.tsx
│   │   │   └── sidebar.tsx
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── loading-spinner.tsx
│   │   ├── views/              # Page views
│   │   │   ├── dashboard-view.tsx
│   │   │   ├── favorites-view.tsx
│   │   │   ├── news-view.tsx
│   │   │   ├── movies-view.tsx
│   │   │   ├── social-view.tsx
│   │   │   ├── search-view.tsx
│   │   │   ├── settings-view.tsx
│   │   │   └── trending-view.tsx
│   │   └── theme-provider.tsx  # Theme context provider
│   ├── features/               # Redux slices
│   │   ├── favorites/
│   │   ├── feed/
│   │   ├── preferences/
│   │   ├── search/
│   │   └── theme/
│   ├── hooks/                  # Custom React hooks
│   │   ├── useSearch.ts
│   │   ├── useTheme.ts
│   │   └── useUtils.ts
│   ├── lib/                    # API and external services
│   │   └── api.ts              # RTK Query API definitions
│   ├── store/                  # Redux store configuration
│   │   └── index.ts
│   ├── styles/                 # Additional styles
│   ├── tests/                  # Unit and integration tests
│   │   ├── components/
│   │   ├── features/
│   │   └── utils/
│   └── utils/                  # Utility functions
│       ├── debounce.ts
│       ├── helpers.ts
│       └── storage.ts
├── cypress/                    # E2E tests
│   └── e2e/
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── cypress.config.js          # Cypress configuration
├── jest.config.js             # Jest configuration
├── jest.setup.js              # Jest setup
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🧪 Testing

### Unit Tests (Jest + React Testing Library)

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### E2E Tests (Cypress)

```bash
# Open Cypress GUI
npm run cypress:open

# Run Cypress tests headlessly
npm run cypress:run
```

### Test Coverage
The project includes comprehensive tests for:
- Component rendering and interactions
- Redux state management
- Utility functions
- API integrations
- User workflows (E2E)

Current coverage targets:
- **Branches**: 80%+
- **Functions**: 80%+
- **Lines**: 80%+
- **Statements**: 80%+

## 🎨 Customization

### Adding New Content Sources

1. **Define API endpoint** in `src/lib/api.ts`:
   ```typescript
   getCustomContent: builder.query<CustomItem[], void>({
     query: () => ({
       url: 'https://api.example.com/content',
       headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
     })
   })
   ```

2. **Add to content types**:
   ```typescript
   interface ContentItem {
     // ... existing fields
     type: 'news' | 'movie' | 'social' | 'custom'
   }
   ```

3. **Update components** to handle new content type

### Customizing Themes

1. **Modify Tailwind config** (`tailwind.config.js`):
   ```javascript
   theme: {
     extend: {
       colors: {
         primary: {
           // Add custom color palette
         }
       }
     }
   }
   ```

2. **Update global styles** (`src/app/globals.css`)

3. **Add theme options** in settings view

### Adding New Languages

1. **Install react-i18next**:
   ```bash
   npm install react-i18next i18next
   ```

2. **Create translation files** in `public/locales/`

3. **Update preferences slice** to handle new languages

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- **Netlify**: Use `npm run build && npm run export`
- **AWS Amplify**: Connect GitHub repository
- **Docker**: Create Dockerfile for containerization

### Environment Variables for Production

Ensure these are set in your deployment environment:
```env
NEXT_PUBLIC_NEWS_API_KEY=production_news_api_key
NEXT_PUBLIC_TMDB_API_KEY=production_tmdb_api_key
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api
```

## 📋 Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript check

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run cypress:open    # Open Cypress GUI
npm run cypress:run     # Run E2E tests headlessly
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Development Guidelines

- **Code Style**: Follow ESLint and Prettier configurations
- **Testing**: Write tests for new features
- **Documentation**: Update README for new features
- **Type Safety**: Maintain TypeScript strict mode
- **Performance**: Optimize components and avoid unnecessary re-renders

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Issues

1. **API Rate Limits**
   - NewsAPI: 1000 requests/day on free plan
   - TMDB: 40 requests/10 seconds
   - Solution: Implement caching or upgrade API plans

2. **CORS Issues**
   - Some APIs may have CORS restrictions
   - Solution: Use API routes in `pages/api/` for server-side calls

3. **Build Errors**
   - Check TypeScript errors: `npm run type-check`
   - Verify environment variables are set
   - Clear `.next` cache: `rm -rf .next`

4. **Performance Issues**
   - Enable production mode: `NODE_ENV=production`
   - Optimize images with Next.js Image component
   - Use React DevTools Profiler

### Getting Help

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check component docs and API references
- **Community**: Join discussions in GitHub Discussions

## 🎯 Roadmap

### Planned Features
- [ ] **Real-time notifications** via WebSockets
- [ ] **Multi-language support** with i18next
- [ ] **Advanced analytics** dashboard
- [ ] **Social sharing** integration
- [ ] **Offline support** with service workers
- [ ] **Voice search** functionality
- [ ] **AI-powered recommendations**
- [ ] **Collaborative features** (shared dashboards)

### Performance Improvements
- [ ] **Image optimization** and lazy loading
- [ ] **Code splitting** optimization
- [ ] **PWA implementation**
- [ ] **Edge caching** strategies

---

**Built with ❤️ using Next.js, React, and TypeScript**
