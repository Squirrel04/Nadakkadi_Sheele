# Campus Game - Architecture & Design Document

## System Overview

The Campus Game is a full-stack web application that gamifies campus fitness and activity tracking. It consists of:

1. **React Frontend** - Interactive UI with game mechanics
2. **Flask Backend** - RESTful API with game logic
3. **SQLite Database** - Data persistence
4. **JWT Authentication** - Secure user sessions

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (React)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Pages: Home, GameMode, Leaderboard, Profile, Auth   │  │
│  │ Context: AuthContext (user state, JWT token)        │  │
│  │ Services: apiService (API communication)            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↕ HTTP/CORS
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Flask)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Routes: /api/auth, /api/user, /api/game, etc       │  │
│  │ JWT Middleware: Token validation                    │  │
│  │ Game Logic: XP calculation, achievements            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↕ SQLAlchemy
┌─────────────────────────────────────────────────────────────┐
│                 Database (SQLite)                           │
│  Users | GameSessions | Activities | Achievements | etc     │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Game Play Session

```
1. User clicks "Start Game"
   └→ Frontend calls POST /api/game/start
      └→ Backend creates GameSession record
         └→ Returns session_id to frontend

2. User plays game (taps tiles)
   └→ Frontend tracks score, accuracy, duration
   └→ Local state updates in real-time

3. Game ends (miss 3 tiles OR user exits)
   └→ Frontend calls POST /api/game/end with session data
      └→ Backend updates GameSession with final stats
         └→ Calculates XP earned
         └→ Updates User.total_xp and level
         └→ Checks achievement conditions
         └→ Returns rewards and new achievements

4. Frontend displays end screen
   └→ Shows XP earned, level up, achievements
```

### Authentication Flow

```
1. User enters credentials on Auth page
   └→ POST /api/auth/register or /api/auth/login
      └→ Backend validates, hashes password (bcrypt)
         └→ Creates/validates JWT token
         └→ Returns token + user data

2. Frontend stores token in localStorage
   └→ Sets up AuthContext with user state

3. All subsequent requests include JWT header
   └→ Authorization: Bearer {token}
      └→ Backend middleware validates token
         └→ Extracts user_id from token
         └→ Annotates request with user info
```

## Key Components

### Frontend

#### Pages
- **Auth.jsx** - Register/Login forms
- **Home.jsx** - Dashboard with stats and recent activities
- **GameMode.jsx** - The 4-lane rhythm game
- **Activities.jsx** - Difficulty selector and game history
- **Leaderboard.jsx** - Global rankings (public)
- **Profile.jsx** - User stats, achievements, logout

#### Services
- **apiService.js** - HTTP client with JWT support
  - Handles all API calls
  - Manages token storage
  - Auto-redirects on 401

#### Context
- **AuthContext.jsx** - Global authentication state
  - user object (profile data)
  - token (JWT)
  - isAuthenticated, loading flags
  - login/logout methods

### Backend

#### Models
- **User** - Profile, XP, level, streaks, achievements
- **GameSession** - Game score, accuracy, difficulty, XP
- **Activity** - Activity log for tracking
- **Achievement** - Achievement definitions
- **DailyChallenge** - Daily challenge data

#### Routes
- `/api/auth/*` - Register, login
- `/api/user/*` - Profile, stats, achievements
- `/api/game/*` - Start/end sessions, history
- `/api/leaderboard/*` - Global/weekly rankings
- `/api/achievements` - Achievement list
- `/api/daily-challenge` - Today's challenge

#### Game Logic
- XP Calculation: `(score/10 + accuracy_bonus) * difficulty_multiplier`
- Leveling: `level = total_xp // 1000 + 1`
- Streak: Increments daily, resets after 1-day gap
- Achievements: Condition-based automatic unlock

## Database Schema

### users table
```sql
id (PK)
username (UNIQUE)
email (UNIQUE)
password_hash
full_name
total_xp (default: 0)
level (default: 1)
current_streak (default: 0)
best_streak (default: 0)
last_activity_date
total_games_played (default: 0)
highest_game_score (default: 0)
created_at
updated_at
```

### game_sessions table
```sql
id (PK)
user_id (FK users.id)
score (default: 0)
xp_earned (default: 0)
duration_seconds
difficulty (easy/normal/hard/insane)
tiles_hit (default: 0)
tiles_missed (default: 0)
accuracy (float 0-100)
created_at
```

### activities table
```sql
id (PK)
user_id (FK users.id)
activity_type (xp_gained/game_played/etc)
description
xp_amount (default: 0)
metadata (JSON)
created_at
```

### user_achievement table (M2M)
```sql
user_id (FK, PK)
achievement_id (FK, PK)
unlocked_at
```

