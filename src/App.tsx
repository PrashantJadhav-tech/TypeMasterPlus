/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { PassagesProvider } from './contexts/PassagesContext';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import { Practice } from './pages/Practice';
import { Exam } from './pages/Exam';
import { Learn } from './pages/Learn';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { History } from './pages/History';
import { Settings } from './pages/Settings';
import { Passages } from './pages/Passages';
import { Profile } from './pages/Profile';
import { Dashboard } from './pages/Dashboard';
import { TypingGame } from './pages/TypingGame';
import { AdminDashboard } from './pages/AdminDashboard';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { AdminProfile } from './pages/AdminProfile';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <PassagesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Landing />} />
                <Route path="practice" element={<Practice />} />
                <Route path="exam" element={<Exam />} />
                <Route path="learn" element={<Learn />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="settings" element={<Settings />} />
                <Route path="typing-game" element={<TypingGame />} />
                <Route path="passages" element={<Passages />} />
                <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin-profile" element={<AdminProfile />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </PassagesProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
