import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Trophy,
  Clock,
  History as HistoryIcon,
  ChevronRight,
  Play,
  Target,
  TrendingUp,
  TrendingDown,
  Zap,
  BarChart3,
  ArrowUpRight,
  Flame,
  Award,
  Star,
  Gauge,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type HistoryRow = {
  id: string;
  user_id: string;
  wpm: number | null;
  accuracy: number | null;
  correct_chars: number | null;
  incorrect_chars: number | null;
  total_keystrokes: number | null;
  correct_words: number | null;
  wrong_words: number | null;
  time_elapsed: number | null;
  test_duration: number | null;
  test_type: string | null;
  passage_title: string | null;
  created_at?: string | null;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: string;
};

export function Dashboard() {
  const { user } = useAuth();

  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* =========================================
     LOAD REAL HISTORY
  ========================================= */

  useEffect(() => {
    if (!user?.id) return;

    const loadHistory = async () => {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('typing_history')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('DASHBOARD HISTORY ERROR:', error);
        setError('Unable to load typing history.');
        setHistory([]);
        setLoading(false);
        return;
      }

      const rows = (data || []) as HistoryRow[];

      rows.sort((a, b) => {
        const dateA = a.created_at
          ? new Date(a.created_at).getTime()
          : 0;

        const dateB = b.created_at
          ? new Date(b.created_at).getTime()
          : 0;

        return dateB - dateA;
      });

      setHistory(rows);
      setLoading(false);
    };

    loadHistory();
  }, [user?.id]);

  /* =========================================
     REAL OVERALL STATS
  ========================================= */

  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        averageWpm: 0,
        bestWpm: 0,
        averageAccuracy: 0,
        bestAccuracy: 0,
        practiceSeconds: 0,
        testsTaken: 0,
      };
    }

    const validWpm = history
      .map((item) => Number(item.wpm || 0))
      .filter((value) => value > 0);

    const validAccuracy = history
      .map((item) => Number(item.accuracy || 0))
      .filter((value) => value >= 0);

    const averageWpm =
      validWpm.length > 0
        ? validWpm.reduce((sum, value) => sum + value, 0) /
          validWpm.length
        : 0;

    const bestWpm =
      validWpm.length > 0
        ? Math.max(...validWpm)
        : 0;

    const averageAccuracy =
      validAccuracy.length > 0
        ? validAccuracy.reduce((sum, value) => sum + value, 0) /
          validAccuracy.length
        : 0;

    const bestAccuracy =
      validAccuracy.length > 0
        ? Math.max(...validAccuracy)
        : 0;

    const practiceSeconds = history.reduce(
      (sum, item) =>
        sum + Number(item.time_elapsed || 0),
      0
    );

    return {
      averageWpm,
      bestWpm,
      averageAccuracy,
      bestAccuracy,
      practiceSeconds,
      testsTaken: history.length,
    };
  }, [history]);

  /* =========================================
     TODAY STATS
  ========================================= */

  const todayStats = useMemo(() => {
    const today = new Date();

    const todayTests = history.filter((item) =>
      isSameCalendarDay(item.created_at, today)
    );

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const yesterdayTests = history.filter((item) =>
      isSameCalendarDay(item.created_at, yesterday)
    );

    const todayWpms = todayTests
      .map((item) => Number(item.wpm || 0))
      .filter((value) => value > 0);

    const yesterdayWpms = yesterdayTests
      .map((item) => Number(item.wpm || 0))
      .filter((value) => value > 0);

    const todayAverage =
      todayWpms.length > 0
        ? todayWpms.reduce((sum, value) => sum + value, 0) /
          todayWpms.length
        : 0;

    const yesterdayAverage =
      yesterdayWpms.length > 0
        ? yesterdayWpms.reduce((sum, value) => sum + value, 0) /
          yesterdayWpms.length
        : 0;

    const difference =
      todayAverage > 0 && yesterdayAverage > 0
        ? todayAverage - yesterdayAverage
        : 0;

    return {
      tests: todayTests.length,
      averageWpm: todayAverage,
      yesterdayAverage,
      difference,
    };
  }, [history]);

  /* =========================================
     STREAK
  ========================================= */

  const streak = useMemo(() => {
    return calculateCurrentStreak(history);
  }, [history]);

  /* =========================================
     DAILY GOAL
  ========================================= */

  const dailyGoal = 4;

  const dailyProgress = Math.min(
    100,
    Math.round((todayStats.tests / dailyGoal) * 100)
  );

  /* =========================================
     XP + LEVEL
  ========================================= */

  const xpData = useMemo(() => {
    /*
      XP is calculated from real typing history.
      It is NOT stored in Supabase.
    */

    const testXP = stats.testsTaken * 50;
    const speedXP = Math.round(stats.averageWpm * 2);
    const streakXP = streak * 25;
    const accuracyXP = Math.round(stats.averageAccuracy);

    const totalXP =
      testXP +
      speedXP +
      streakXP +
      accuracyXP;

    const xpPerLevel = 500;

    const level =
      Math.floor(totalXP / xpPerLevel) + 1;

    const currentLevelXP =
      totalXP % xpPerLevel;

    const progress =
      Math.min(
        100,
        Math.round(
          (currentLevelXP / xpPerLevel) * 100
        )
      );

    const remainingXP =
      xpPerLevel - currentLevelXP;

    return {
      totalXP,
      level,
      currentLevelXP,
      progress,
      remainingXP,
      xpPerLevel,
    };
  }, [
    stats.testsTaken,
    stats.averageWpm,
    stats.averageAccuracy,
    streak,
  ]);

  /* =========================================
     ACHIEVEMENTS
  ========================================= */

  const achievements = useMemo<Achievement[]>(() => {
    return [
      {
        id: 'first-test',
        title: 'First Test',
        description: 'Complete your first typing test.',
        icon: <Play className="w-4 h-4" />,
        unlocked: stats.testsTaken >= 1,
        progress:
          stats.testsTaken >= 1
            ? 'Unlocked'
            : '0 / 1 test',
      },
      {
        id: 'five-tests',
        title: 'Getting Started',
        description: 'Complete 5 typing tests.',
        icon: <Target className="w-4 h-4" />,
        unlocked: stats.testsTaken >= 5,
        progress: `${Math.min(stats.testsTaken, 5)} / 5`,
      },
      {
        id: 'ten-tests',
        title: 'Consistent Typist',
        description: 'Complete 10 typing tests.',
        icon: <Award className="w-4 h-4" />,
        unlocked: stats.testsTaken >= 10,
        progress: `${Math.min(stats.testsTaken, 10)} / 10`,
      },
      {
        id: 'fifty-wpm',
        title: '50 WPM',
        description: 'Reach 50 WPM.',
        icon: <Gauge className="w-4 h-4" />,
        unlocked: stats.bestWpm >= 50,
        progress:
          stats.bestWpm >= 50
            ? 'Unlocked'
            : `${formatNumber(stats.bestWpm)} / 50 WPM`,
      },
      {
        id: 'eighty-wpm',
        title: '80 WPM',
        description: 'Reach 80 WPM.',
        icon: <Zap className="w-4 h-4" />,
        unlocked: stats.bestWpm >= 80,
        progress:
          stats.bestWpm >= 80
            ? 'Unlocked'
            : `${formatNumber(stats.bestWpm)} / 80 WPM`,
      },
      {
        id: 'ninety-accuracy',
        title: 'Precision',
        description: 'Reach 90% accuracy.',
        icon: <CheckCircle2 className="w-4 h-4" />,
        unlocked: stats.bestAccuracy >= 90,
        progress:
          stats.bestAccuracy >= 90
            ? 'Unlocked'
            : `${formatNumber(stats.bestAccuracy)} / 90%`,
      },
      {
        id: 'seven-day-streak',
        title: '7 Day Streak',
        description: 'Maintain a 7 day typing streak.',
        icon: <Flame className="w-4 h-4" />,
        unlocked: streak >= 7,
        progress:
          streak >= 7
            ? 'Unlocked'
            : `${Math.min(streak, 7)} / 7 days`,
      },
      {
        id: 'hundred-wpm',
        title: '100 WPM',
        description: 'Reach 100 WPM.',
        icon: <Trophy className="w-4 h-4" />,
        unlocked: stats.bestWpm >= 100,
        progress:
          stats.bestWpm >= 100
            ? 'Unlocked'
            : `${formatNumber(stats.bestWpm)} / 100 WPM`,
      },
    ];
  }, [
    stats.testsTaken,
    stats.bestWpm,
    stats.bestAccuracy,
    streak,
  ]);

  const unlockedAchievements = achievements.filter(
    (achievement) => achievement.unlocked
  ).length;

  /* =========================================
     GRAPH DATA
  ========================================= */

  const chartData = useMemo(() => {
    const recent = [...history]
      .slice(0, 12)
      .reverse();

    if (recent.length === 0) {
      return [];
    }

    return recent.map((item, index) => {
      const wpm = Number(item.wpm || 0);

      const height = Math.max(
        8,
        Math.min(100, (wpm / 120) * 100)
      );

      return {
        id: item.id || String(index),
        wpm,
        height,
        label: formatShortDate(
          item.created_at,
          index
        ),
      };
    });
  }, [history]);

  /* =========================================
     RECENT TESTS
  ========================================= */

  const recentTests = useMemo(() => {
    return history.slice(0, 5);
  }, [history]);

  const practiceTime = formatPracticeTime(
    stats.practiceSeconds
  );

  if (!user) return null;

  return (
    <div className="app-background min-h-screen">

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 page-enter">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>

            <div className="flex items-center gap-2 mb-2">

              <span className="pro-badge">
                <Activity className="w-3.5 h-3.5" />
                TYPING DASHBOARD
              </span>

            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Welcome back, {user.username} 👋
            </h1>

            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Track your progress and improve your typing performance.
            </p>

          </div>

          <div className="flex gap-3">

            <Link
              to="/history"
              className="pro-btn pro-btn-secondary"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Link>

            <Link
              to="/practice"
              className="pro-btn pro-btn-primary"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Practice
            </Link>

          </div>

        </div>

        {/* =========================================
            ERROR
        ========================================= */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* =========================================
            STAT CARDS
        ========================================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">

          <StatCard
            icon={<Activity className="w-5 h-5" />}
            title="Average WPM"
            value={
              loading
                ? '...'
                : formatNumber(stats.averageWpm)
            }
            change={
              loading
                ? 'Loading...'
                : `${stats.testsTaken} ${
                    stats.testsTaken === 1
                      ? 'test'
                      : 'tests'
                  }`
            }
            iconClass="bg-yellow-500/10 text-yellow-400"
          />

          <StatCard
            icon={<Trophy className="w-5 h-5" />}
            title="Best WPM"
            value={
              loading
                ? '...'
                : formatNumber(stats.bestWpm)
            }
            change={
              stats.bestWpm > 0
                ? 'Personal Best'
                : 'No record yet'
            }
            iconClass="bg-emerald-500/10 text-emerald-400"
          />

          <StatCard
            icon={<Clock className="w-5 h-5" />}
            title="Practice Time"
            value={
              loading
                ? '...'
                : practiceTime
            }
            change="Total recorded"
            iconClass="bg-blue-500/10 text-blue-400"
          />

          <StatCard
            icon={<HistoryIcon className="w-5 h-5" />}
            title="Tests Taken"
            value={
              loading
                ? '...'
                : String(stats.testsTaken)
            }
            change={
              stats.testsTaken > 0
                ? 'Typing sessions'
                : 'Start your first test'
            }
            iconClass="bg-purple-500/10 text-purple-400"
          />

        </div>

        {/* =========================================
            STEP 7 - STREAK / TODAY / XP
        ========================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          {/* STREAK */}

          <div className="pro-card p-5 relative overflow-hidden">

            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-orange-500/10 blur-2xl" />

            <div className="relative">

              <div className="flex items-center justify-between mb-4">

                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>

                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                  Current
                </span>

              </div>

              <div className="flex items-end gap-2">

                <span className="text-3xl font-black text-white">
                  {streak}
                </span>

                <span className="text-sm text-slate-500 pb-1">
                  {streak === 1 ? 'day' : 'days'}
                </span>

              </div>

              <p className="text-xs text-slate-500 mt-2">
                {streak > 0
                  ? 'Keep your streak alive!'
                  : 'Complete a test today to start.'}
              </p>

            </div>

          </div>

          {/* TODAY WPM */}

          <div className="pro-card p-5">

            <div className="flex items-center justify-between mb-4">

              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Gauge className="w-5 h-5 text-yellow-400" />
              </div>

              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                Today
              </span>

            </div>

            <div className="flex items-end gap-2">

              <span className="text-3xl font-black text-white">
                {loading
                  ? '...'
                  : formatNumber(todayStats.averageWpm)}
              </span>

              <span className="text-sm text-slate-500 pb-1">
                WPM
              </span>

            </div>

            <div className="flex items-center gap-1 mt-2">

              {todayStats.difference > 0 ? (
                <>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-emerald-400">
                    +{formatNumber(todayStats.difference)} vs yesterday
                  </span>
                </>
              ) : todayStats.difference < 0 ? (
                <>
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs text-red-400">
                    {formatNumber(todayStats.difference)} vs yesterday
                  </span>
                </>
              ) : (
                <span className="text-xs text-slate-500">
                  {todayStats.tests > 0
                    ? 'No change vs yesterday'
                    : 'No tests today'}
                </span>
              )}

            </div>

          </div>

          {/* DAILY GOAL */}

          <div className="pro-card p-5">

            <div className="flex items-center justify-between mb-4">

              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-400" />
              </div>

              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                Daily Goal
              </span>

            </div>

            <div className="flex items-end justify-between mb-2">

              <span className="text-3xl font-black text-white">
                {dailyProgress}%
              </span>

              <span className="text-xs text-slate-500">
                {todayStats.tests} / {dailyGoal}
              </span>

            </div>

            <div className="pro-progress">

              <div
                style={{
                  width: `${dailyProgress}%`,
                }}
              />

            </div>

            <p className="text-[11px] text-slate-500 mt-2">

              {todayStats.tests >= dailyGoal
                ? "Goal completed! 🎉"
                : `${dailyGoal - todayStats.tests} more test${
                    dailyGoal - todayStats.tests === 1
                      ? ''
                      : 's'
                  } today`}

            </p>

          </div>

          {/* XP / LEVEL */}

          <div className="pro-card p-5">

            <div className="flex items-center justify-between mb-4">

              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-400" />
              </div>

              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                Level {xpData.level}
              </span>

            </div>

            <div className="flex items-end justify-between mb-2">

              <span className="text-3xl font-black text-white">
                {xpData.totalXP}
              </span>

              <span className="text-xs text-slate-500">
                XP
              </span>

            </div>

            <div className="pro-progress">

              <div
                style={{
                  width: `${xpData.progress}%`,
                }}
              />

            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              {xpData.remainingXP} XP to Level {xpData.level + 1}
            </p>

          </div>

        </div>

        {/* =========================================
            ACHIEVEMENTS
        ========================================= */}

        <div className="pro-card p-5 sm:p-6 mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

            <div>

              <div className="flex items-center gap-2">

                <Award className="w-5 h-5 text-yellow-400" />

                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Achievements
                </h2>

              </div>

              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Unlock milestones as you improve your typing skills.
              </p>

            </div>

            <div className="text-xs font-semibold text-slate-400">
              <span className="text-yellow-400">
                {unlockedAchievements}
              </span>
              {' / '}
              {achievements.length} unlocked
            </div>

          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

            {achievements.map((achievement) => (

              <div
                key={achievement.id}
                className={`rounded-xl border p-4 transition-all ${
                  achievement.unlocked
                    ? 'border-yellow-500/20 bg-yellow-500/5'
                    : 'border-slate-800 bg-slate-950/40'
                }`}
              >

                <div className="flex items-center justify-between mb-3">

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      achievement.unlocked
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-slate-900 text-slate-600'
                    }`}
                  >
                    {achievement.unlocked ? (
                      achievement.icon
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>

                  {achievement.unlocked && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}

                </div>

                <p
                  className={`text-xs font-bold ${
                    achievement.unlocked
                      ? 'text-slate-200'
                      : 'text-slate-500'
                  }`}
                >
                  {achievement.title}
                </p>

                <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                  {achievement.description}
                </p>

                <p
                  className={`text-[10px] mt-2 font-semibold ${
                    achievement.unlocked
                      ? 'text-emerald-400'
                      : 'text-slate-600'
                  }`}
                >
                  {achievement.progress}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* =========================================
            MAIN GRID
        ========================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* =========================================
              LEFT
          ========================================= */}

          <div className="lg:col-span-2 space-y-6">

            {/* =========================================
                PERFORMANCE
            ========================================= */}

            <div className="pro-card p-5 sm:p-6">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <div className="flex items-center gap-2">

                    <TrendingUp className="w-5 h-5 text-yellow-400" />

                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      Performance Overview
                    </h2>

                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Your recent typing performance
                  </p>

                </div>

                <Link
                  to="/history"
                  className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold flex items-center gap-1"
                >
                  Details
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

              </div>

              {/* GRAPH */}

              <div className="h-64 rounded-2xl bg-slate-950/60 border border-slate-800 p-4 relative overflow-hidden">

                {loading ? (

                  <div className="h-full flex items-center justify-center text-sm text-slate-500">
                    Loading performance...
                  </div>

                ) : chartData.length === 0 ? (

                  <div className="h-full flex flex-col items-center justify-center text-center">

                    <TrendingUp className="w-8 h-8 text-slate-700 mb-3" />

                    <p className="text-sm font-semibold text-slate-400">
                      No performance data yet
                    </p>

                    <p className="text-xs text-slate-600 mt-1">
                      Complete a typing test to see your graph.
                    </p>

                  </div>

                ) : (

                  <>

                    {/* Horizontal grid */}

                    <div className="absolute inset-x-4 top-5 bottom-10 flex flex-col justify-between pointer-events-none">

                      <div className="border-t border-slate-800" />
                      <div className="border-t border-slate-800" />
                      <div className="border-t border-slate-800" />
                      <div className="border-t border-slate-800" />
                      <div className="border-t border-slate-800" />

                    </div>

                    {/* Y labels */}

                    <div className="absolute left-1 top-5 bottom-10 flex flex-col justify-between text-[9px] text-slate-600">

                      <span>120</span>
                      <span>90</span>
                      <span>60</span>
                      <span>30</span>
                      <span>0</span>

                    </div>

                    {/* Bars */}

                    <div className="absolute left-8 right-4 top-5 bottom-10 flex items-end gap-2 sm:gap-4">

                      {chartData.map((item) => (

                        <div
                          key={item.id}
                          className="flex-1 h-full flex items-end min-w-0"
                        >

                          <div
                            title={`${item.wpm} WPM`}
                            className="w-full rounded-t-md bg-gradient-to-t from-yellow-600/40 to-yellow-400/90 transition-all duration-500 hover:from-yellow-500 hover:to-yellow-300 cursor-pointer"
                            style={{
                              height: `${item.height}%`,
                              minHeight: '8px',
                            }}
                          />

                        </div>

                      ))}

                    </div>

                    {/* X labels */}

                    <div className="absolute bottom-2 left-8 right-4 flex justify-between text-[9px] text-slate-600">

                      {chartData.map((item) => (

                        <span
                          key={`${item.id}-label`}
                          className="text-center truncate"
                        >
                          {item.label}
                        </span>

                      ))}

                    </div>

                  </>

                )}

              </div>

              {/* MINI STATS */}

              <div className="grid grid-cols-3 gap-3 mt-5">

                <MiniStat
                  label="Average"
                  value={`${formatNumber(
                    stats.averageWpm
                  )} WPM`}
                />

                <MiniStat
                  label="Accuracy"
                  value={`${formatNumber(
                    stats.averageAccuracy
                  )}%`}
                />

                <MiniStat
                  label="Best"
                  value={`${formatNumber(
                    stats.bestWpm
                  )} WPM`}
                />

              </div>

            </div>

            {/* =========================================
                RECENT TESTS
            ========================================= */}

            <div className="pro-card p-5 sm:p-6">

              <div className="flex items-center justify-between mb-5">

                <div>

                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Recent Tests
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Your latest typing sessions
                  </p>

                </div>

                <Link
                  to="/history"
                  className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>

              </div>

              {loading ? (

                <div className="py-8 text-center text-sm text-slate-500">
                  Loading tests...
                </div>

              ) : recentTests.length === 0 ? (

                <div className="py-8 text-center">

                  <HistoryIcon className="w-8 h-8 text-slate-700 mx-auto mb-3" />

                  <p className="text-sm font-semibold text-slate-400">
                    No tests completed yet
                  </p>

                  <Link
                    to="/practice"
                    className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-yellow-400 hover:text-yellow-300"
                  >
                    Start your first test
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                </div>

              ) : (

                <div className="space-y-3">

                  {recentTests.map((item) => (

                    <RecentTest
                      key={item.id}
                      wpm={Number(item.wpm || 0)}
                      accuracy={Number(
                        item.accuracy || 0
                      )}
                      chars={Number(
                        item.total_keystrokes || 0
                      )}
                      time={formatRelativeTime(
                        item.created_at
                      )}
                      testType={
                        item.test_type || 'practice'
                      }
                      passageTitle={
                        item.passage_title || ''
                      }
                    />

                  ))}

                </div>

              )}

            </div>

          </div>

          {/* =========================================
              RIGHT SIDEBAR
          ========================================= */}

          <div className="space-y-6">

            {/* QUICK ACTIONS */}

            <div className="pro-card p-5 sm:p-6">

              <div className="flex items-center gap-2 mb-5">

                <Zap className="w-5 h-5 text-yellow-400" />

                <h2 className="text-lg font-bold text-white">
                  Quick Actions
                </h2>

              </div>

              <div className="space-y-3">

                <QuickAction
                  to="/practice"
                  icon={<Play className="w-5 h-5" />}
                  title="Start Practice"
                  description="Improve your speed"
                  className="yellow"
                />

                <QuickAction
                  to="/exam"
                  icon={<Target className="w-5 h-5" />}
                  title="Take Exam"
                  description="Test your skills"
                  className="red"
                />

                <QuickAction
                  to="/passages"
                  icon={
                    <HistoryIcon className="w-5 h-5" />
                  }
                  title="Passage Library"
                  description="Explore passages"
                  className="blue"
                />

              </div>

            </div>

            {/* DAILY GOAL DETAIL */}

            <div className="pro-card p-5 sm:p-6">

              <div className="flex items-start justify-between mb-5">

                <div>

                  <p className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                    Daily Goal
                  </p>

                  <h2 className="text-xl font-bold text-white mt-1">
                    {todayStats.tests >= dailyGoal
                      ? 'Goal Complete!'
                      : 'Keep going!'}
                  </h2>

                </div>

                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-yellow-400" />
                </div>

              </div>

              <div className="flex items-end justify-between mb-2">

                <span className="text-3xl font-black text-white">
                  {dailyProgress}%
                </span>

                <span className="text-xs text-slate-500">
                  {todayStats.tests} / {dailyGoal} tests
                </span>

              </div>

              <div className="pro-progress">

                <div
                  style={{
                    width: `${dailyProgress}%`,
                  }}
                />

              </div>

              <p className="text-xs text-slate-500 mt-3">

                {todayStats.tests >= dailyGoal
                  ? "Today's goal completed! Great work."
                  : `Complete ${
                      dailyGoal - todayStats.tests
                    } more test${
                      dailyGoal - todayStats.tests === 1
                        ? ''
                        : 's'
                    } to reach today's goal.`}

              </p>

            </div>

            {/* XP CARD */}

            <div className="relative overflow-hidden rounded-2xl border border-purple-500/15 bg-gradient-to-br from-purple-500/10 via-slate-900 to-slate-950 p-5">

              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-purple-400/10 blur-2xl" />

              <div className="relative">

                <div className="flex items-center gap-2 text-purple-400 mb-3">

                  <Star className="w-5 h-5" />

                  <span className="text-xs font-bold uppercase tracking-wider">
                    Typing Level
                  </span>

                </div>

                <div className="flex items-end gap-2">

                  <div className="text-4xl font-black text-white">
                    {xpData.level}
                  </div>

                  <span className="text-sm font-semibold text-slate-400 pb-1">
                    Level
                  </span>

                </div>

                <div className="mt-4">

                  <div className="flex items-center justify-between mb-1">

                    <span className="text-[10px] text-slate-500">
                      Level progress
                    </span>

                    <span className="text-[10px] text-purple-400 font-semibold">
                      {xpData.progress}%
                    </span>

                  </div>

                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400 transition-all duration-500"
                      style={{
                        width: `${xpData.progress}%`,
                      }}
                    />

                  </div>

                </div>

                <p className="text-xs text-slate-500 mt-3">
                  {xpData.totalXP} total XP earned from your typing activity.
                </p>

              </div>

            </div>

            {/* PERSONAL BEST */}

            <div className="relative overflow-hidden rounded-2xl border border-yellow-500/15 bg-gradient-to-br from-yellow-500/10 via-slate-900 to-slate-950 p-5">

              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-yellow-400/10 blur-2xl" />

              <div className="relative">

                <div className="flex items-center gap-2 text-yellow-400 mb-3">

                  <Trophy className="w-5 h-5" />

                  <span className="text-xs font-bold uppercase tracking-wider">
                    Personal Best
                  </span>

                </div>

                <div className="text-4xl font-black text-white">

                  {loading
                    ? '...'
                    : formatNumber(
                        stats.bestWpm
                      )}

                  <span className="text-base font-semibold text-slate-400 ml-2">
                    WPM
                  </span>

                </div>

                <p className="text-xs text-slate-500 mt-2">

                  {stats.bestWpm > 0
                    ? 'Keep practicing to beat your record.'
                    : 'Complete a test to set your personal best.'}

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =========================================
   STAT CARD
========================================= */

function StatCard({
  icon,
  title,
  value,
  change,
  iconClass,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  iconClass: string;
}) {
  return (
    <div className="stat-card group">

      <div className="flex items-start justify-between mb-4">

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>

      </div>

      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
        {value}
      </div>

      <div className="text-xs sm:text-sm text-slate-400 mt-1">
        {title}
      </div>

      <div className="text-[11px] text-slate-500 mt-2">
        {change}
      </div>

    </div>
  );
}

/* =========================================
   MINI STAT
========================================= */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-950/50 border border-slate-800 p-3">

      <p className="text-[11px] text-slate-500 mb-1">
        {label}
      </p>

      <p className="text-sm sm:text-base font-bold text-white">
        {value}
      </p>

    </div>
  );
}

/* =========================================
   RECENT TEST
========================================= */

function RecentTest({
  wpm,
  accuracy,
  chars,
  time,
  testType,
  passageTitle,
}: {
  wpm: number;
  accuracy: number;
  chars: number;
  time: string;
  testType: string;
  passageTitle: string;
}) {
  const displayType =
    testType.toLowerCase() === 'quick'
      ? 'Quick Test'
      : testType.toLowerCase() === 'exam'
      ? 'Exam'
      : 'Practice';

  return (
    <div className="group flex items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-950/45 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/70 transition-all">

      <div className="flex items-center gap-3 min-w-0">

        <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-yellow-500/10 border border-yellow-500/10 flex items-center justify-center">

          <span className="text-base sm:text-lg font-black text-yellow-400">
            {formatNumber(wpm)}
          </span>

        </div>

        <div className="min-w-0">

          <p className="text-sm font-semibold text-slate-200 truncate">

            {displayType}

            {passageTitle
              ? ` • ${passageTitle}`
              : ''}

          </p>

          <p className="text-xs text-slate-500 mt-1">
            {time} • {chars} chars
          </p>

        </div>

      </div>

      <div className="text-right shrink-0">

        <p className="text-sm font-bold text-emerald-400">
          {formatNumber(accuracy)}%
        </p>

        <p className="text-[10px] text-slate-500">
          accuracy
        </p>

      </div>

    </div>
  );
}

/* =========================================
   QUICK ACTION
========================================= */

function QuickAction({
  to,
  icon,
  title,
  description,
  className,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  className: 'yellow' | 'red' | 'blue';
}) {
  const styles = {
    yellow:
      'bg-yellow-500/8 border-yellow-500/10 text-yellow-400 hover:bg-yellow-500/12',

    red:
      'bg-red-500/8 border-red-500/10 text-red-400 hover:bg-red-500/12',

    blue:
      'bg-blue-500/8 border-blue-500/10 text-blue-400 hover:bg-blue-500/12',
  };

  return (
    <Link
      to={to}
      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all hover:-translate-y-0.5 ${styles[className]}`}
    >

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-lg bg-slate-950/40 flex items-center justify-center">
          {icon}
        </div>

        <div>

          <p className="text-sm font-bold text-slate-200">
            {title}
          </p>

          <p className="text-[11px] text-slate-500 mt-0.5">
            {description}
          </p>

        </div>

      </div>

      <ChevronRight className="w-4 h-4 text-slate-600" />

    </Link>
  );
}

/* =========================================
   HELPERS
========================================= */

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(1);
}

/* =========================================
   PRACTICE TIME
========================================= */

function formatPracticeTime(totalSeconds: number) {
  const seconds = Math.max(
    0,
    Math.floor(totalSeconds)
  );

  const hours = Math.floor(
    seconds / 3600
  );

  const minutes = Math.floor(
    (seconds % 3600) / 60
  );

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return `${seconds}s`;
}

/* =========================================
   SHORT DATE
========================================= */

function formatShortDate(
  createdAt: string | null | undefined,
  fallbackIndex: number
) {
  if (!createdAt) {
    return `#${fallbackIndex + 1}`;
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return `#${fallbackIndex + 1}`;
  }

  return date.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
    }
  );
}

