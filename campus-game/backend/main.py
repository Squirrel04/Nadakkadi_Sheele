from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from config import DevelopmentConfig
from models import db, User, GameSession, Achievement, DailyChallenge, Activity
from datetime import datetime, timedelta
import os

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

# Initialize extensions
db.init_app(app)
CORS(app)
jwt = JWTManager(app)

# Create tables logic moved below helper functions

# ==================== HELPER FUNCTIONS ====================

def initialize_achievements():
    """Initialize default achievements"""
    achievements = [
        Achievement(
            name="First Steps",
            description="Play your first game",
            icon="🎮",
            xp_reward=50,
            condition_type="games_played",
            condition_value=1
        ),
        Achievement(
            name="On Fire",
            description="Achieve a 7-day streak",
            icon="🔥",
            xp_reward=500,
            condition_type="streak",
            condition_value=7
        ),
        Achievement(
            name="Perfect Aim",
            description="Achieve 95% accuracy in a game",
            icon="🎯",
            xp_reward=300,
            condition_type="accuracy",
            condition_value=95
        ),
        Achievement(
            name="Score King",
            description="Achieve a score of 1000+ in a single game",
            icon="👑",
            xp_reward=400,
            condition_type="score_threshold",
            condition_value=1000
        ),
        Achievement(
            name="Century Club",
            description="Reach level 100",
            icon="💯",
            xp_reward=1000,
            condition_type="level",
            condition_value=100
        ),
    ]
    
    for achievement in achievements:
        if not Achievement.query.filter_by(name=achievement.name).first():
            db.session.add(achievement)
    
    db.session.commit()


def initialize_daily_challenges():
    """Initialize today's daily challenge"""
    today = datetime.utcnow().date()
    if not DailyChallenge.query.filter_by(challenge_date=today).first():
        challenge = DailyChallenge(
            challenge_date=today,
            title="Quick Reflexes",
            description="Achieve 80% accuracy in a game",
            challenge_type="accuracy",
            target_value=80,
            xp_reward=200
        )
        db.session.add(challenge)
        db.session.commit()

# Create tables
with app.app_context():
    db.create_all()
    initialize_achievements()
    initialize_daily_challenges()

def check_achievements(user):
    """Check if user qualifies for any new achievements"""
    new_achievements = []
    
    # Check each achievement condition
    for achievement in Achievement.query.all():
        if achievement not in user.achievements:
            if achievement.condition_type == "games_played" and user.total_games_played >= achievement.condition_value:
                user.achievements.append(achievement)
                user.add_xp(achievement.xp_reward, f"Achievement: {achievement.name}")
                new_achievements.append(achievement.to_dict())
            
            elif achievement.condition_type == "streak" and user.best_streak >= achievement.condition_value:
                user.achievements.append(achievement)
                user.add_xp(achievement.xp_reward, f"Achievement: {achievement.name}")
                new_achievements.append(achievement.to_dict())
            
            elif achievement.condition_type == "level" and user.level >= achievement.condition_value:
                user.achievements.append(achievement)
                user.add_xp(achievement.xp_reward, f"Achievement: {achievement.name}")
                new_achievements.append(achievement.to_dict())
    
    return new_achievements


# ==================== AUTH ENDPOINTS ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 409
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    
    user = User(
        username=data['username'],
        email=data['email'],
        full_name=data.get('full_name', data['username'])
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'message': 'User created successfully',
        'access_token': access_token,
        'user': user.to_dict(include_email=True)
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    if not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.id)
    return jsonify({
        'access_token': access_token,
        'user': user.to_dict(include_email=True)
    }), 200


# ==================== USER ENDPOINTS ====================

@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    """Get current user profile"""
    user_id = 1 # Bypass Login: use hardcoded user ID 1
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': user.to_dict(include_email=True),
        'achievements': [a.to_dict() for a in user.achievements],
        'recent_activities': [a.to_dict() for a in Activity.query.filter_by(user_id=user_id).order_by(Activity.created_at.desc()).limit(10).all()]
    }), 200


