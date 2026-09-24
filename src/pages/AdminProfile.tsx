import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import {
  Crown,
  Mail,
  Shield,
  ArrowLeft,
  User,
} from 'lucide-react';

type AdminProfileData = {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
};

export function AdminProfile() {
  const [admin, setAdmin] = useState<AdminProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSuperAdmin = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email, avatar_url')
        .eq('username', 'Prashant Jadhav')
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Super Admin profile error:', error);
      } else if (data) {
        setAdmin(data);
      }

      setLoading(false);
    };

    loadSuperAdmin();
  }, []);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-8 px-4">

      <Link
        to="/profile"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-yellow-500 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </Link>

      <h1 className="text-3xl font-bold text-white mb-8">
        Admin Profile
      </h1>

      {loading ? (
        <div className="text-center text-slate-400 py-10">
          Loading Admin Profile...
        </div>
      ) : !admin ? (
        <div className="bg-slate-800/50 border border-red-500/30 rounded-2xl p-6 text-center">
          <p className="text-red-400">
            Super Admin profile not found.
          </p>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-yellow-500/30 rounded-3xl p-8 shadow-xl">

          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* ADMIN PHOTO */}
            <div className="w-36 h-36 rounded-full overflow-hidden bg-slate-700 border-4 border-yellow-500/40 flex items-center justify-center shadow-xl">

              {admin.avatar_url ? (
                <img
                  src={admin.avatar_url}
                  alt="Super Admin"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-20 h-20 text-slate-400" />
              )}

            </div>

            {/* ADMIN DETAILS */}
            <div className="flex-1 text-center md:text-left">

              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">

                <h2 className="text-3xl font-bold text-white">
                  {admin.username}
                </h2>

                <Crown className="w-7 h-7 text-yellow-500" />

              </div>

              {/* SUPER ADMIN BADGE */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 font-bold text-sm mb-5">

                <Shield className="w-4 h-4" />

                SUPER ADMIN

              </div>

              {/* EMAIL */}
              <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 mb-4">

                <Mail className="w-5 h-5" />

                <span>
                  {admin.email}
                </span>

              </div>

              <p className="text-slate-400 max-w-xl leading-relaxed">
                Official Super Admin of{' '}
                <span className="text-white font-semibold">
                  TypeMasterPlus
                </span>.
              </p>

            </div>

          </div>

          {/* ADMIN INFORMATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">

            <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-5">

              <div className="flex items-center gap-3 mb-2">
                <Crown className="w-5 h-5 text-yellow-500" />

                <span className="text-slate-400">
                  Role
                </span>
              </div>

              <p className="text-white font-bold">
                Super Admin
              </p>

            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-5">

              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-yellow-500" />

                <span className="text-slate-400">
                  Access
                </span>
              </div>

              <p className="text-white font-bold">
                Full Administrative Access
              </p>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}