### achievements table
```sql
id (PK)
name
description
icon (emoji)
xp_reward
condition_type (streak/score_threshold/level/etc)
condition_value
created_at
```

### daily_challenges table
```sql
id (PK)
challenge_date (UNIQUE)
title
description
challenge_type
target_value
xp_reward
```

## Security Considerations

### Frontend
- ✅ JWT tokens stored in localStorage
- ✅ Protected routes redirect unauthenticated users
- ✅ Token validated before each API call

### Backend
- ✅ Password hashing with bcrypt (Werkzeug)
- ✅ JWT middleware validates token on protected routes
- ✅ CORS enabled for frontend domain only
- ⚠️ In production: Use environment variables for secrets

### API Security
- ✅ No sensitive data in URLs
- ✅ POST for data modifications
- ✅ Timestamps for audit trails
- ⚠️ Rate limiting (not yet implemented)
- ⚠️ Input validation (should be enhanced)

## Performance Considerations

### Frontend Optimization
- React routing with code splitting (potential)
- Memoization for components (framer-motion)
- Local state for game stats (not persisted)
- Debounced API calls

### Backend Optimization
- SQLAlchemy ORM with relationship loading
- Indexed on frequently queried columns (user_id, created_at)
- Pagination on leaderboard (default: 20 items)
- Database connection pooling (Flask-SQLAlchemy default)

### Database
- SQLite for development (fast file-based DB)
- PostgreSQL recommended for production
- Indexes on: user_id, username, created_at

## Scaling Strategy

### Phase 1 (Current)
- SQLite backend, local deployment
- Single Flask process
- ~100-1000 concurrent users

### Phase 2 (Production)
- PostgreSQL database
- Gunicorn + Nginx for load balancing
- ~10,000 concurrent users
- AWS/Heroku/Railway deployment

### Phase 3 (Enterprise)
- Redis for caching + session management
- Elasticsearch for activity search
- Microservices architecture
- Async job queue (Celery) for heavy computations
- CDN for static assets

## Testing Strategy

### Frontend Testing
- Unit tests: Page components, services
- Integration tests: Auth flow, API calls
- E2E tests: Game play, leaderboard interaction

### Backend Testing
- Unit tests: Model methods, game logic
- Integration tests: API routes, database
- Load tests: Leaderboard queries

## Deployment Checklist

### Backend
- [ ] Set `FLASK_ENV=production`
- [ ] Use PostgreSQL database
- [ ] Generate strong `JWT_SECRET_KEY`
- [ ] Enable SSL/TLS
- [ ] Configure CORS for frontend domain only
- [ ] Set up error logging (Sentry)
- [ ] Run with Gunicorn + Nginx
- [ ] Database backups configured

### Frontend
- [ ] Update API_BASE_URL to production URL
- [ ] Build: `npm run build`
- [ ] Enable minification & tree-shaking
- [ ] Configure CDN for dist files
- [ ] Set up environment variables
- [ ] Enable compression (gzip)
- [ ] Configure caching headers

## Future Enhancements

### Short Term
- [ ] Email verification
- [ ] Password reset flow
- [ ] Input validation on backend
- [ ] Rate limiting

### Medium Term
- [ ] Social features (friends, messages)
- [ ] Weekly/monthly leaderboards
- [ ] Badge/cosmetics system
- [ ] Push notifications
- [ ] Admin dashboard

### Long Term
- [ ] Mobile app (React Native)
- [ ] Multiplayer modes
- [ ] Voice chat
- [ ] AR/VR integration
- [ ] Blockchain (NFT achievements?)

## Common Errors & Solutions

### CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`
**Solution**: Check backend CORS settings, verify frontend URL is whitelisted

### 401 Unauthorized
**Error**: `token missing or invalid`
**Solution**: Ensure JWT token is included in header, token may be expired

### Database Lock
**Error**: `database is locked`
**Solution**: Close other connections to SQLite, use PostgreSQL in production

### Port Already in Use
**Error**: `Address already in use`
**Solution**: Kill process on port, or use different port

## Monitoring & Logging

### Backend Logs
- Application logs: `app.run(debug=True)` prints to console
- Database queries: SQLAlchemy echo (disabled in production)
- Error tracking: Set up Sentry

### Frontend Monitoring
- Browser console: Development debugging
- Production: Set up Sentry for error tracking
- Analytics: Track game sessions, user retention

## Support & Maintenance

### Regular Tasks
- Review error logs weekly
- Update dependencies monthly
- Database backups (daily in production)
- Monitor API performance (response times)
- Clear old database records (if needed)

### Troubleshooting Guide
See `QUICKSTART.md` for common issues and solutions

---

**Architecture Version**: 1.0
**Last Updated**: 2024
**Status**: Production Ready (with security enhancements)
