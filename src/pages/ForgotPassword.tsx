import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      'Password reset link has been sent to your email. Please check your inbox.'
    );
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10 page-enter">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-stretch">

        {/* LEFT - INFORMATION */}
        <div className="hidden lg:flex flex-col justify-center p-10 pro-card relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />

          <div className="relative z-10">

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 mb-6">
              <KeyRound className="w-7 h-7 text-yellow-400" />
            </div>

            <div className="text-xs font-semibold tracking-[0.2em] text-yellow-400 mb-3">
              ACCOUNT RECOVERY
            </div>

            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              Reset your
              <span className="block text-yellow-400">
                password securely.
              </span>
            </h1>

            <p className="text-slate-400 text-base leading-7 max-w-md">
              Enter your registered email address and we'll send you a secure
              password reset link.
            </p>

            <div className="mt-8 space-y-4">

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Secure recovery
                  </p>

                  <p className="text-xs text-slate-500">
                    Your account remains protected.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-yellow-400" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Email verification
                  </p>

                  <p className="text-xs text-slate-500">
                    Reset instructions are sent to your email.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT - FORM */}
        <div className="pro-card p-6 sm:p-8 lg:p-10 flex flex-col justify-center">

          {/* Mobile icon */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <KeyRound className="w-7 h-7 text-yellow-400" />
            </div>
          </div>

          {/* BACK TO LOGIN */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-yellow-400 transition-colors mb-8 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          <div className="mb-8">
            <div className="text-xs font-semibold tracking-[0.18em] text-yellow-400 mb-2">
              PASSWORD RECOVERY
            </div>

            <h2 className="text-3xl font-black text-white mb-3">
              Forgot Password?
            </h2>

            <p className="text-slate-400 leading-6">
              No worries. Enter your registered email and we'll send you a
              password reset link.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-400 leading-5">
                {error}
              </p>
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

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-300 mb-2"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none"
                />

                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pro-input w-full !pl-12 !pr-4"
                  placeholder="Enter your registered email"
                  autoComplete="email"
                  required
                />
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Use the email address associated with your account.
              </p>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="pro-btn pro-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Reset Link
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
                  Your security matters
                </p>

                <p className="text-xs text-slate-500 mt-1 leading-5">
                  Never share your password or reset link with anyone.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}