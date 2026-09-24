import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Keyboard, Lock, Mail, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      navigate('/');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-slate-800/80 border border-slate-700 p-8 rounded-2xl shadow-xl backdrop-blur-sm">

        {/* Logo */}
        <div className="flex justify-center mb-8 text-yellow-500">
          <Keyboard className="w-16 h-16" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Welcome Back
        </h2>

        <p className="text-slate-400 text-center mb-8">
          Sign in to track your typing progress
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email address
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Password
            </label>

            <div className="relative">

              {/* Lock icon */}
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

              {/* Password input */}
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-11 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              {/* Eye button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-500 hover:text-yellow-500 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>

            </div>

            {/* Forgot Password */}
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-yellow-500 hover:text-yellow-400"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-900 font-bold text-lg px-4 py-3 rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        {/* Register */}
        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="font-medium text-yellow-500 hover:text-yellow-400"
            >
              Create an account
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}