from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import json

db = SQLAlchemy()

class User(db.Model):
    """User model with gamification attributes"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(200))
    
    # Gamification
    total_xp = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    current_streak = db.Column(db.Integer, default=0)
    best_streak = db.Column(db.Integer, default=0)
    last_activity_date = db.Column(db.DateTime)
    total_games_played = db.Column(db.Integer, default=0)
    highest_game_score = db.Column(db.Integer, default=0)
    
    # Relationships
    game_sessions = db.relationship('GameSession', backref='user', lazy=True, cascade='all, delete-orphan')
    achievements = db.relationship('Achievement', secondary='user_achievement', backref='users')
    activities = db.relationship('Activity', backref='user', lazy=True, cascade='all, delete-orphan')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def update_streak(self):
        """Update user streak based on last activity"""
        today = datetime.utcnow().date()
        
        if self.last_activity_date is None:
            self.current_streak = 1
        else:
            last_date = self.last_activity_date.date()
            days_diff = (today - last_date).days
            
            if days_diff == 0:
                # Same day, no change
                pass
            elif days_diff == 1:
                # Consecutive day, increment streak
                self.current_streak += 1
                if self.current_streak > self.best_streak:
                    self.best_streak = self.current_streak
            else:
                # Streak broken
                self.current_streak = 1
        
        self.last_activity_date = datetime.utcnow()
    
    def add_xp(self, amount, reason='activity'):
        """Add XP and update level"""
        self.total_xp += amount
        old_level = self.level
        self.level = max(1, self.total_xp // 1000 + 1)
        self.update_streak()
        
        # Create activity log
        activity = Activity(
            user_id=self.id,
            activity_type='xp_gained',
            description=f'Gained {amount} XP ({reason})',
            xp_amount=amount
        )
        db.session.add(activity)
        
        return self.level > old_level  # Return True if leveled up
    
    def to_dict(self, include_email=False):
        """Convert user to dictionary"""
        data = {
            'id': self.id,
            'username': self.username,
            'full_name': self.full_name,
            'total_xp': self.total_xp,
            'level': self.level,
            'current_streak': self.current_streak,
            'best_streak': self.best_streak,
            'total_games_played': self.total_games_played,
            'highest_game_score': self.highest_game_score,
        }
        if include_email:
            data['email'] = self.email
        return data


class GameSession(db.Model):
    """Track individual game sessions"""
    __tablename__ = 'game_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    score = db.Column(db.Integer, default=0)
    xp_earned = db.Column(db.Integer, default=0)
    duration_seconds = db.Column(db.Integer)
    difficulty = db.Column(db.String(50), default='normal')
    tiles_hit = db.Column(db.Integer, default=0)
    tiles_missed = db.Column(db.Integer, default=0)
    accuracy = db.Column(db.Float, default=0.0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def calculate_xp(self):
        """Calculate XP earned from game"""
        base_xp = self.score // 10
        accuracy_bonus = int(self.accuracy * 500) if self.accuracy > 0 else 0
        
        difficulty_multiplier = {
            'easy': 0.5,
            'normal': 1.0,
            'hard': 1.5,
            'insane': 2.0
        }
        multiplier = difficulty_multiplier.get(self.difficulty, 1.0)
        
        self.xp_earned = int((base_xp + accuracy_bonus) * multiplier)
        return self.xp_earned
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'score': self.score,
            'xp_earned': self.xp_earned,
            'duration_seconds': self.duration_seconds,
            'difficulty': self.difficulty,
            'tiles_hit': self.tiles_hit,
            'tiles_missed': self.tiles_missed,
            'accuracy': round(self.accuracy, 2),
            'created_at': self.created_at.isoformat()
        }


class Activity(db.Model):
    """User activity log for tracking progress"""
    __tablename__ = 'activities'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    activity_type = db.Column(db.String(100), nullable=False)  # 'daily_steps', 'game_played', 'xp_gained', etc
    description = db.Column(db.String(500))
    xp_amount = db.Column(db.Integer, default=0)
    extra_data = db.Column(db.JSON)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'activity_type': self.activity_type,
            'description': self.description,
            'xp_amount': self.xp_amount,
            'created_at': self.created_at.isoformat()
        }


# Association table for achievements
user_achievement = db.Table(
    'user_achievement',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('achievement_id', db.Integer, db.ForeignKey('achievements.id'), primary_key=True),
    db.Column('unlocked_at', db.DateTime, default=datetime.utcnow)
)


class Achievement(db.Model):
    """Achievements for gamification"""
    __tablename__ = 'achievements'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    icon = db.Column(db.String(50))  # emoji or icon name
    xp_reward = db.Column(db.Integer, default=100)
    
    # Achievement conditions
    condition_type = db.Column(db.String(100))  # 'score_threshold', 'streak', 'games_played', etc
    condition_value = db.Column(db.Integer)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'xp_reward': self.xp_reward,
            'condition_type': self.condition_type,
            'condition_value': self.condition_value
        }


class DailyChallenge(db.Model):
    """Daily challenges for users"""
    __tablename__ = 'daily_challenges'
    
    id = db.Column(db.Integer, primary_key=True)
    challenge_date = db.Column(db.Date, default=datetime.utcnow().date, unique=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500))
    challenge_type = db.Column(db.String(100))  # 'score_threshold', 'accuracy', 'streak', etc
    target_value = db.Column(db.Integer)
    xp_reward = db.Column(db.Integer, default=200)
    
    def to_dict(self):
        return {
            'id': self.id,
            'challenge_date': self.challenge_date.isoformat(),
            'title': self.title,
            'description': self.description,
            'challenge_type': self.challenge_type,
            'target_value': self.target_value,
            'xp_reward': self.xp_reward
        }
