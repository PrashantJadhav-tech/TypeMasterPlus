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
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

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
    await logout();
  };

  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-50">

      <div className="max-w-[100rem] mx-auto px-3 sm:px-6">

        <div className="flex justify-between items-center min-h-16 gap-3">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 transition-colors shrink-0"
          >
            <Keyboard className="w-8 h-8" />

            <span className="font-bold text-xl tracking-tight text-slate-50">
              TypeMaster<span className="text-yellow-500">Plus</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 flex-1 justify-center">

            {navLinks.map((link) => {

              if (link.protected && !user) return null;

              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'flex items-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors',
                    isActive
                      ? 'text-yellow-500'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center shrink-0">

            {user ? (

              <div className="relative">

                {/* PROFILE BUTTON */}
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full pl-1.5 pr-3 py-1.5 transition-all"
                >

                  {/* USER AVATAR */}
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-yellow-500 text-slate-900 flex items-center justify-center font-bold text-sm">
                    {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : getInitial()}
                  </div>

                  {/* USER INFO */}
                  <div className="hidden sm:flex flex-col items-start max-w-[190px]">
                    <span className="text-sm font-semibold text-white truncate max-w-full">
                      {user.username}
                    </span>

                    <span className="text-xs text-slate-400 truncate max-w-full">
                      {user.email}
                    </span>
                  </div>

                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-slate-400 transition-transform',
                      profileOpen && 'rotate-180'
                    )}
                  />

                </button>

                {/* DROPDOWN */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">

                    {/* ACCOUNT INFO */}
                    <div className="p-4 border-b border-slate-700">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-full overflow-hidden bg-yellow-500 text-slate-900 flex items-center justify-center font-bold">
                          {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : getInitial()}
                        </div>

                        <div className="min-w-0">
                          <p className="text-white font-semibold truncate">
                            {user.username}
                          </p>

                          <p className="text-sm text-slate-400 truncate">
                            {user.email}
                          </p>
                        </div>

                      </div>

                    </div>

                    {/* DASHBOARD */}
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>

                    {/* ADMIN DASHBOARD */}
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                      >
                        <Crown className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    {/* PROFILE */}
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>My Profile</span>
                    </Link>

                    {/* SIGN OUT */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors border-t border-slate-700"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>

                  </div>
                )}

              </div>

            ) : (

              /* SIGN IN */
              <Link
                to="/login"
                className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-full transition-all"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>

            )}

          </div>

        </div>

      </div>

      {/* MOBILE / TABLET NAV */}
      <div className="xl:hidden border-t border-slate-800 bg-slate-900 overflow-x-auto">

        <nav className="flex px-4 py-3 gap-6 min-w-max">

          {navLinks.map((link) => {

            if (link.protected && !user) return null;

            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'flex flex-col items-center gap-1 text-xs font-medium min-w-fit transition-colors',
                  isActive
                    ? 'text-yellow-500'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}

        </nav>

      </div>

    </header>
  );
}