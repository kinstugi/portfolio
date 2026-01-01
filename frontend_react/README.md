# CV Builder Frontend

React frontend for the CV Builder application - an AI-powered CV tailoring system.

## Features

- 🎨 Modern, responsive UI built with React and Tailwind CSS
- 🔐 User authentication (Login/Sign Up)
- 📝 CV upload and management
- 🤖 AI-powered CV tailoring
- 📄 Multiple CV templates
- 📥 PDF download functionality

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client for API calls

## Getting Started

### Prerequisites

- Node.js 20.12+ (recommended: 20.19+ or 22.12+)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the `.env` file with your backend API URL:
```
VITE_API_BASE_URL=http://localhost:5005/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in the terminal).

### Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
frontend_react/
├── src/
│   ├── pages/          # Page components
│   │   └── LandingPage.jsx
│   ├── components/     # Reusable components (to be added)
│   ├── config/         # Configuration files
│   │   └── api.js      # API client setup
│   ├── App.jsx         # Main app component with routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## API Configuration

The API client is configured in `src/config/api.js`. It automatically:
- Adds the authorization token to requests
- Handles 401 errors (redirects to login)
- Sets the base URL from environment variables

## Environment Variables

- `VITE_API_BASE_URL` - Base URL for the backend API (default: `http://localhost:5005/api`)

## Notes

- The Node.js version warning is just a warning - the app will still work with Node.js 20.12+
- Make sure the backend API is running before starting the frontend
- CORS must be configured on the backend to allow requests from the frontend