@app.route('/api/user/profile', methods=['PUT'])
def update_profile():
    """Update user profile"""
    user_id = 1
    user = User.query.get(user_id)
    data = request.get_json()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if 'full_name' in data:
        user.full_name = data['full_name']
    
    if 'email' in data and data['email'] != user.email:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already in use'}), 409
        user.email = data['email']
    
    db.session.commit()
    return jsonify({'user': user.to_dict(include_email=True)}), 200


# ==================== GAME ENDPOINTS ====================

@app.route('/api/game/start', methods=['POST'])
def start_game():
    """Start a new game session"""
    user_id = 1
    user = User.query.get(user_id)
    data = request.get_json() or {}
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    session = GameSession(
        user_id=user_id,
        difficulty=data.get('difficulty', 'normal')
    )
    
    db.session.add(session)
    db.session.commit()
    
    return jsonify({
        'session_id': session.id,
        'difficulty': session.difficulty
    }), 201


@app.route('/api/game/end', methods=['POST'])
def end_game():
    """End a game session and calculate rewards"""
    user_id = 1
    user = User.query.get(user_id)
    data = request.get_json()
    session_id = data.get('session_id')
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    session = GameSession.query.get(session_id)
    if not session or session.user_id != user_id:
        return jsonify({'error': 'Game session not found'}), 404
    
    # Update session with final stats
    session.score = data.get('score', 0)
    session.duration_seconds = data.get('duration_seconds', 0)
    session.tiles_hit = data.get('tiles_hit', 0)
    session.tiles_missed = data.get('tiles_missed', 0)
    
    total_tiles = session.tiles_hit + session.tiles_missed
    session.accuracy = (session.tiles_hit / total_tiles * 100) if total_tiles > 0 else 0
    
    # Calculate XP
    session.calculate_xp()
    
    # Update user stats
    user.total_games_played += 1
    if session.score > user.highest_game_score:
        user.highest_game_score = session.score
    
    # Add XP to user
    leveled_up = user.add_xp(session.xp_earned, f"Game session (score: {session.score})")
    
    db.session.add(session)
    db.session.commit()
    
    # Check achievements
    new_achievements = check_achievements(user)
    db.session.commit()
    
    return jsonify({
        'session': session.to_dict(),
        'user_stats': {
            'total_xp': user.total_xp,
            'level': user.level,
            'leveled_up': leveled_up
        },
        'new_achievements': new_achievements
    }), 200


@app.route('/api/game/history', methods=['GET'])
def get_game_history():
    """Get user's game history"""
    user_id = 1
    limit = request.args.get('limit', 20, type=int)
    
    sessions = GameSession.query.filter_by(user_id=user_id).order_by(
        GameSession.created_at.desc()
    ).limit(limit).all()
    
    return jsonify({
        'sessions': [s.to_dict() for s in sessions]
    }), 200


# ==================== LEADERBOARD ENDPOINTS ====================

@app.route('/api/leaderboard/global', methods=['GET'])
def get_global_leaderboard():
    """Get global leaderboard"""
    limit = request.args.get('limit', 20, type=int)
    
    users = User.query.order_by(User.total_xp.desc()).limit(limit).all()
    
    leaderboard = []
    for idx, user in enumerate(users, 1):
        user_data = user.to_dict()
        user_data['rank'] = idx
        leaderboard.append(user_data)
    
    return jsonify({'leaderboard': leaderboard}), 200


