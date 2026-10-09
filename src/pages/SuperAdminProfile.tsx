
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  ShieldCheck,
  User,
  Code2,
  Keyboard,
  BrainCircuit,
  Database,
  Globe,
  Settings,
  Users,
  BarChart3,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  X,
  ZoomIn,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type SuperAdminData = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  is_super_admin: boolean;
};

export function SuperAdminProfile() {
  const [superAdmin, setSuperAdmin] = useState<SuperAdminData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchSuperAdmin = async () => {
      setProfileLoading(true);
      setProfileError('');

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, is_super_admin')
          .eq('is_super_admin', true)
          .limit(1)
          .maybeSingle();

        if (!active) return;

        if (error) {
          console.error('Super Admin profile error:', error);
          setProfileError(
            'Super Admin profile load झाली नाही. Supabase profiles table आणि RLS policy तपासा.'
          );
          setSuperAdmin(null);
        } else if (!data) {
          setProfileError(
            'Super Admin profile सापडली नाही. योग्य user साठी is_super_admin = true आहे का ते तपासा.'
          );
          setSuperAdmin(null);
        } else {
          setSuperAdmin(data as SuperAdminData);
        }
      } catch (error) {
        if (!active) return;
        console.error('Profile loading error:', error);
        setProfileError('Profile load करताना error आला.');
        setSuperAdmin(null);
      } finally {
        if (active) setProfileLoading(false);
      }
    };

    fetchSuperAdmin();

    return () => {
      active = false;
    };
  }, []);

  // Close photo preview with Escape and prevent background scrolling.
  useEffect(() => {
    if (!showPhotoPreview) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPhotoPreview(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPhotoPreview]);

  const skills = [
    'React',
    'TypeScript',
    'JavaScript',
    'Vite',
    'Tailwind CSS',
    'Supabase',
    'Git & GitHub',
    'Vercel',
    'AI Tools',
    'Web Development',
  ];

  const responsibilities = [
    {
      icon: Users,
      title: 'User Management',
      description:
        'Manage users, administrator access and platform-level permissions.',
    },
    {
      icon: Settings,
      title: 'Platform Management',
      description:
        'Manage important Type Master Plus settings and platform functionality.',
    },
    {
      icon: BarChart3,
      title: 'Performance Monitoring',
      description:
        'Monitor typing tests, user activity and platform statistics.',
    },
    {
      icon: ShieldCheck,
      title: 'Security & Access',
      description:
        'Control administrator permissions and protect sensitive features.',
    },
  ];

  const features = [
    'Typing Practice',
    'Quick Tests',
    'Typing Exams',
    'Learning Lessons',
    'Typing History',
    'Performance Analytics',
    'English & Marathi Support',
    'Admin Management',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Full-screen photo preview */}
      {showPhotoPreview && superAdmin?.avatar_url && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setShowPhotoPreview(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Profile photo preview"
        >
          <button
            type="button"
            onClick={() => setShowPhotoPreview(false)}
            aria-label="Close photo preview"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-slate-900/80 text-white transition hover:bg-yellow-500 hover:text-slate-950"
          >
            <X className="h-6 w-6" />
          </button>

          <img
            src={superAdmin.avatar_url}
            alt="Super Admin profile enlarged"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] max-w-[92vw] rounded-2xl border border-white/10 object-contain shadow-2xl"
          />

          <p className="absolute bottom-5 left-0 right-0 px-4 text-center text-sm text-slate-300">
            Click outside, press Escape, or click X to close
          </p>
        </div>
      )}

      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-yellow-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-yellow-500/30 hover:bg-slate-800 hover:text-yellow-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {profileLoading && (
          <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300">
            Loading Super Admin profile...
          </div>
        )}

        {profileError && (
          <div
            role="alert"
            className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-200"
          >
            {profileError}
          </div>
        )}

        {/* HERO PROFILE */}
        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-black/20">
          {/* Banner */}
          <div className="relative h-36 overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-yellow-950/40">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(234,179,8,0.18),transparent_35%)]" />

            <div className="absolute right-4 top-5 flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs font-semibold text-yellow-400 sm:right-6 sm:px-4">
              <Crown className="h-4 w-4" />
              TYPE MASTER PLUS
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative px-5 pb-7 sm:px-8">
            {/* Avatar */}
            <div className="-mt-14 mb-5 flex items-end justify-between gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (superAdmin?.avatar_url) {
                      setShowPhotoPreview(true);
                    }
                  }}
                  disabled={!superAdmin?.avatar_url}
                  aria-label="View enlarged profile photo"
                  className={`group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-slate-900 bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-xl shadow-yellow-500/10 ${
                    superAdmin?.avatar_url
                      ? 'cursor-zoom-in'
                      : 'cursor-default'
                  }`}
                >
                  {superAdmin?.avatar_url ? (
                    <img
                      src={superAdmin.avatar_url}
                      alt="Super Admin profile"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <Crown className="h-12 w-12 text-slate-950" />
                  )}

                  {superAdmin?.avatar_url && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                      <ZoomIn className="h-7 w-7" />
                    </span>
                  )}
                </button>

                {superAdmin?.avatar_url && (
                  <p className="mt-2 text-center text-xs text-slate-500">
                    Click to enlarge
                  </p>
                )}
              </div>

              <div className="hidden items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400 sm:flex">
                <CheckCircle2 className="h-4 w-4" />
                Official Profile
              </div>
            </div>

            {/* Name */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {superAdmin?.username || 'Type Master Plus Super Admin'}
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                  <Crown className="h-3.5 w-3.5" />
                  Super Admin
                </span>
              </div>

              <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                <ShieldCheck className="h-4 w-4" />
                Official Super Admin Profile
              </p>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">
                Welcome to the official Type Master Plus profile. This page
                contains information about the platform, its technology,
                features and administrative structure.
              </p>
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* ABOUT */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10">
                <User className="h-5 w-5 text-yellow-400" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  About Type Master Plus
                </h2>
                <p className="text-xs text-slate-500">
                  Professional Typing Platform
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm leading-7 text-slate-400">
              <p>
                <span className="font-semibold text-white">
                  Type Master Plus
                </span>{' '}
                is a modern typing practice and testing platform designed to
                help users improve their typing speed, accuracy and consistency.
              </p>

              <p>
                The platform provides typing practice, quick tests, exams,
                learning lessons, typing history and performance analytics in
                one professional environment.
              </p>

              <p>
                Type Master Plus also supports English and Marathi typing
                experiences and provides separate administrative tools for
                managing the platform.
              </p>
            </div>
          </section>

          {/* ROLE CARD */}
          <section className="rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-slate-900 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/15">
              <Crown className="h-6 w-6 text-yellow-400" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              Platform Administration
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Type Master Plus includes different levels of access for users,
              administrators and the Super Admin.
            </p>

            <div className="mt-6 space-y-3">
              {[
                'User access',
                'Administrator access',
                'Platform management',
                'Security controls',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* PLATFORM SECTION */}
        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-500/10">
                <Keyboard className="h-7 w-7 text-yellow-400" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white">
                  Type Master Plus
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Professional Typing Practice & Testing Platform
                </p>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                  A complete typing platform focused on improving typing speed,
                  accuracy and consistency through structured practice,
                  testing, exams, learning and performance tracking.
                </p>
              </div>
            </div>

            {/* Mini Feature Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:w-auto">
              {[
                { icon: Keyboard, label: 'Typing' },
                { icon: BarChart3, label: 'Analytics' },
                { icon: BrainCircuit, label: 'Learning' },
                { icon: Globe, label: 'Platform' },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-center"
                  >
                    <Icon className="mx-auto h-5 w-5 text-yellow-400" />
                    <p className="mt-2 text-xs text-slate-500">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* RESPONSIBILITIES */}
        <section className="mt-6">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-white">
              Platform Responsibilities
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Important areas of Type Master Plus management
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {responsibilities.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition-all hover:-translate-y-1 hover:border-yellow-500/20 hover:bg-slate-900"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 transition-all group-hover:bg-yellow-500/15">
                    <Icon className="h-5 w-5 text-yellow-400" />
                  </div>

                  <h3 className="mt-4 text-base font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* TECHNOLOGY */}
        <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10">
              <Code2 className="h-5 w-5 text-yellow-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Technology & Skills
              </h2>
              <p className="text-xs text-slate-500">
                Technologies used in the project
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:border-yellow-500/30 hover:text-yellow-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* PROJECT DETAILS */}
        <section className="mt-6 grid gap-6 md:grid-cols-2">
          {/* FEATURES */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10">
                <Database className="h-5 w-5 text-yellow-400" />
              </div>

              <h2 className="text-lg font-bold text-white">
                Platform Features
              </h2>
            </div>

            <div className="mt-5 space-y-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-sm text-slate-400"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-yellow-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* VISION */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10">
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </div>

              <h2 className="text-lg font-bold text-white">
                Platform Vision
              </h2>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              Type Master Plus aims to provide a clean, modern and professional
              typing environment where users can practice regularly, measure
              their progress and improve their typing performance over time.
            </p>

            <div className="mt-5 rounded-2xl border border-yellow-500/10 bg-yellow-500/5 p-4">
              <p className="text-sm font-medium leading-6 text-yellow-300">
                Practice consistently. Track your progress. Master your typing.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div className="mt-8 border-t border-slate-800 pt-6 text-center">
          <p className="text-xs text-slate-600">
            Type Master Plus • Official Profile
          </p>
        </div>
      </main>
    </div>
  );
}

export default SuperAdminProfile;
