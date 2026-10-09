import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Keyboard,
  User,
  LogOut,
  Settings,
  History,
  BookOpen,
  Target,
  Brain,
  Home,
  LayoutDashboard,
  Gamepad2,
  ChevronDown,
  Crown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Practice', path: '/practice', icon: Keyboard },
    { name: 'Exam', path: '/exam', icon: Target },
    { name: 'Learn', path: '/learn', icon: Brain },
    { name: 'Passages', path: '/passages', icon: BookOpen },
    { name: 'History', path: '/history', icon: History, protected: true },
    { name: 'Settings', path: '/settings', icon: Settings },
    { name: 'Typing Game', path: '/typing-game', icon: Gamepad2 },
  ];

  const avatar = user?.avatarUrl || null;

  const getInitial = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await logout();
  };

  const handleNavigation = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== '/' && location.pathname.startsWith(`${path}/`));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[100rem] px-4 sm:px-6">
        <div className="flex min-h-[72px] items-center justify-between gap-4">

          {/* LOGO */}
          <Link
            to="/"
            onClick={handleNavigation}
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-500/20 bg-yellow-500/10 transition-all group-hover:bg-yellow-500/20">
                <Keyboard className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-yellow-400 shadow-lg shadow-yellow-500/40" />
            </div>

            <div className="hidden sm:block">
              <div className="text-lg font-black leading-none tracking-tight text-white">
                TypeMaster<span className="text-yellow-400">Plus</span>
              </div>
              <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-slate-500">
                Typing Platform
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'
                  )}
                >
                  <Icon className={cn('h-4 w-4', active && 'text-yellow-400')} />
                  <span>{link.name}</span>
                  {active && (
                    <span className="absolute -bottom-[1px] left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-yellow-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex shrink-0 items-center gap-2">
            {user ? (
              <div className="relative">

                {/* PROFILE BUTTON */}
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn(
                    'flex items-center gap-2 rounded-2xl border px-1.5 py-1.5 transition-all duration-200',
                    profileOpen
                      ? 'border-yellow-500/30 bg-slate-800'
                      : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-800'
                  )}
                >
                  <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-yellow-500 text-sm font-black text-slate-950 ring-2 ring-slate-900">
                    {avatar ? (
                      <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      getInitial()
                    )}
                  </div>

                  <div className="hidden max-w-[150px] flex-col items-start md:flex">
                    <span className="max-w-full truncate text-sm font-semibold text-white">
                      {user.username}
                    </span>
                    <span className="max-w-full truncate text-[11px] text-slate-500">
                      {user.email}
                    </span>
                  </div>

                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-slate-500 transition-transform duration-200',
                      profileOpen && 'rotate-180 text-yellow-400'
                    )}
                  />
                </button>

                {/* PROFILE DROPDOWN */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl shadow-black/40">

                    {/* ACCOUNT HEADER */}
                    <div className="border-b border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-yellow-500 font-black text-slate-950 ring-2 ring-yellow-500/20">
                          {avatar ? (
                            <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
                          ) : (
                            getInitial()
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold text-white">{user.username}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">{user.email}</p>

                          <div className="mt-2 flex items-center gap-1.5">
                            {user.isSuperAdmin ? (
                              <>
                                <Crown className="h-3 w-3 text-purple-400" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                                  Super Admin
                                </span>
                              </>
                            ) : user.role === 'admin' ? (
                              <>
                                <Crown className="h-3 w-3 text-yellow-400" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-yellow-400">
                                  Administrator
                                </span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3 text-slate-500" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                  Member
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MENU */}
                    <div className="p-2">

                      <Link
                        to="/dashboard"
                        onClick={handleNavigation}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                          <LayoutDashboard className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Dashboard</p>
                          <p className="text-[11px] text-slate-500">View your progress</p>
                        </div>
                      </Link>

                      {/* ADMIN DASHBOARD: admins only */}
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={handleNavigation}
                          className="flex items-center gap-3 rounded-xl px-3 py-3 text-yellow-400 transition-all hover:bg-yellow-500/10"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500/10">
                            <Crown className="h-4 w-4 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Admin Dashboard</p>
                            <p className="text-[11px] text-yellow-500/60">Manage platform</p>
                          </div>
                        </Link>
                      )}

                      {/* SUPER ADMIN PROFILE: visible to every logged-in user */}
                      <Link
                        to="/super-admin-profile"
                        onClick={handleNavigation}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-purple-300 transition-all hover:bg-purple-500/10"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                          <Crown className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">Super Admin Profile</p>
                          <p className="text-[11px] text-slate-500">View profile information</p>
                        </div>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={handleNavigation}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                          <User className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">My Profile</p>
                          <p className="text-[11px] text-slate-500">Manage your account</p>
                        </div>
                      </Link>
                    </div>

                    {/* LOGOUT */}
                    <div className="border-t border-slate-800 p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-red-400 transition-all hover:bg-red-500/10"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold">Sign Out</p>
                          <p className="text-[11px] text-red-400/50">End your current session</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:border-yellow-500/40 hover:bg-slate-800 sm:flex"
              >
                <User className="h-4 w-4 text-yellow-400" />
                <span>Sign In</span>
              </Link>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(!mobileOpen);
                setProfileOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 transition-all hover:bg-slate-800 hover:text-white xl:hidden"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {mobileOpen && (
        <div className="border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl xl:hidden">
          <div className="mx-auto max-w-[100rem] px-4 py-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {navLinks.map((link) => {
                if (link.protected && !user) return null;
                const Icon = link.icon;
                const active = isActive(link.path);

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={handleNavigation}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-3 transition-all',
                      active
                        ? 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* MOBILE SUPER ADMIN PROFILE: visible to every logged-in user */}
            {user && (
              <Link
                to="/super-admin-profile"
                onClick={handleNavigation}
                className="mt-3 flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/10 p-3 text-purple-300 transition-all hover:bg-purple-500/15"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                  <Crown className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Super Admin Profile</p>
                  <p className="text-[11px] text-slate-500">View profile information</p>
                </div>
              </Link>
            )}

            {!user && (
              <Link
                to="/login"
                onClick={handleNavigation}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 py-3 font-bold text-slate-950 transition-all hover:bg-yellow-400"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;