@app.route('/api/leaderboard/weekly', methods=['GET'])
def get_weekly_leaderboard():
    """Get weekly leaderboard based on games played this week"""
    limit = request.args.get('limit', 20, type=int)
    week_ago = datetime.utcnow() - timedelta(days=7)
    
    # Get weekly XP from game sessions
    weekly_xp = db.session.query(
        GameSession.user_id,
        db.func.sum(GameSession.xp_earned).label('weekly_xp')
    ).filter(GameSession.created_at >= week_ago).group_by(GameSession.user_id).all()
    
    user_xp_map = {uid: xp for uid, xp in weekly_xp}
    
    users = User.query.all()
    users_with_weekly = []
    
    for user in users:
        user_data = user.to_dict()
        user_data['weekly_xp'] = user_xp_map.get(user.id, 0)
        if user_data['weekly_xp'] > 0:
            users_with_weekly.append(user_data)
    
    users_with_weekly.sort(key=lambda x: x['weekly_xp'], reverse=True)
    users_with_weekly = users_with_weekly[:limit]
    
    for idx, user in enumerate(users_with_weekly, 1):
        user['rank'] = idx
    
    return jsonify({'leaderboard': users_with_weekly}), 200


@app.route('/api/leaderboard/rank/<int:user_id>', methods=['GET'])
def get_user_rank(user_id):
    """Get specific user's rank"""
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    rank = User.query.filter(User.total_xp > user.total_xp).count() + 1
    
    return jsonify({
        'user': user.to_dict(),
        'rank': rank,
        'total_players': User.query.count()
    }), 200


# ==================== ACHIEVEMENTS ENDPOINTS ====================

@app.route('/api/achievements', methods=['GET'])
def get_all_achievements():
    """Get all achievements"""
    achievements = Achievement.query.all()
    return jsonify({
        'achievements': [a.to_dict() for a in achievements]
    }), 200


@app.route('/api/user/achievements', methods=['GET'])
def get_user_achievements():
    """Get user's achievements"""
    user_id = 1
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    unlocked = [a.to_dict() for a in user.achievements]
    all_achievements = Achievement.query.all()
    
    locked = [a.to_dict() for a in all_achievements if a not in user.achievements]
    
    return jsonify({
        'unlocked': unlocked,
        'locked': locked,
        'total_unlocked': len(unlocked),
        'total_available': len(all_achievements)
    }), 200


# ==================== DAILY CHALLENGE ENDPOINTS ====================

@app.route('/api/daily-challenge', methods=['GET'])
def get_daily_challenge():
    """Get today's daily challenge"""
    today = datetime.utcnow().date()
    challenge = DailyChallenge.query.filter_by(challenge_date=today).first()
    
    if not challenge:
        challenge = DailyChallenge(
            challenge_date=today,
            title="Quick Reflexes",
            description="Achieve 80% accuracy in a game",
            challenge_type="accuracy",
            target_value=80,
            xp_reward=200
        )
        db.session.add(challenge)
        db.session.commit()
    
    return jsonify(challenge.to_dict()), 200


# ==================== STATS ENDPOINTS ====================

@app.route('/api/user/stats', methods=['GET'])
def get_user_stats():
    """Get comprehensive user statistics"""
    user_id = 1
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Game statistics
    games = GameSession.query.filter_by(user_id=user_id).all()
    avg_score = sum(g.score for g in games) / len(games) if games else 0
    avg_accuracy = sum(g.accuracy for g in games) / len(games) if games else 0
    
    rank = User.query.filter(User.total_xp > user.total_xp).count() + 1
    
    return jsonify({
        'user': user.to_dict(include_email=True),
        'statistics': {
            'total_games': user.total_games_played,
            'average_score': round(avg_score, 2),
            'average_accuracy': round(avg_accuracy, 2),
            'highest_score': user.highest_game_score,
            'rank': rank,
            'total_players': User.query.count()
        },
        'streaks': {
            'current': user.current_streak,
            'best': user.best_streak
        }
    }), 200


# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Initialize default user if not exists
    with app.app_context():
        if not User.query.get(1):
            default_user = User(
                username='guest_user',
                email='guest@example.com',
                full_name='Guest Player',
                total_xp=0,
                level=1
            )
            default_user.set_password('password123')
            db.session.add(default_user)
            db.session.commit()
            print("Initialized default test user (ID: 1)")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
