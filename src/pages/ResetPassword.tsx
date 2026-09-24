import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Keyboard, Lock, Eye, EyeOff } from 'lucide-react';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Please enter both passwords.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess('Password updated successfully!');

    setTimeout(() => {
      navigate('/login');
    }, 1500);
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
          Set New Password
        </h2>

        <p className="text-slate-400 text-center mb-8">
          Create a new password for your account.
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg p-3 text-sm text-center mb-6">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-400 rounded-lg p-3 text-sm text-center mb-6">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Set New Password
            </label>

            <div className="relative">

              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-11 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                placeholder="Enter new password"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-yellow-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>

            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Confirm Password
            </label>

            <div className="relative">

              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-11 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                placeholder="Confirm new password"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-yellow-500"
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>

            </div>
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-900 font-bold text-lg px-4 py-3 rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>

        </form>

      </div>
    </div>
  );
}