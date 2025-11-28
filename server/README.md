# SoloLev Server

Express + TypeScript + MongoDB API server for SoloLev app.

## Setup

```bash
cd server
npm install

# Create .env file from example
cp .env.example .env
# Edit .env with your values (Google OAuth credentials, MongoDB URI, etc.)
```

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/sololev
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
PORT=3000
CLIENT_URL=http://localhost:8081
```

## Run

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

## API Endpoints

### Health

- `GET /health` - Server status

### Auth (Google OAuth)

- `GET /api/auth/google` - Get Google auth URL (redirects to Google)
- `GET /api/auth/google/callback` - OAuth callback (handles token)
- `GET /api/auth/verify` - Verify session token
- `POST /api/auth/logout` - Logout (invalidate session)

### Users (Protected - requires Bearer token)

- `GET /api/users/me` - Get current user
- `GET /api/users/me/progress` - Get level & streak
- `POST /api/users/me/complete-day` - Mark day complete

### Tasks (Protected - requires Bearer token)

- `GET /api/tasks` - Get all tasks (query: ?date=YYYY-MM-DD)
- `GET /api/tasks/today` - Get today's tasks
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:taskId` - Update task
- `DELETE /api/tasks/:taskId` - Delete task

## Database Collections

- **users** - User profiles with OAuth data & streak info
- **tasks** - Daily tasks linked to users
- **sessions** - JWT sessions with expiry

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`
