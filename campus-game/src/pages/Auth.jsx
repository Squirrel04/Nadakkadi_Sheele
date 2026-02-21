import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';

const containerVariants = {
    animate: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function Auth() {
    const navigate = useNavigate();
    const { login, register, isAuthenticated } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
    });

    // Redirect if already authenticated
    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await login(formData.username, formData.password);
                navigate('/');
            } else {
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                if (!formData.email) {
                    setError('Email is required');
                    setLoading(false);
                    return;
                }
                await register(formData.username, formData.email, formData.password, formData.fullName);
                navigate('/');
            }
        } catch (err) {
            setError(err.error || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageWrapper>
            <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="max-w-md mx-auto mt-8"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">
                        {isLogin ? 'Welcome Back' : 'Join Us'}
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        {isLogin ? 'Login to your account' : 'Create your campus game account'}
                    </p>
                </motion.div>

                {/* Form */}
                <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-muted)]" />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg glass-card bg-[var(--color-bg-light)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)] transition text-[var(--color-text-primary)]"
                        />
                    </div>

                    {/* Full Name - Register only */}
                    {!isLogin && (
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-muted)]" />
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass-card bg-[var(--color-bg-light)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)] transition text-[var(--color-text-primary)]"
                            />
                        </div>
                    )}

                    {/* Email - Register only */}
                    {!isLogin && (
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-muted)]" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required={!isLogin}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass-card bg-[var(--color-bg-light)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)] transition text-[var(--color-text-primary)]"
                            />
                        </div>
                    )}

                    {/* Password */}
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-muted)]" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-lg glass-card bg-[var(--color-bg-light)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)] transition text-[var(--color-text-primary)]"
                        />
                    </div>

                    {/* Confirm Password - Register only */}
                    {!isLogin && (
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-[var(--color-text-muted)]" />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required={!isLogin}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass-card bg-[var(--color-bg-light)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)] transition text-[var(--color-text-primary)]"
                            />
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
                    </motion.button>
                </motion.form>

                {/* Toggle Auth Mode */}
                <motion.div variants={itemVariants} className="text-center mt-6">
                    <p className="text-[var(--color-text-secondary)]">
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setFormData({
                                    username: '',
                                    email: '',
                                    password: '',
                                    confirmPassword: '',
                                    fullName: '',
                                });
                                setError('');
                            }}
                            className="text-[var(--color-accent)] font-semibold hover:underline"
                        >
                            {isLogin ? 'Register' : 'Login'}
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </PageWrapper>
    );
}
