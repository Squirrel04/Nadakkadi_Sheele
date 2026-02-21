# Campus Game - Gamified Backend Setup Guide

## Overview

This campus game is now fully gamified with a comprehensive Python Flask backend that includes:

✅ **User Authentication** - Register and login with JWT tokens
✅ **XP & Leveling System** - Earn XP from games and track progression
✅ **Game Session Tracking** - Records all game metrics (score, accuracy, difficulty)
✅ **Dynamic Leaderboard** - Global rankings based on total XP
✅ **Achievement System** - Unlock achievements for reaching milestones
✅ **Streak Tracking** - Track daily activity streaks
✅ **Daily Challenges** - New challenges each day for bonus XP

## Backend Setup

### 1. Install Python Dependencies

```bash
cd campus-game/backend
pip install -r requirements.txt
```

### 2. Initialize Database & Start Server

```bash
python main.py
```

The backend will start on `http://localhost:5000` and automatically initialize the SQLite database with default achievements and daily challenges.

### 3. Environment Variables

The backend uses a `.env` file with the following settings:

```
FLASK_APP=main.py
FLASK_ENV=development
DATABASE_URL=sqlite:///campus_game.db
JWT_SECRET_KEY=your-secret-key-change-in-production
```

For production, change the `JWT_SECRET_KEY` to a strong random value or set through environment variables.

## Frontend Setup

The frontend is already configured to work with the backend. Just ensure:

1. Backend is running on `http://localhost:5000`
2. Frontend is running on `http://localhost:5173` (or your configured port)
3. CORS is enabled (already configured in the backend)

```bash
cd campus-game
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to account

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/stats` - Get comprehensive stats
- `GET /api/user/achievements` - Get user achievements

### Game
- `POST /api/game/start` - Start a game session
- `POST /api/game/end` - End game session and save results
- `GET /api/game/history` - Get game history

### Leaderboard
- `GET /api/leaderboard/global` - Global leaderboard
- `GET /api/leaderboard/weekly` - Weekly leaderboard
- `GET /api/leaderboard/rank/<user_id>` - Get specific user rank

### Achievements & Challenges
- `GET /api/achievements` - Get all achievements
- `GET /api/daily-challenge` - Get today's challenge

## Gamification Mechanics

### XP System
- Each game awards XP based on: Score (÷10) + Accuracy Bonus + Difficulty Multiplier
- Level ups happen every 1000 XP (Level = Total XP ÷ 1000 + 1)
- XP multipliers by difficulty:
  - Easy: 0.5x
  - Normal: 1.0x
  - Hard: 1.5x
  - Insane: 2.0x

### Streaks
- Current streak increments with daily activity
- Breaks if no activity for more than 1 day
- Best streak is tracked separately

### Achievements
Available achievements:
1. **First Steps** - Play your first game (+50 XP)
2. **On Fire** - 7-day streak (+500 XP)
3. **Perfect Aim** - 95% accuracy in a game (+300 XP)
4. **Score King** - 1000+ score in one game (+400 XP)
5. **Century Club** - Reach level 100 (+1000 XP)

### Game Over Condition
- Game ends after 3 consecutive wrong tiles
- Final accuracy is calculated from tiles hit vs missed
- XP rewards are calculated based on all game metrics

## Database Model

### Users Table
- username, email, password_hash
- total_xp, level, current_streak, best_streak
- total_games_played, highest_game_score
- last_activity_date

### Game Sessions Table
- user_id, score, xp_earned, duration_seconds
- difficulty, tiles_hit, tiles_missed, accuracy
- created_at

### Activities Table
- Logs all user activities with XP gained
- Used for tracking progression over time

### Achievements Table
- name, description, icon, xp_reward
- condition_type, condition_value

### Daily Challenges Table
- One challenge per day with specific targets
- Tracks challenge_date, targets, XP rewards

## Running in Production

1. Change `FLASK_ENV` to `production`
2. Use a production database (PostgreSQL recommended)
3. Update `DATABASE_URL` to point to production database
4. Generate a strong `JWT_SECRET_KEY`
5. Deploy using a production WSGI server (Gunicorn, uWSGI)
6. Add SSL/TLS certificates
7. Enable CORS only for your frontend domain

Example production startup with Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 main:app
```

## Troubleshooting

**Backend not connecting?**
- Ensure backend is running on port 5000
- Check CORS settings in main.py
- Verify network connectivity

**Game XP not saving?**
- Check backend logs for errors
- Verify JWT token is being sent correctly
- Check database file exists (campus_game.db)

**Achievements not unlocking?**
- Run `initialize_achievements()` to ensure defaults exist
- Check achievement conditions match user stats
- Verify API returns new_achievements

## Future Enhancements

- Social features (friends, messages)
- Weekly/monthly leaderboards
- Badge system for specific milestones
- In-game cosmetics store
- Multiplayer competitive modes
- Mobile app with push notifications
- Analytics dashboard

---

For more details, refer to the source code in `backend/main.py` and `backend/models.py`.
