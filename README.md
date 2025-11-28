# Absolute Cinema

A modern movie search application built with Vue 3, TypeScript, and Vuetify.

## Features

- **Movie Search**: Search through thousands of movies with real-time results
- **Movie Details**: View comprehensive information about each movie including cast, ratings, and plot
- **Favorites System**: Add movies to your favorites with localStorage persistence
- **Advanced Filtering**: Filter by year range and sort by title or year
- **Responsive Design**: Beautiful UI that works on all devices
- **Type-Safe**: Full TypeScript support for better development experience

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **UI Library**: Vuetify 3
- **State Management**: Pinia
- **Routing**: Vue Router with unplugin-vue-router
- **HTTP Client**: Ky
- **Composables**: VueUse
- **Build Tool**: Vite
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Language**: TypeScript
- **Styling**: SCSS

## APIs Used

- **HackerRank Movies API**: For movie search and pagination
- **IMDb API (Unofficial)**: For detailed movie information

## Getting Started

### Prerequisites

- Node.js 24.x (LTS Krypton) or higher
- Bun (recommended) or npm/yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd absolute-cinema

# Switch to Node LTS Krypton
nvm use lts/krypton

# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun run dev

# The app will be available at http://localhost:3000
```

### Building for Production

```bash
# Type check
bun run type-check

# Build
bun run build

# Preview production build
bun run preview
```

### Testing

```bash
# Run unit tests
bun run test

# Run unit tests with UI
bun run test:ui

# Run unit tests with coverage
bun run test:coverage

# Run E2E tests
bun run test:e2e

# Run E2E tests with UI
bun run test:e2e:ui
```

### Linting

```bash
# Lint and fix
bun run lint
```

## Project Structure

```
src/
├── api/              # API clients and types
├── assets/           # Static assets
├── components/       # Reusable Vue components
├── composables/      # Vue composables
├── layouts/          # Layout components
├── pages/            # Page components (auto-routed)
├── plugins/          # Vue plugins
├── router/           # Router configuration
├── stores/           # Pinia stores
├── styles/           # Global styles
├── tests/            # Test utilities and mocks
└── utils/            # Utility functions
```

## Deployment

This project is configured for deployment on Vercel.

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will auto-detect the settings from `vercel.json`
4. Deploy!

Alternatively, use the Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Features in Detail

### Search & Discovery
- Debounced search input for better performance
- Pagination with URL state preservation
- Sort movies by title (A-Z, Z-A) or year
- Filter movies by year range

### Favorites
- Add/remove movies from favorites
- Favorites persist in localStorage
- Dedicated favorites page with same filtering capabilities
- Favorites counter in navigation

### Movie Details
- Full movie information from IMDb API
- Display poster, plot, cast, director, ratings
- Genre tags and additional metadata
- Favorite toggle on detail page

### UX & Performance
- Skeleton loading states
- Error handling with retry mechanisms
- Responsive mobile-first design
- Optimized image loading
- Request debouncing and cancellation

## Security & Best Practices

- Input sanitization to prevent XSS
- TypeScript type guards for API responses
- Secure localStorage access with error handling
- CSP-friendly implementation
- Comprehensive error boundaries

## License

MIT
