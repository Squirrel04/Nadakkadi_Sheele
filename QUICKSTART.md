# Quick Start Guide - Campus Game (Gamified)

## Prerequisites

Make sure you have installed:
- Python 3.8+ 
- Node.js 16+ and npm
- Git (optional)

## Step 1: Start the Backend

```bash
# Navigate to backend directory
cd campus-game/backend

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python main.py
```

✅ Backend is now running on `http://localhost:5000`

You should see output like:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

## Step 2: Start the Frontend

Open a NEW terminal window/tab:

```bash
# Navigate to frontend directory
cd campus-game

# Install npm dependencies (first time only)
npm install

# Start development server
npm run dev
```

✅ Frontend is now running on `http://localhost:5173`

You should see output like:
```
➜  Local:   http://localhost:5173/
```

## Step 3: Access the App

1. Open your browser
2. Go to `http://localhost:5173`
3. **Register** a new account OR **Login** if you have one
4. Start playing!

## Default Test Account

If you want to test with a pre-made account, register with:
- Username: `testplayer`
- Email: `test@campus.com`
- Password: `test123456`
- Full Name: Test Player

## 🎮 Playing the Game

1. Click **Activities** in the bottom navigation
2. Select your desired difficulty (Easy, Normal, Hard, Insane)
3. Click **Start Game**
4. **Tap the pink tiles** as they fall to the bottom
5. Miss 3 times and the game ends
6. Earn XP based on your score and accuracy
7. Check the **Leaderboard** to see where you rank
8. Unlock **Achievements** as you reach milestones

## 📊 What's Happening Behind the Scenes

- **Backend**: Stores user data, game sessions, XP, achievements in SQLite database
- **Frontend**: React app with smooth animations and real-time updates
- **API**: RESTful API with JWT authentication
- **Database**: Located at `campus-game/backend/campus_game.db`

## 🛠️ Troubleshooting

### Backend won't start
```bash
# Kill any process on port 5000
# Windows: 
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

### Frontend won't connect to backend
- Make sure backend is running on `http://localhost:5000`
- Check browser console for CORS errors
- Clear browser cache (Ctrl+Shift+Delete)

### Database errors
```bash
# Reset database (WARNING: Deletes all data)
cd campus-game/backend
rm campus_game.db
python main.py
```

### Port conflicts
```bash
# Run backend on different port (in terminal before starting)
export FLASK_ENV=development  # Run the command to set env
python main.py  # Add --port parameter if supported
```

## 🎯 API Testing

You can test the API directly using curl or Postman:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@gmail.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Get profile
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get leaderboard
curl -X GET http://localhost:5000/api/leaderboard/global
```

## 📝 Project Structure

```
campus-game/
├── src/                    # React frontend
│   ├── pages/             # Home, GameMode, Leaderboard, etc.
│   ├── services/          # API service
│   ├── context/           # Auth context
│   └── components/        # Reusable components
│
├── backend/               # Flask backend
│   ├── main.py           # Main Flask app & routes
│   ├── models.py         # Database models
│   ├── config.py         # Configuration
│   └── campus_game.db    # SQLite database
│
├── package.json          # Frontend dependencies
└── README.md            # This file
```

## 🚀 Advanced: Production Deployment

### Deploy Backend
```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 main:app
```

### Deploy Frontend
```bash
# Build for production
npm run build

# Deploy dist/ folder to Vercel, Netlify, or static host
```

## 📱 Mobile Testing

The app is fully responsive! Test on mobile by:
1. Running the development server
2. On your phone, visit `http://YOUR_COMPUTER_IP:5173`
3. The game works great on mobile with touch controls!

## 🎓 Learning Resources

- **React**: https://react.dev
- **Flask**: https://flask.palletsprojects.com
- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion

## 📞 Need Help?

Check these files for more details:
- `BACKEND_SETUP.md` - Detailed backend configuration
- `README_GAMIFIED.md` - Full feature documentation
- `src/services/apiService.js` - API client code
- `backend/main.py` - Backend routes

---

**Happy Gaming! 🎮**
