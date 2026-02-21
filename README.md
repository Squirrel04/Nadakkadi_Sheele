[README_GAMIFIED.md](https://github.com/user-attachments/files/25454956/README_GAMIFIED.md)
# Campus Game - Gamified Fitness & Activity App

A modern, fully gamified campus activity tracker built with React and Flask. Earn XP, climb leaderboards, unlock achievements, and challenge yourself to reach new levels!

## 🎮 Features

### Gamification System
- **XP & Leveling**: Earn XP from games and activities. Level up every 1000 XP
- **Dynamic Leaderboard**: Compete with other campus players for the #1 spot
- **Achievement System**: Unlock 5+ achievements for reaching milestones
- **Streak Tracking**: Build daily activity streaks (best tracked separately)
- **Daily Challenges**: New challenge each day with bonus XP rewards
- **Game Sessions**: Track individual game performance with detailed metrics

### Interactive Game Mode
- **4-Lane Rhythm Game**: Tap pink tiles as they fall down the screen
- **Difficulty Levels**: Easy, Normal, Hard, Insane with XP multipliers
- **Performance Metrics**: Score, accuracy, tiles hit/missed, duration
- **Real-time Feedback**: Vibration, visual effects, and live score tracking
- **Game Over Mechanics**: Miss 3 consecutive tiles to end the game

### User Dashboard
- **Home Screen**: Quick stats (streak, level, rank), XP progress, recent activities
- **Leaderboard**: Global rankings with top 3 special display
- **Activities Page**: Game history, difficulty selector, how-to guide
- **Profile Page**: User stats, unlocked achievements, game statistics
- **Account System**: Register, login, profile editing

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Python 3** - Runtime
- **Flask** - Web framework
- **SQLAlchemy** - ORM & database
- **Flask-JWT-Extended** - Authentication
- **SQLite** - Default database (PostgreSQL for production)
- **Flask-CORS** - Cross-origin requests

## 📦 Project Structure

```
campus-game/
├── frontend/
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx       # Dashboard
│   │   │   ├── Activities.jsx # Game & history
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── GameMode.jsx   # Main game
│   │   │   └── Auth.jsx       # Login/Register
│   │   ├── components/         # Reusable components
│   │   ├── services/
│   │   │   └── apiService.js  # API client
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Auth state
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── main.py                 # Flask app & routes
    ├── models.py               # Database models
    ├── config.py               # Configuration
    ├── requirements.txt
    └── .env
```

## 🚀 Quick Start

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd campus-game/backend
   pip install -r requirements.txt
   ```

2. **Start the server:**
   ```bash
   python main.py
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd campus-game
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

3. **Access the app:**
   Open `http://localhost:5173` in your browser

## 🎮 How to Play

1. **Register/Login**: Create an account or log in with existing credentials
2. **Select Difficulty**: Choose Easy, Normal, Hard, or Insane
3. **Play**: Tap the pink tiles as they fall at the bottom of the screen
4. **Earn XP**: Score points, build accuracy, and earn XP
5. **Level Up**: Every 1000 XP grants you a level
6. **Unlock Achievements**: Reach milestones to unlock special achievements
7. **Climb Leaderboard**: Compete with other players for top rankings

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### User
- `GET /api/user/profile` - Get profile + activities
- `PUT /api/user/profile` - Update profile
- `GET /api/user/stats` - Get comprehensive stats
- `GET /api/user/achievements` - Get achievements

### Game
- `POST /api/game/start` - Start game session
- `POST /api/game/end` - End game & save results
- `GET /api/game/history` - Game history

### Leaderboard
- `GET /api/leaderboard/global` - Global rankings
- `GET /api/leaderboard/weekly` - Weekly rankings
- `GET /api/leaderboard/rank/<user_id>` - User rank

### Other
- `GET /api/achievements` - All achievements
- `GET /api/daily-challenge` - Today's challenge

## 💰 XP Calculation

```
Base XP = Score ÷ 10
Accuracy Bonus = Accuracy % × 500
Difficulty Multiplier:
  - Easy: 0.5x
  - Normal: 1.0x
  - Hard: 1.5x
  - Insane: 2.0x

Final XP = (Base XP + Accuracy Bonus) × Difficulty Multiplier
```

## 🏆 Achievements

| Achievement | Condition | Reward |
|------------|-----------|--------|
| First Steps | Play 1 game | 50 XP |
| On Fire | 7-day streak | 500 XP |
| Perfect Aim | 95% accuracy | 300 XP |
| Score King | 1000+ score | 400 XP |
| Century Club | Level 100 | 1000 XP |

## 🗄️ Database Schema

### Users
- username, email, password_hash
- total_xp, level, current_streak, best_streak
- total_games_played, highest_game_score
- last_activity_date

### Game Sessions
- score, xp_earned, duration_seconds
- difficulty, tiles_hit, tiles_missed, accuracy

### Activities
- activity_type, description, xp_amount
- Logs all user actions

### Achievements
- name, description, icon, xp_reward
- condition_type (streak, score_threshold, etc)

## 🔐 Authentication

- **JWT Tokens**: 30-day token expiration
- **Password Hashing**: bcrypt hashing
- **Protected Routes**: Frontend routing restricts unauthenticated access

## 📱 Responsive Design

- Optimized for mobile devices
- Touch-friendly interface
- Vibration feedback support
- Full-screen game mode

## 🎨 Design Features

- **Glass Morphism**: Modern glassmorphic UI components
- **Gradient Animations**: Smooth color transitions
- **Neon Effects**: Glowing borders and shadows
- **Responsive Grid**: 4-lane game layout
- **Dark Theme**: Easy on the eyes with vibrant accents

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy dist folder
3. Set API URL in environment

### Backend (Heroku/Railway)
1. Create Procfile: `web: gunicorn main:app`
2. Set environment variables
3. Use PostgreSQL for production

## 📝 Environment Variables

### Backend (.env)
```
FLASK_APP=main.py
FLASK_ENV=development
DATABASE_URL=sqlite:///campus_game.db
JWT_SECRET_KEY=your-secret-key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🔄 Future Features

- Social features (friends, gifting)
- Weekly/monthly leaderboards
- Badge system
- In-game cosmetics shop
- Multiplayer modes
- Mobile app (React Native)
- Push notifications
- Advanced analytics
- Seasonal events

## 🐛 Troubleshooting

**Backend not starting?**
- Ensure Python 3.8+ is installed
- Check port 5000 is available
- Run `pip install -r requirements.txt` again

**API not connecting?**
- Verify backend is running on port 5000
- Check CORS settings
- Ensure firewall allows connections

**XP not saving?**
- Check browser console for errors
- Verify database file exists
- Check backend logs

## 📄 License

MIT License - Feel free to use this project for personal or educational purposes.

## 👥 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

**Built with ❤️ for campus gamification**
