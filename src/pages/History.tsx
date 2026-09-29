import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Trophy,
  Target,
  Keyboard,
  Loader2,
  AlertCircle,
  Clock,
  BarChart3,
  RefreshCw,
  TrendingUp,
  CalendarDays,
  Zap,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type HistoryRecord = {
  id: string;
  user_id: string;
  wpm: number;
  accuracy: number;
  correct_chars: number;
  incorrect_chars: number;
  total_keystrokes: number;
  correct_words: number;
  wrong_words: number;
  time_elapsed: number;
  test_duration: number;
  test_type: string;
  passage_title: string | null;
  created_at: string;
};

type ChartRecord = {
  test: string;
  wpm: number;
  accuracy: number;
};

export function History() {
  const { user } = useAuth();

  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadHistory = async (isRefresh = false) => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    try {
      const { data, error: supabaseError } = await supabase
        .from('typing_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', {
          ascending: true,
        });

      if (supabaseError) {
        console.error('History load error:', supabaseError);
        setError(
          supabaseError.message || 'Failed to load typing history.'
        );
        setHistory([]);
        return;
      }

      setHistory((data || []) as HistoryRecord[]);
    } catch (err) {
      console.error('Unexpected history error:', err);
      setError('Something went wrong while loading your history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user]);

  // ==============================
  // STATISTICS
  // ==============================

  const averageWpm = useMemo(() => {
    if (!history.length) return 0;

    const total = history.reduce(
      (sum, record) => sum + Number(record.wpm || 0),
      0
    );

    return total / history.length;
  }, [history]);

  const bestWpm = useMemo(() => {
    if (!history.length) return 0;

    return Math.max(
      ...history.map((record) => Number(record.wpm || 0))
    );
  }, [history]);

  const averageAccuracy = useMemo(() => {
    if (!history.length) return 0;

    const total = history.reduce(
      (sum, record) => sum + Number(record.accuracy || 0),
      0
    );

    return total / history.length;
  }, [history]);

  const bestAccuracy = useMemo(() => {
    if (!history.length) return 0;

    return Math.max(
      ...history.map((record) => Number(record.accuracy || 0))
    );
  }, [history]);

  const totalPracticeSeconds = useMemo(() => {
    return history.reduce(
      (sum, record) => sum + Number(record.time_elapsed || 0),
      0
    );
  }, [history]);

  const formatTotalTime = (seconds: number) => {
    const totalMinutes = Math.floor(seconds / 60);

    if (totalMinutes < 60) {
      return `${totalMinutes}m`;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  // ==============================
  // CHART DATA
  // ==============================

  const chartData: ChartRecord[] = useMemo(() => {
    return history.map((record, index) => ({
      test: `#${index + 1}`,
      wpm: Number(record.wpm || 0),
      accuracy: Number(record.accuracy || 0),
    }));
  }, [history]);

  // ==============================
  // LOGIN STATE
  // ==============================

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-5">
          <Keyboard className="w-8 h-8 text-yellow-400" />
        </div>

        <h2 className="text-3xl font-black text-white mb-3">
          Track Your Progress
        </h2>

        <p className="text-slate-400 max-w-md mx-auto mb-8">
          Sign in to view your real typing history, WPM
          growth, accuracy and test performance.
        </p>

        <Link
          to="/login"
          className="pro-btn pro-btn-primary px-7 py-3"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-yellow-400 animate-spin mb-4" />

        <p className="text-slate-400">
          Loading your typing history...
        </p>
      </div>
    );
  }

  // ==============================
  // MAIN PAGE
  // ==============================

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 page-enter">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-yellow-400" />
            </div>

            <div>
              <h1 className="text-3xl font-black text-white">
                Typing History
              </h1>

              <p className="text-slate-400 text-sm">
                Track your real typing performance and growth.
              </p>
            </div>
          </div>

          <p className="text-slate-500 text-sm mt-3">
            Welcome back,{' '}
            <span className="text-slate-300 font-semibold">
              {user.username}
            </span>
          </p>
        </div>

        <button
          onClick={() => loadHistory(true)}
          disabled={refreshing}
          className="pro-btn pro-btn-secondary inline-flex items-center justify-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              refreshing ? 'animate-spin' : ''
            }`}
          />

          <span>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </span>
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />

          <div>
            <p className="text-red-300 font-semibold">
              Unable to load history
            </p>

            <p className="text-red-400/80 text-sm mt-1">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {history.length === 0 ? (
        <div className="pro-card p-10 md:p-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-5">
            <Keyboard className="w-8 h-8 text-yellow-400" />
          </div>

          <h2 className="text-2xl font-black text-white mb-2">
            No Tests Yet
          </h2>

          <p className="text-slate-400 max-w-md mx-auto mb-7">
            Complete your first typing test and your real
            performance data will appear here.
          </p>

          <Link
            to="/practice"
            className="pro-btn pro-btn-primary inline-flex items-center gap-2 px-6 py-3"
          >
            <Zap className="w-4 h-4" />
            Start Typing Test
          </Link>
        </div>
      ) : (
        <>
          {/* STAT CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">

            <HistoryStat
              icon={<Target className="w-5 h-5" />}
              label="Average WPM"
              value={averageWpm.toFixed(1)}
            />

            <HistoryStat
              icon={<Trophy className="w-5 h-5" />}
              label="Best WPM"
              value={bestWpm.toFixed(1)}
              highlight
            />

            <HistoryStat
              icon={<Target className="w-5 h-5" />}
              label="Avg Accuracy"
              value={`${averageAccuracy.toFixed(1)}%`}
            />

            <HistoryStat
              icon={<Trophy className="w-5 h-5" />}
              label="Best Accuracy"
              value={`${bestAccuracy.toFixed(1)}%`}
              highlight
            />

            <HistoryStat
              icon={<Keyboard className="w-5 h-5" />}
              label="Tests"
              value={history.length.toString()}
            />

            <HistoryStat
              icon={<Clock className="w-5 h-5" />}
              label="Practice Time"
              value={formatTotalTime(totalPracticeSeconds)}
            />

          </div>

          {/* WPM + ACCURACY CHART */}
          <div className="pro-card p-5 md:p-7 mb-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-7">
              <div>
                <h2 className="text-xl font-black text-white">
                  Performance Growth
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Your WPM and accuracy across completed tests.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2 text-yellow-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  WPM
                </div>

                <div className="flex items-center gap-2 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  Accuracy
                </div>
              </div>
            </div>

            <div className="w-full h-[340px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 0,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="test"
                    stroke="#64748b"
                    tick={{
                      fill: '#94a3b8',
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    yAxisId="wpm"
                    stroke="#64748b"
                    tick={{
                      fill: '#94a3b8',
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    yAxisId="accuracy"
                    orientation="right"
                    domain={[0, 100]}
                    stroke="#64748b"
                    tick={{
                      fill: '#94a3b8',
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                    }}
                    labelStyle={{
                      color: '#cbd5e1',
                      marginBottom: '6px',
                    }}
                    formatter={(
                      value: number,
                      name: string
                    ) => {
                      if (name === 'wpm') {
                        return [
                          `${Number(value).toFixed(1)} WPM`,
                          'Speed',
                        ];
                      }

                      return [
                        `${Number(value).toFixed(1)}%`,
                        'Accuracy',
                      ];
                    }}
                  />

                  <Line
                    yAxisId="wpm"
                    type="monotone"
                    dataKey="wpm"
                    stroke="#eab308"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: '#eab308',
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                  <Line
                    yAxisId="accuracy"
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#60a5fa"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: '#60a5fa',
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RECENT TESTS */}
          <div className="pro-card overflow-hidden">

            <div className="p-5 md:p-6 border-b border-slate-700/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-blue-400" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-white">
                    Recent Tests
                  </h2>

                  <p className="text-sm text-slate-400">
                    Your latest typing test results.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="bg-slate-900/40">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Passage
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Type
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      WPM
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Accuracy
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {[...history]
                    .reverse()
                    .slice(0, 15)
                    .map((record) => (
                      <tr
                        key={record.id}
                        className="border-t border-slate-700/60 hover:bg-slate-700/20 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                          {new Date(
                            record.created_at
                          ).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-300 max-w-[240px]">
                          <div className="truncate">
                            {record.passage_title ||
                              'Quick Test'}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <TestTypeBadge
                            type={record.test_type}
                          />
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-black text-yellow-400">
                            {Number(record.wpm || 0).toFixed(1)}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-bold text-green-400">
                            {Number(
                              record.accuracy || 0
                            ).toFixed(1)}
                            %
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-slate-300 text-sm">
                            {formatTime(
                              record.time_elapsed || 0
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ==============================
// STAT CARD
// ==============================

function HistoryStat({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        pro-card p-4 md:p-5
        ${
          highlight
            ? 'border-yellow-500/20 bg-yellow-500/[0.03]'
            : ''
        }
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={
            highlight
              ? 'text-yellow-400'
              : 'text-slate-400'
          }
        >
          {icon}
        </span>
      </div>

      <div
        className={`
          text-2xl md:text-3xl font-black
          ${
            highlight
              ? 'text-yellow-400'
              : 'text-white'
          }
        `}
      >
        {value}
      </div>

      <div className="text-[11px] md:text-xs text-slate-500 uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}

// ==============================
// TEST TYPE BADGE
// ==============================

function TestTypeBadge({
  type,
}: {
  type: string;
}) {
  const normalizedType = (
    type || 'practice'
  ).toLowerCase();

  let className =
    'bg-slate-700 text-slate-300';

  if (normalizedType === 'exam') {
    className =
      'bg-red-500/10 text-red-300 border border-red-500/20';
  } else if (normalizedType === 'quick') {
    className =
      'bg-blue-500/10 text-blue-300 border border-blue-500/20';
  } else if (normalizedType === 'practice') {
    className =
      'bg-green-500/10 text-green-300 border border-green-500/20';
  }

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-bold capitalize ${className}`}
    >
      {normalizedType}
    </span>
  );
}

// ==============================
// TIME FORMAT
// ==============================

function formatTime(seconds: number) {
  const mins = Math.floor(Number(seconds) / 60);
  const secs = Number(seconds) % 60;

  return `${mins}:${secs
    .toString()
    .padStart(2, '0')}`;
}