/* =========================================
   RELATIVE TIME
========================================= */

function formatRelativeTime(
  createdAt: string | null | undefined
) {
  if (!createdAt) {
    return 'Recent';
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return 'Recent';
  }

  const now = Date.now();

  const diff = Math.max(
    0,
    now - date.getTime()
  );

  const minutes = Math.floor(
    diff / 60000
  );

  const hours = Math.floor(
    diff / 3600000
  );

  const days = Math.floor(
    diff / 86400000
  );

  if (minutes < 1) {
    return 'Just now';
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  if (days === 1) {
    return 'Yesterday';
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  return date.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );
}

/* =========================================
   SAME CALENDAR DAY
========================================= */

function isSameCalendarDay(
  createdAt: string | null | undefined,
  targetDate: Date
) {
  if (!createdAt) {
    return false;
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return (
    date.getDate() === targetDate.getDate() &&
    date.getMonth() === targetDate.getMonth() &&
    date.getFullYear() === targetDate.getFullYear()
  );
}

/* =========================================
   CURRENT STREAK
========================================= */

function calculateCurrentStreak(
  history: HistoryRow[]
) {
  if (history.length === 0) {
    return 0;
  }

  /*
    Get unique local calendar dates
    on which the user completed a test.
  */

  const dateKeys = new Set<string>();

  history.forEach((item) => {
    if (!item.created_at) return;

    const date = new Date(item.created_at);

    if (Number.isNaN(date.getTime())) return;

    const key =
      `${date.getFullYear()}-` +
      `${String(date.getMonth() + 1).padStart(2, '0')}-` +
      `${String(date.getDate()).padStart(2, '0')}`;

    dateKeys.add(key);
  });

  if (dateKeys.size === 0) {
    return 0;
  }

  const today = new Date();

  /*
    A streak is active only when there is
    a test today.

    Example:
    Today + Yesterday + Day before = 3 days
  */

  const todayKey =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, '0')}-` +
    `${String(today.getDate()).padStart(2, '0')}`;

  if (!dateKeys.has(todayKey)) {
    return 0;
  }

  let streak = 0;

  const cursor = new Date(today);

  while (true) {
    const key =
      `${cursor.getFullYear()}-` +
      `${String(cursor.getMonth() + 1).padStart(2, '0')}-` +
      `${String(cursor.getDate()).padStart(2, '0')}`;

    if (!dateKeys.has(key)) {
      break;
    }

    streak++;

    cursor.setDate(
      cursor.getDate() - 1
    );
  }

  return streak;
}