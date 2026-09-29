import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setError('This password reset link is invalid or has expired.');
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Please enter both password fields.');
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

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage('Password updated successfully!');

    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10 page-enter">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-stretch">

        {/* LEFT INFO SECTION */}
        <div className="hidden lg:flex flex-col justify-center p-10 pro-card relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6">
              <KeyRound className="w-7 h-7 text-yellow-400" />
            </div>

            <div className="text-xs font-semibold tracking-[0.2em] text-yellow-400 mb-3">
              SECURE ACCOUNT
            </div>

            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              Create your
              <span className="block text-yellow-400">
                new password.
              </span>
            </h1>

            <p className="text-slate-400 leading-7 max-w-md">
              Choose a strong password to protect your Type Master Plus
              account.
            </p>

            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Secure password
                  </p>

                  <p className="text-xs text-slate-500">
                    Use at least 6 characters.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-yellow-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Protected account
                  </p>

                  <p className="text-xs text-slate-500">
                    Your password is securely updated.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="pro-card p-6 sm:p-8 lg:p-10 flex flex-col justify-center">

          {/* Mobile Icon */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <KeyRound className="w-7 h-7 text-yellow-400" />
            </div>
          </div>

          <div className="mb-8">
            <div className="text-xs font-semibold tracking-[0.18em] text-yellow-400 mb-2">
              PASSWORD RESET
            </div>

            <h2 className="text-3xl font-black text-white mb-3">
              Set New Password
            </h2>

            <p className="text-slate-400 leading-6">
              Enter your new password below and confirm it to secure your
              account.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />

                <p className="text-sm text-red-400 leading-5">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {message && (
            <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />

                <p className="text-sm text-green-400 leading-5">
                  {message}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NEW PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-300 mb-2"
              >
                New Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pro-input w-full !pl-12 !pr-12"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-yellow-400 transition-colors"
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-slate-500">
                  Minimum 6 characters
                </p>

                {password.length >= 6 && (
                  <span className="text-xs text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Valid
                  </span>
                )}
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-slate-300 mb-2"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"
                />

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pro-input w-full !pl-12 !pr-12"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-yellow-400 transition-colors"
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

              {confirmPassword && password === confirmPassword && (
                <p className="text-xs text-green-400 flex items-center gap-1 mt-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Passwords match
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="pro-btn pro-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <KeyRound className="w-5 h-5" />
                  Set New Password
                </>
              )}
            </button>

          </form>

          {/* SECURITY NOTE */}
          <div className="mt-8 pt-6 border-t border-slate-700/50">
            <div className="flex items-start gap-3">

              <ShieldCheck className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />

              <div>
                <p className="text-sm font-semibold text-slate-300">
                  Keep your password private
                </p>

                <p className="text-xs text-slate-500 mt-1 leading-5">
                  Never share your password or password reset link with
                  anyone.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}