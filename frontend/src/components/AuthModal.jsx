import React, { useState } from 'react';
import { X, User, Mail, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        if (!username || !email || !password) {
          setError('Please fill in all fields.');
          setLoading(false);
          return;
        }
        await register(username, email, password);
      } else {
        if (!email || !password) {
          setError('Please provide email and password.');
          setLoading(false);
          return;
        }
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-surfaceBorder/80 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surfaceLight transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-accent/20 border border-brand-accent/40 text-brand-cyan text-[11px] font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-brand-cyan" />
            <span>AlgoArena Member Hub</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {isRegisterMode ? 'Create your Account' : 'Welcome back'}
          </h2>
          <p className="text-xs text-gray-400">
            {isRegisterMode
              ? 'Track progress, save favorite algorithms, and compete on leaderboards.'
              : 'Log in to synchronize your XP, challenge history, and badges.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Username</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. ByteKnight"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-surfaceLight border border-surfaceBorder rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="developer@algoarena.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surfaceLight border border-surfaceBorder rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surfaceLight border border-surfaceBorder rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-accent via-brand-purple to-brand-cyan hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-brand-purple/25 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : isRegisterMode ? 'Sign Up & Start' : 'Sign In'}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="pt-2 text-center text-xs text-gray-400 border-t border-surfaceBorder/60">
          {isRegisterMode ? (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setIsRegisterMode(false)}
                className="text-brand-cyan font-semibold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Don't have an account yet?{' '}
              <button
                onClick={() => setIsRegisterMode(true)}
                className="text-brand-purple font-semibold hover:underline"
              >
                Register free
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
