import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Users, UserPlus, UserMinus, RefreshCw, Crown, Search } from 'lucide-react';

type Profile = { id: string; username: string; email: string; role: 'user' | 'admin'; is_super_admin: boolean; avatar_url: string | null; created_at: string };

export function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('id, username, email, role, is_super_admin, avatar_url, created_at').order('created_at', { ascending: false });
    if (error) alert(`Could not load users: ${error.message}`);
    else setUsers((data || []) as Profile[]);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const toggleAdmin = async (target: Profile) => {
    if (target.is_super_admin) return alert('The Super Admin cannot be removed or demoted.');
    if (target.id === user?.id) return alert('You cannot remove your own admin access.');
    const action = target.role === 'admin' ? 'remove admin access from' : 'make admin';
    if (!confirm(`Are you sure you want to ${action} ${target.username || target.email}?`)) return;
    setBusy(target.id);
    const { error } = await supabase.rpc('set_admin_role', { target_user_id: target.id, make_admin: target.role !== 'admin' });
    if (error) alert(`Action failed: ${error.message}`);
    else await loadUsers();
    setBusy(null);
  };

  const filtered = users.filter(u => `${u.username} ${u.email}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3"><ShieldCheck className="w-8 h-8 text-yellow-500" /><h1 className="text-3xl font-bold text-white">Admin Dashboard</h1></div>
          <p className="text-slate-400 mt-2">Manage users and administrator access.</p>
        </div>
        <button onClick={loadUsers} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700"><RefreshCw className="w-4 h-4" />Refresh</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Stat icon={<Users className="text-blue-400" />} title="Total Users" value={users.length.toString()} />
        <Stat icon={<Crown className="text-yellow-500" />} title="Admins" value={users.filter(u => u.role === 'admin').length.toString()} />
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-slate-700 flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <h2 className="text-xl font-bold text-white">Users</h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search user or email..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:border-yellow-500" />
          </div>
        </div>

        {loading ? <div className="p-8 text-center text-slate-400">Loading users...</div> : filtered.length === 0 ? <div className="p-8 text-center text-slate-400">No users found.</div> : (
          <div className="divide-y divide-slate-700/60">
            {filtered.map(u => (
              <div key={u.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center shrink-0">
                    {u.avatar_url ? <img src={u.avatar_url} alt="" className="w-full h-full object-cover" /> : <span className="text-yellow-500 font-bold">{(u.username || u.email || 'U')[0].toUpperCase()}</span>}
                  </div>
                  <div className="min-w-0"><p className="font-semibold text-white truncate">{u.username || 'User'}</p><p className="text-sm text-slate-400 truncate">{u.email}</p><p className="text-xs text-slate-500 mt-1">Joined {new Date(u.created_at).toLocaleDateString()}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  {u.is_super_admin ? <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold"><Crown className="w-3.5 h-3.5" />SUPER ADMIN</span> : u.role === 'admin' && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold"><Crown className="w-3.5 h-3.5" />ADMIN</span>}
                  <button onClick={() => toggleAdmin(u)} disabled={busy === u.id || u.id === user?.id || u.is_super_admin} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm disabled:opacity-40 ${u.role === 'admin' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                    {u.is_super_admin ? <>Protected</> : u.role === 'admin' ? <><UserMinus className="w-4 h-4" />Remove Admin</> : <><UserPlus className="w-4 h-4" />Make Admin</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 flex items-center gap-4"><div>{icon}</div><div><div className="text-2xl font-bold text-white">{value}</div><div className="text-sm text-slate-400">{title}</div></div></div>;
}
