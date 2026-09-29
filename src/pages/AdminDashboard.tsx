import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  ShieldCheck,
  Users,
  UserPlus,
  UserMinus,
  RefreshCw,
  Crown,
  Search,
  Shield,
  UserRound,
  CalendarDays,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

type Profile = {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  is_super_admin: boolean;
  avatar_url: string | null;
  created_at: string;
};

export function AdminDashboard() {
  const { user } = useAuth();

  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const loadUsers = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, username, email, role, is_super_admin, avatar_url, created_at'
      )
      .order('created_at', { ascending: false });

    if (error) {
      alert(`Could not load users: ${error.message}`);
    } else {
      setUsers((data || []) as Profile[]);
    }

    if (showRefresh) setRefreshing(false);
    else setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleAdmin = async (target: Profile) => {
    if (target.is_super_admin) {
      alert('The Super Admin cannot be removed or demoted.');
      return;
    }

    if (target.id === user?.id) {
      alert('You cannot remove your own admin access.');
      return;
    }

    const makingAdmin = target.role !== 'admin';

    const action = makingAdmin
      ? 'make admin'
      : 'remove admin access from';

    if (
      !confirm(
        `Are you sure you want to ${action} ${
          target.username || target.email
        }?`
      )
    ) {
      return;
    }

    setBusy(target.id);

    const { error } = await supabase.rpc('set_admin_role', {
      target_user_id: target.id,
      make_admin: makingAdmin,
    });

    if (error) {
      alert(`Action failed: ${error.message}`);
    } else {
      await loadUsers();
    }

    setBusy(null);
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter((u) =>
      `${u.username} ${u.email}`.toLowerCase().includes(query)
    );
  }, [users, search]);

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalSuperAdmins = users.filter((u) => u.is_super_admin).length;
  const normalUsers = users.filter(
    (u) => u.role === 'user' && !u.is_super_admin
  ).length;

  return (
    <div className="page-enter w-full max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/80 p-6 md:p-8">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-yellow-500/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-400">
              <ShieldCheck className="h-4 w-4" />
              Administrator Area
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
              Manage users, administrator access and platform permissions
              from one place.
            </p>
          </div>

          <button
            onClick={() => loadUsers(true)}
            disabled={refreshing}
            className="pro-btn pro-btn-secondary inline-flex w-full items-center justify-center gap-2 md:w-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
            />
            {refreshing ? 'Refreshing...' : 'Refresh Users'}
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat
          icon={<Users className="h-5 w-5" />}
          title="Total Users"
          value={totalUsers}
          description="Registered accounts"
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <AdminStat
          icon={<Shield className="h-5 w-5" />}
          title="Administrators"
          value={totalAdmins}
          description="Users with admin access"
          iconClass="bg-yellow-500/10 text-yellow-400"
        />

        <AdminStat
          icon={<Crown className="h-5 w-5" />}
          title="Super Admin"
          value={totalSuperAdmins}
          description="Protected accounts"
          iconClass="bg-purple-500/10 text-purple-400"
        />

        <AdminStat
          icon={<UserRound className="h-5 w-5" />}
          title="Normal Users"
          value={normalUsers}
          description="Standard accounts"
          iconClass="bg-emerald-500/10 text-emerald-400"
        />
      </section>

      {/* Users */}
      <section className="pro-card overflow-hidden">

        {/* Section Header */}
        <div className="border-b border-slate-700/70 p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                User Management
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                View users and manage administrator access.
              </p>
            </div>

            <div className="relative w-full lg:w-96">
              {!search && (
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              )}

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search username or email..."
                className={`pro-input transition-all ${
                  search ? 'pl-4' : 'pl-11'
                }`}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Users className="h-3.5 w-3.5" />
            Showing {filtered.length} of {users.length} users
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-3 p-5 md:p-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-700/60 bg-slate-900/50 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-700" />

                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 rounded bg-slate-700" />
                    <div className="h-3 w-56 rounded bg-slate-800" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
              <Search className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-semibold text-white">
              No users found
            </h3>

            <p className="mt-2 max-w-md text-sm text-slate-400">
              {search
                ? 'Try searching with another username or email.'
                : 'There are no registered users available.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/60">
            {filtered.map((target) => {
              const isCurrentUser = target.id === user?.id;
              const isBusy = busy === target.id;

              return (
                <div
                  key={target.id}
                  className="group p-5 transition-colors hover:bg-slate-800/30 md:p-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                    {/* User info */}
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
                        {target.avatar_url ? (
                          <img
                            src={target.avatar_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-yellow-400">
                            {(
                              target.username ||
                              target.email ||
                              'U'
                            )[0].toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-semibold text-white">
                            {target.username || 'User'}
                          </p>

                          {isCurrentUser && (
                            <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-400">
                              You
                            </span>
                          )}
                        </div>

                        <p className="mt-1 truncate text-sm text-slate-400">
                          {target.email}
                        </p>

                        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Joined{' '}
                          {new Date(
                            target.created_at
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Role + action */}
                    <div className="flex flex-wrap items-center gap-3">
                      {target.is_super_admin ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-bold text-purple-300">
                          <Crown className="h-3.5 w-3.5" />
                          SUPER ADMIN
                        </span>
                      ) : target.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1.5 text-xs font-bold text-yellow-400">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-400">
                          <UserRound className="h-3.5 w-3.5" />
                          USER
                        </span>
                      )}

                      {target.is_super_admin ? (
                        <div className="inline-flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-2 text-sm font-semibold text-purple-300">
                          <CheckCircle2 className="h-4 w-4" />
                          Protected
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleAdmin(target)}
                          disabled={
                            isBusy ||
                            isCurrentUser
                          }
                          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                            target.role === 'admin'
                              ? 'border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                              : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {isBusy ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : target.role === 'admin' ? (
                            <>
                              <UserMinus className="h-4 w-4" />
                              Remove Admin
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4" />
                              Make Admin
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Security note */}
      <section className="rounded-2xl border border-yellow-500/10 bg-yellow-500/5 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />

          <div>
            <h3 className="font-semibold text-yellow-300">
              Administrator Protection
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              Super Admin accounts are protected and cannot be demoted
              through this dashboard. An administrator also cannot remove
              their own admin access.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function AdminStat({
  icon,
  title,
  value,
  description,
  iconClass,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
  iconClass: string;
}) {
  return (
    <div className="pro-card p-5 transition-all hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}