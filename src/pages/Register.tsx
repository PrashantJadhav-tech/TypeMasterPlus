
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
  Sparkles,
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

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  const passedRules = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  ].filter(Boolean).length;

  const isStrongPassword = passedRules === 5;

  const strength = !password
    ? ''
    : isStrongPassword
      ? 'Strong'
      : passedRules >= 3
        ? 'Medium'
        : 'Weak';

  const suggestStrongPassword = () => {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnopqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%&*?';
    const all = upper + lower + numbers + symbols;

    const pick = (chars: string) =>
      chars[Math.floor(Math.random() * chars.length)];

    const chars = [
      pick(upper),
      pick(lower),
      pick(numbers),
      pick(symbols),
    ];

    while (chars.length < 14) {
      chars.push(pick(all));
    }

    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    setPassword(chars.join(''));
    setShowPassword(true);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!username.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isStrongPassword) {
      setError(
        'Weak password! Use at least 8 characters, uppercase, lowercase, a number and a special character.'
      );
      return;
    }

    setLoading(true);

    try {
      const result = await register(username.trim(), email.trim(), password);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.needsEmailConfirmation) {
        setMessage(
          'Account created successfully! Please check your Gmail and confirm your email.'
        );
        return;
      }

      setMessage('Account created successfully!');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
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
            <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">

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
                    className="pro-input w-full !pl-12"
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
                    className="pro-input w-full !pl-12"
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                      setMessage('');
                    }}
                    placeholder="Create a strong password"
                    className="pro-input w-full !pl-12 !pr-12"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-500 transition hover:text-yellow-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* PASSWORD STRENGTH */}
                {password && (
                  <div className="mt-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Password strength
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          strength === 'Strong'
                            ? 'text-emerald-400'
                            : strength === 'Medium'
                              ? 'text-yellow-400'
                              : 'text-red-400'
                        }`}
                      >
                        {strength}
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full ${
                            level <= passedRules
                              ? strength === 'Strong'
                                ? 'bg-emerald-400'
                                : strength === 'Medium'
                                  ? 'bg-yellow-400'
                                  : 'bg-red-400'
                              : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* PASSWORD REQUIREMENTS */}
                <div className="mt-3 space-y-2">
                  <PasswordRule passed={hasMinLength} text="At least 8 characters" />
                  <PasswordRule passed={hasUppercase} text="One uppercase letter (A-Z)" />
                  <PasswordRule passed={hasLowercase} text="One lowercase letter (a-z)" />
                  <PasswordRule passed={hasNumber} text="One number (0-9)" />
                  <PasswordRule passed={hasSpecialChar} text="One special character (!@#$% etc.)" />
                </div>

                {/* SUGGEST STRONG PASSWORD */}
                <button
                  type="button"
                  onClick={suggestStrongPassword}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm font-bold text-yellow-400 transition hover:border-yellow-400/60 hover:bg-yellow-500/15"
                >
                  <Sparkles className="h-4 w-4" />
                  Suggest Strong Password
                </button>

                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Use the suggestion or create your own password that meets
                  all five requirements.
                </p>
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

/* PASSWORD REQUIREMENT ITEM */
function PasswordRule({
  passed,
  text,
}: {
  passed: boolean;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {passed ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
      ) : (
        <ShieldCheck className="h-4 w-4 shrink-0 text-slate-600" />
      )}

      <span className={`text-xs ${passed ? 'text-emerald-400' : 'text-slate-500'}`}>
        {text}
      </span>
    </div>
  );
}

/* FEATURE ITEM */
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
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
