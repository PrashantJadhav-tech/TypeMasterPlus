
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  Mail,
  Keyboard,
  Pencil,
  Save,
  X,
  Camera,
  User,
  Crown,
  Trophy,
  Target,
  Zap,
  Flame,
  Star,
  Award,
  TrendingUp,
  CalendarDays,
  Clock,
  CheckCircle2,
  Lock,
  History,
  Settings,
  ArrowUpRight,
  Loader2,
  ZoomIn,
} from 'lucide-react';

type HistoryRow = {
  id: string;
  user_id: string;
  wpm: number | null;
  accuracy: number | null;
  correct_chars: number | null;
  incorrect_chars: number | null;
  time_elapsed: number | null;
  test_duration: number | null;
  test_type: string | null;
  passage_title: string | null;
  created_at: string | null;
};

export function Profile() {
  const { user, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoadingStats(false);
      return;
    }

    let active = true;

    const loadHistory = async () => {
      setLoadingStats(true);
      setHistoryError('');

      const { data, error } = await supabase
        .from('typing_history')
        .select(
          'id,user_id,wpm,accuracy,correct_chars,incorrect_chars,time_elapsed,test_duration,test_type,passage_title,created_at'
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!active) return;

      if (error) {
        console.error('Profile history error:', error);
        setHistoryError('Typing statistics could not be loaded.');
        setHistory([]);
      } else {
        setHistory((data || []) as HistoryRow[]);
      }

      setLoadingStats(false);
    };

    loadHistory();

    return () => {
      active = false;
    };
  }, [user?.id]);

  // Close photo preview with the Escape key.
  useEffect(() => {
    if (!showPhotoPreview) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPhotoPreview(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [showPhotoPreview]);

  // Prevent background scrolling while the photo preview is open.
  useEffect(() => {
    if (!showPhotoPreview) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showPhotoPreview]);

  const stats = useMemo(() => {
    const tests = history.length;

    const wpmValues = history
      .map((item) => Number(item.wpm) || 0)
      .filter((value) => value > 0);

    const accuracyValues = history
      .map((item) => Number(item.accuracy) || 0)
      .filter((value) => value > 0);

    const averageWpm = wpmValues.length
      ? wpmValues.reduce((sum, value) => sum + value, 0) / wpmValues.length
      : 0;

    const averageAccuracy = accuracyValues.length
      ? accuracyValues.reduce((sum, value) => sum + value, 0) /
        accuracyValues.length
      : 0;

    const bestWpm = wpmValues.length ? Math.max(...wpmValues) : 0;
    const bestAccuracy = accuracyValues.length
      ? Math.max(...accuracyValues)
      : 0;

    const practiceSeconds = history.reduce((sum, item) => {
      const seconds =
        Number(item.time_elapsed) || Number(item.test_duration) || 0;
      return sum + seconds;
    }, 0);

    return {
      tests,
      averageWpm,
      averageAccuracy,
      bestWpm,
      bestAccuracy,
      practiceSeconds,
    };
  }, [history]);

  const currentStreak = useMemo(() => {
    const daySet = new Set(
      history
        .filter((item) => item.created_at)
        .map((item) => {
          const date = new Date(item.created_at!);
          return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        })
    );

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

    let cursor = new Date(today);

    if (!daySet.has(todayKey)) {
      if (!daySet.has(yesterdayKey)) return 0;
      cursor = yesterday;
    }

    let streak = 0;

    while (true) {
      const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
      if (!daySet.has(key)) break;

      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
  }, [history]);

  const xp = useMemo(() => {
    const total =
      stats.tests * 50 +
      Math.round(stats.averageWpm * 2) +
      currentStreak * 25 +
      Math.round(stats.averageAccuracy);

    const level = Math.floor(total / 500) + 1;

    return {
      total,
      level,
      progress: ((total % 500) / 500) * 100,
      remaining: 500 - (total % 500),
    };
  }, [stats, currentStreak]);

  const achievements = useMemo(() => {
    return [
      {
        title: 'First Test',
        description: 'Complete your first typing test',
        unlocked: stats.tests >= 1,
        icon: Keyboard,
      },
      {
        title: '5 Tests',
        description: 'Complete 5 typing tests',
        unlocked: stats.tests >= 5,
        icon: Target,
      },
      {
        title: '10 Tests',
        description: 'Complete 10 typing tests',
        unlocked: stats.tests >= 10,
        icon: Trophy,
      },
      {
        title: '50 WPM',
        description: 'Reach 50 WPM',
        unlocked: stats.bestWpm >= 50,
        icon: Zap,
      },
      {
        title: '80 WPM',
        description: 'Reach 80 WPM',
        unlocked: stats.bestWpm >= 80,
        icon: TrendingUp,
      },
      {
        title: '90% Accuracy',
        description: 'Reach 90% accuracy',
        unlocked: stats.bestAccuracy >= 90,
        icon: CheckCircle2,
      },
      {
        title: '7 Day Streak',
        description: 'Practice for 7 consecutive days',
        unlocked: currentStreak >= 7,
        icon: Flame,
      },
      {
        title: '100 WPM',
        description: 'Reach 100 WPM',
        unlocked: stats.bestWpm >= 100,
        icon: Star,
      },
    ];
  }, [stats, currentStreak]);

  if (!user) return null;

  const handleEdit = () => {
    setUsername(user.username || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    const newUsername = username.trim();

    if (!newUsername) {
      alert('Username cannot be empty.');
      return;
    }

    if (newUsername.length < 3) {
      alert('Username must contain at least 3 characters.');
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { username: newUsername },
      });

      if (error) {
        alert(error.message);
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: newUsername,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile table update error:', profileError);
        alert(
          'Username updated in your account, but the profile table could not be updated.'
        );
      }

      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Username update error:', error);
      alert('Unable to update username. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image.');
      e.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Profile photo must be under 2 MB.');
      e.target.value = '';
      return;
    }

    setUploading(true);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        alert(`Photo upload failed: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;

      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (dbError) {
        alert(`Photo save failed: ${dbError.message}`);
        return;
      }

      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl },
      });

      if (authError) {
        console.error('Avatar metadata update error:', authError);
      }

      await refreshUser();
    } catch (error) {
      console.error('Photo upload error:', error);
      alert('Photo upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const avatar = user.avatarUrl;
  const unlockedCount = achievements.filter((item) => item.unlocked).length;

  return (
    <>
      {/* FULL-SCREEN PROFILE PHOTO PREVIEW */}
      {showPhotoPreview && avatar && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setShowPhotoPreview(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Profile photo preview"
        >
          <button
            type="button"
            onClick={() => setShowPhotoPreview(false)}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-900/90 text-white shadow-lg transition hover:rotate-90 hover:bg-red-600"
            aria-label="Close photo preview"
            title="Close preview"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="flex max-h-[90vh] max-w-[92vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={avatar}
              alt={`${user.username || 'User'} profile photo`}
              className="max-h-[85vh] max-w-[92vw] rounded-2xl border border-white/20 object-contain shadow-2xl"
            />
          </div>

          <p className="absolute bottom-5 left-0 right-0 px-4 text-center text-sm font-medium text-white/70">
            Click outside the photo or press Esc to close
          </p>
        </div>
      )}

      <div className="page-enter min-h-screen w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* PAGE HEADER */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
                  Typing Account
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                My Profile
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Your account, achievements and typing journey.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/history"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-yellow-500/50 hover:bg-slate-800"
              >
                <History className="h-4 w-4 text-yellow-400" />
                Typing History
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link
                to="/settings"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-yellow-500/50 hover:bg-slate-800"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                Settings
              </Link>
            </div>
          </div>

          {/* PROFILE CARD */}
          <section className="pro-card mb-8 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-yellow-500 via-amber-300 to-yellow-600" />

            <div className="p-5 sm:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                {/* AVATAR */}
                <div className="relative mx-auto md:mx-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (avatar) setShowPhotoPreview(true);
                    }}
                    disabled={!avatar}
                    aria-label="View profile photo in full size"
                    title={avatar ? 'Click to view profile photo' : 'No profile photo set'}
                    className={`group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-slate-700 bg-slate-800 shadow-xl sm:h-32 sm:w-32 ${
                      avatar
                        ? 'cursor-zoom-in transition hover:scale-105 hover:border-yellow-400'
                        : 'cursor-default'
                    }`}
                  >
                    {avatar ? (
                      <>
                        <img
                          src={avatar}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
                          <ZoomIn className="h-8 w-8" />
                        </span>
                      </>
                    ) : (
                      <User className="h-14 w-14 text-slate-400" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    title="Change profile photo"
                    aria-label="Change profile photo"
                    className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-slate-900 bg-yellow-400 text-slate-950 transition hover:bg-yellow-300 disabled:opacity-60"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handlePhoto}
                    className="hidden"
                  />
                </div>

                {/* USER DETAILS */}
                <div className="min-w-0 flex-1 text-center md:text-left">
                  {!isEditing ? (
                    <>
                      <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                        <h2 className="break-words text-2xl font-black text-white sm:text-3xl">
                          {user.username || 'Typing Member'}
                        </h2>

                        {user.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
                            <Crown className="h-3.5 w-3.5" />
                            ADMIN
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400 md:items-start">
                        <span className="flex items-center justify-center gap-2 md:justify-start">
                          <Mail className="h-4 w-4 shrink-0 text-yellow-400" />
                          <span className="break-all">{user.email}</span>
                        </span>

                        <span className="flex items-center justify-center gap-2 md:justify-start">
                          <CalendarDays className="h-4 w-4 shrink-0 text-yellow-400" />
                          Member since{' '}
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : '—'}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
                        <button
                          type="button"
                          onClick={handleEdit}
                          className="pro-btn pro-btn-primary inline-flex items-center gap-2"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Username
                        </button>

                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          disabled={uploading}
                          className="pro-btn pro-btn-secondary inline-flex items-center gap-2"
                        >
                          <Camera className="h-4 w-4" />
                          {uploading ? 'Uploading...' : 'Change Photo'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mx-auto max-w-lg md:mx-0">
                      <h2 className="mb-5 text-2xl font-bold text-white">
                        Edit Profile
                      </h2>

                      <label className="mb-2 block text-left text-sm font-medium text-slate-300">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        maxLength={30}
                        onChange={(e) => setUsername(e.target.value)}
                        className="pro-input w-full"
                        placeholder="Enter username"
                      />

                      <label className="mb-2 mt-4 block text-left text-sm font-medium text-slate-300">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email || ''}
                        disabled
                        className="pro-input w-full cursor-not-allowed opacity-60"
                      />

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={saving}
                          className="pro-btn pro-btn-primary inline-flex items-center gap-2 disabled:opacity-50"
                        >
                          {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setUsername(user.username || '');
                            setIsEditing(false);
                          }}
                          disabled={saving}
                          className="pro-btn pro-btn-secondary inline-flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* LEVEL */}
                {!isEditing && (
                  <div className="w-full rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 md:w-52">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-yellow-300">
                        Your Level
                      </span>
                      <Star className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="mt-2 text-4xl font-black text-white">
                      {loadingStats ? '—' : xp.level}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {loadingStats ? 'Loading XP...' : `${xp.total} total XP`}
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-full rounded-full bg-yellow-400 transition-all"
                        style={{ width: `${xp.progress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-400">
                      {loadingStats
                        ? 'Calculating progress'
                        : `${xp.remaining} XP to next level`}
                    </p>
                  </div>
                )}
              </div>

              {/* REAL STATS */}
              {!isEditing && (
                <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  <StatCard
                    label="Tests Completed"
                    value={loadingStats ? '—' : String(stats.tests)}
                    icon={<Keyboard className="h-5 w-5" />}
                    color="text-sky-400"
                  />
                  <StatCard
                    label="Average WPM"
                    value={loadingStats ? '—' : stats.averageWpm.toFixed(1)}
                    icon={<Zap className="h-5 w-5" />}
                    color="text-yellow-400"
                  />
                  <StatCard
                    label="Best WPM"
                    value={loadingStats ? '—' : stats.bestWpm.toFixed(1)}
                    icon={<TrendingUp className="h-5 w-5" />}
                    color="text-emerald-400"
                  />
                  <StatCard
                    label="Avg Accuracy"
                    value={
                      loadingStats ? '—' : `${stats.averageAccuracy.toFixed(1)}%`
                    }
                    icon={<Target className="h-5 w-5" />}
                    color="text-violet-400"
                  />
                </div>
              )}
            </div>
          </section>

          {/* PRACTICE OVERVIEW */}
          {!isEditing && (
            <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <OverviewCard
                icon={<Flame className="h-5 w-5" />}
                label="Current Streak"
                value={loadingStats ? '—' : `${currentStreak} days`}
                description="Consecutive days with a completed test"
                color="text-orange-400"
              />
              <OverviewCard
                icon={<Clock className="h-5 w-5" />}
                label="Practice Time"
                value={
                  loadingStats
                    ? '—'
                    : formatPracticeTime(stats.practiceSeconds)
                }
                description="Total recorded typing time"
                color="text-sky-400"
              />
              <OverviewCard
                icon={<Award className="h-5 w-5" />}
                label="Achievements"
                value={`${unlockedCount} / ${achievements.length}`}
                description="Milestones unlocked"
                color="text-yellow-400"
              />
            </section>
          )}

          {/* ACHIEVEMENTS */}
          {!isEditing && (
            <section className="pro-card mb-8 p-5 sm:p-7">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    <h2 className="text-xl font-bold text-white">
                      Achievements
                    </h2>
                  </div>
                  <p className="text-sm text-slate-400">
                    Your milestones are unlocked automatically as you improve.
                  </p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300">
                  {unlockedCount} unlocked
                </span>
              </div>

              {historyError && (
                <div className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-200">
                  {historyError} Achievements may not reflect your latest tests.
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;

                  return (
                    <div
                      key={achievement.title}
                      className={`rounded-2xl border p-4 transition ${
                        achievement.unlocked
                          ? 'border-yellow-500/25 bg-yellow-500/5'
                          : 'border-slate-700/70 bg-slate-900/40 opacity-65'
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            achievement.unlocked
                              ? 'bg-yellow-500/10 text-yellow-300'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        {achievement.unlocked ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <Lock className="h-4 w-4 text-slate-500" />
                        )}
                      </div>
                      <h3 className="font-bold text-white">
                        {achievement.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">
                        {achievement.description}
                      </p>
                      <div
                        className={`mt-3 text-xs font-bold ${
                          achievement.unlocked
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {achievement.unlocked ? 'UNLOCKED' : 'LOCKED'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ADMIN PROFILE */}
          {user.role !== 'admin' && (
            <section className="mb-8 overflow-hidden rounded-2xl border border-yellow-500/25 bg-slate-900/60 p-5 sm:p-6">
              <div className="flex flex-col items-center gap-5 sm:flex-row">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-yellow-500/30 bg-yellow-500/10">
                  <Crown className="h-7 w-7 text-yellow-400" />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <h3 className="text-lg font-bold text-white">
                      Admin Profile
                    </h3>
                    <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 text-[10px] font-bold tracking-wider text-yellow-300">
                      SUPER ADMIN
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    Meet the Super Admin of TypeMasterPlus.
                  </p>
                </div>

                <Link
                  to="/admin-profile"
                  className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-yellow-300"
                >
                  View Profile
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          )}

          {/* RECENT ACTIVITY */}
          <section className="pro-card p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <History className="h-5 w-5 text-yellow-400" />
                  <h2 className="text-xl font-bold text-white">
                    Recent Activity
                  </h2>
                </div>
                <p className="text-sm text-slate-400">
                  {loadingStats
                    ? 'Loading your typing activity...'
                    : history.length
                    ? `You have completed ${history.length} typing test${
                        history.length === 1 ? '' : 's'
                      }.`
                    : 'Complete a typing test to start building your history.'}
                </p>
              </div>

              <Link
                to="/history"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-yellow-500/50 hover:bg-slate-800"
              >
                View Full History
                <ArrowUpRight className="h-4 w-4 text-yellow-400" />
              </Link>
            </div>

            {!loadingStats && history.length > 0 && (
              <div className="mt-5 space-y-3">
                {history.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700/60 bg-slate-900/40 p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-yellow-400">
                        <Keyboard className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {item.passage_title ||
                            `${formatTestType(item.test_type)} Test`}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : 'Date unavailable'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold text-yellow-300">
                          {Number(item.wpm || 0).toFixed(1)} WPM
                        </p>
                        <p className="text-xs text-slate-400">
                          {Number(item.accuracy || 0).toFixed(1)}% accuracy
                        </p>
                      </div>
                      <span className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs capitalize text-slate-300">
                        {formatTestType(item.test_type)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Your typing statistics are based on your saved test history.
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="stat-card min-w-0 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-400 sm:text-sm">
          {label}
        </span>
        <span className={color}>{icon}</span>
      </div>
      <div className="break-words text-2xl font-black text-white sm:text-3xl">
        {value}
      </div>
    </div>
  );
}

function OverviewCard({
  icon,
  label,
  value,
  description,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div className="pro-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className={color}>{icon}</div>
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        {description}
      </p>
    </div>
  );
}

function formatPracticeTime(seconds: number) {
  if (!seconds || seconds < 0) return '0 min';

  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${totalMinutes} min`;
}

function formatTestType(type: string | null) {
  if (!type) return 'Practice';

  if (type.toLowerCase() === 'quick') return 'Quick Test';
  if (type.toLowerCase() === 'exam') return 'Exam';

  return 'Practice';
}
