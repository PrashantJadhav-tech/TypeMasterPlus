import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Keyboard,
  Lock,
  User,
  Mail,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const result = await register(username, email, password);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (result.needsEmailConfirmation) {
        setMessage(
          'Account created successfully! Please check your Gmail and confirm your email.'
        );
        setLoading(false);
        return;
      }

      setMessage('Account created successfully!');
      setLoading(false);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="page-enter min-h-screen w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">

        {/* LEFT SIDE - BRAND */}
        <div className="hidden lg:block">
          <div className="max-w-lg">

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-400">
                <Keyboard className="h-7 w-7" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
                  Type Master Plus
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Professional Typing Platform
                </p>
              </div>
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight text-white">
              Build your typing
              <span className="block text-yellow-400">
                skills every day.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
              Create your account and track your WPM, accuracy, tests,
              achievements and progress from one place.
            </p>

            <div className="mt-8 space-y-4">
              <Feature
                title="Track your progress"
                description="Keep your typing history and performance in one place."
              />

              <Feature
                title="Practice & Exam modes"
                description="Improve your speed with structured typing tests."
              />

              <Feature
                title="Achievements & XP"
                description="Build your streak and unlock typing milestones."
              />
            </div>
          </div>
        </div>

        {/* REGISTER CARD */}
        <div className="mx-auto w-full max-w-md">

          <div className="pro-card overflow-hidden">

            {/* CARD HEADER */}
            <div className="border-b border-slate-700/60 p-6 text-center sm:p-8">

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-400">
                <UserPlus className="h-7 w-7" />
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white">
                Create Account
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Start your typing improvement journey today.
              </p>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6 sm:p-8"
            >

              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <p className="text-center text-sm font-medium text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* SUCCESS */}
              {message && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                    <p className="text-sm leading-relaxed text-emerald-400">
                      {message}
                    </p>
                  </div>
                </div>
              )}

              {/* USERNAME */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Username
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    id="username"
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="pro-input w-full pl-11"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pro-input w-full pl-11"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="pro-input w-full pl-11 pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-500 transition hover:text-yellow-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* PASSWORD REQUIREMENT */}
                <div className="mt-2 flex items-center gap-2">
                  <ShieldCheck
                    className={`h-4 w-4 ${
                      password.length >= 6
                        ? 'text-emerald-400'
                        : 'text-slate-600'
                    }`}
                  />

                  <span
                    className={`text-xs ${
                      password.length >= 6
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                    }`}
                  >
                    At least 6 characters
                  </span>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="pro-btn pro-btn-primary w-full justify-center py-3.5 text-base"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Create Account
                  </>
                )}
              </button>

              {/* DIVIDER */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-700" />

                <span className="text-xs text-slate-500">
                  ALREADY A MEMBER?
                </span>

                <div className="h-px flex-1 bg-slate-700" />
              </div>

              {/* LOGIN */}
              <Link
                to="/login"
                className="flex w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-yellow-500/50 hover:bg-slate-800 hover:text-yellow-400"
              >
                Sign in to your account
              </Link>
            </form>
          </div>

          {/* MOBILE BRAND */}
          <div className="mt-6 text-center lg:hidden">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
              Type Master Plus
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Improve • Practice • Track • Achieve
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

/* =========================
   FEATURE ITEM
========================= */

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
        <CheckCircle2 className="h-5 w-5" />
      </div>

      <div>
        <h3 className="font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}