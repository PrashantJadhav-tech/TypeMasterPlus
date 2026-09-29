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
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }

    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">

      {/* TOP NAVBAR */}
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between min-h-[72px] gap-4">

          {/* LOGO */}
          <Link
            to="/"
            onClick={handleNavigation}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="relative">

              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/20 transition-all">
                <Keyboard className="w-5 h-5 text-yellow-400" />
              </div>

              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-lg shadow-yellow-500/40" />

            </div>

            <div className="hidden sm:block">
              <div className="font-black text-lg leading-none text-white tracking-tight">
                TypeMaster<span className="text-yellow-400">Plus</span>
              </div>

              <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mt-1">
                Typing Platform
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center">

            {navLinks.map((link) => {
              if (link.protected && !user) return null;

              const Icon = link.icon;
              const isActive =
                location.pathname === link.path ||
                (link.path !== '/' &&
                  location.pathname.startsWith(`${link.path}/`));

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-yellow-400 bg-yellow-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4',
                      isActive && 'text-yellow-400'
                    )}
                  />

                  <span>{link.name}</span>

                  {isActive && (
                    <span className="absolute left-1/2 -bottom-[1px] -translate-x-1/2 w-6 h-0.5 bg-yellow-400 rounded-full" />
                  )}
                </Link>
              );
            })}

          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 shrink-0">

            {user ? (

              <div className="relative">

                {/* PROFILE BUTTON */}
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn(
                    'flex items-center gap-2 rounded-2xl border px-1.5 py-1.5 transition-all duration-200',
                    profileOpen
                      ? 'bg-slate-800 border-yellow-500/30'
                      : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                  )}
                >

                  {/* AVATAR */}
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-yellow-500 text-slate-950 flex items-center justify-center font-black text-sm ring-2 ring-slate-900">

                    {avatar ? (
                      <img
                        src={avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitial()
                    )}

                  </div>

                  {/* USER INFO */}
                  <div className="hidden md:flex flex-col items-start max-w-[150px]">
                    <span className="text-sm font-semibold text-white truncate max-w-full">
                      {user.username}
                    </span>

                    <span className="text-[11px] text-slate-500 truncate max-w-full">
                      {user.email}
                    </span>
                  </div>

                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-slate-500 transition-transform duration-200',
                      profileOpen && 'rotate-180 text-yellow-400'
                    )}
                  />

                </button>

                {/* PROFILE DROPDOWN */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-80 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950 shadow-2xl shadow-black/40">

                    {/* ACCOUNT HEADER */}
                    <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-950 border-b border-slate-800">

                      <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-yellow-500 text-slate-950 flex items-center justify-center font-black ring-2 ring-yellow-500/20 shrink-0">

                          {avatar ? (
                            <img
                              src={avatar}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitial()
                          )}

                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="text-white font-bold truncate">
                            {user.username}
                          </p>

                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {user.email}
                          </p>

                          <div className="flex items-center gap-1.5 mt-2">

                            {user.role === 'admin' ? (
                              <>
                                <Crown className="w-3 h-3 text-yellow-400" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-yellow-400">
                                  Administrator
                                </span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3 text-slate-500" />
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

                      {/* DASHBOARD */}
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <LayoutDashboard className="w-4 h-4 text-blue-400" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold">
                            Dashboard
                          </p>
                          <p className="text-[11px] text-slate-500">
                            View your progress
                          </p>
                        </div>
                      </Link>

                      {/* ADMIN DASHBOARD */}
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl text-yellow-400 hover:bg-yellow-500/10 transition-all"
                        >
                          <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                            <Crown className="w-4 h-4 text-yellow-400" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold">
                              Admin Dashboard
                            </p>
                            <p className="text-[11px] text-yellow-500/60">
                              Manage platform
                            </p>
                          </div>
                        </Link>
                      )}

                      {/* PROFILE */}
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                      >
                        <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-400" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold">
                            My Profile
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Manage your account
                          </p>
                        </div>
                      </Link>

                    </div>

                    {/* LOGOUT */}
                    <div className="p-2 border-t border-slate-800">

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                          <LogOut className="w-4 h-4" />
                        </div>

                        <div className="text-left">
                          <p className="text-sm font-semibold">
                            Sign Out
                          </p>
                          <p className="text-[11px] text-red-400/50">
                            End your current session
                          </p>
                        </div>
                      </button>

                    </div>

                  </div>
                )}

              </div>

            ) : (

              /* SIGN IN */
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:border-yellow-500/40 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-all"
              >
                <User className="w-4 h-4 text-yellow-400" />
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
              className="xl:hidden w-10 h-10 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-all"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE NAVIGATION */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">

          <div className="max-w-[100rem] mx-auto px-4 py-4">

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

              {navLinks.map((link) => {
                if (link.protected && !user) return null;

                const Icon = link.icon;

                const isActive =
                  location.pathname === link.path ||
                  (link.path !== '/' &&
                    location.pathname.startsWith(`${link.path}/`));

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={handleNavigation}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border transition-all',
                      isActive
                        ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />

                    <span className="text-sm font-medium">
                      {link.name}
                    </span>
                  </Link>
                );
              })}

            </div>

            {/* MOBILE SIGN IN */}
            {!user && (
              <Link
                to="/login"
                onClick={handleNavigation}
                className="mt-3 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold transition-all"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

          </div>

        </div>
      )}

    </header>
  );
}