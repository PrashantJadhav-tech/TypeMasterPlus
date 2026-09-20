import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, Shield, Keyboard, Pencil, Save, X, Camera, User, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Profile() {
  const { user, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!user) return null;

  const handleEdit = () => {
    setUsername(user.username);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const newUsername = username.trim();
    if (!newUsername) return alert('Username cannot be empty.');
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { username: newUsername } });
    if (!error) {
      await supabase.from('profiles').update({ username: newUsername, updated_at: new Date().toISOString() }).eq('id', user.id);
      await refreshUser();
      setIsEditing(false);
    } else alert(error.message);
    setSaving(false);
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please select an image.');
    if (file.size > 2 * 1024 * 1024) return alert('Profile photo must be under 2 MB.');

    setUploading(true);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) {
      alert(`Photo upload failed: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;
    const { error: dbError } = await supabase.from('profiles').update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() }).eq('id', user.id);
    if (dbError) alert(`Photo saved failed: ${dbError.message}`);
    else {
      await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } });
      await refreshUser();
    }
    setUploading(false);
    e.target.value = '';
  };

  const avatar = user.avatarUrl;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>

      <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center border-4 border-slate-800 shadow-xl">
              {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-16 h-16 text-slate-400" />}
            </div>
            <button onClick={() => fileRef.current?.click()} disabled={uploading} title="Change profile photo"
              className="absolute bottom-0 right-0 w-10 h-10 bg-yellow-500 hover:bg-yellow-400 rounded-full border-4 border-slate-800 flex items-center justify-center text-slate-900 disabled:opacity-60">
              <Camera className="w-4 h-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhoto} className="hidden" />
          </div>

          <div className="flex-1 text-center md:text-left">
            {!isEditing ? (
              <>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h2 className="text-3xl font-bold text-white mb-2">{user.username}</h2>
                  {user.role === 'admin' && <Crown className="w-6 h-6 text-yellow-500 mb-2" />}
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-4 text-slate-400 mb-6">
                  <span className="flex items-center justify-center md:justify-start gap-2"><Mail className="w-4 h-4" />{user.email}</span>
                  <span className="hidden md:inline text-slate-600">•</span>
                  <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <button onClick={handleEdit} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold"><Pencil className="w-4 h-4" />Edit Profile</button>
                  <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold"><Camera className="w-4 h-4" />{uploading ? 'Uploading...' : 'Change Photo'}</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-5">Edit Profile</h2>
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-white outline-none focus:border-yellow-500" />
                  <label className="block text-sm font-medium text-slate-300 mt-4 mb-2">Email</label>
                  <input type="email" value={user.email} disabled className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-slate-500" />
                  <div className="flex gap-3 mt-5">
                    <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-yellow-500 text-slate-900 font-semibold disabled:opacity-50"><Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Changes'}</button>
                    <button onClick={() => { setUsername(user.username); setIsEditing(false); }} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700 text-white font-semibold"><X className="w-4 h-4" />Cancel</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Stat label="Tests Completed" value="42" />
            <Stat label="Avg WPM" value="85" accent />
            <Stat label="Top WPM" value="112" green />
            <Stat label="Accuracy" value="98%" />
          </div>
        )}
      </div>

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Keyboard className="w-5 h-5 text-yellow-500" />Recent Activity</h3>
        <p className="text-slate-400 mb-4">View your full typing history and analyze your progress over time.</p>
        <Link to="/history" className="text-yellow-500 hover:text-yellow-400 font-medium text-sm">View History →</Link>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, green }: { label: string; value: string; accent?: boolean; green?: boolean }) {
  return <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700"><div className="text-sm text-slate-500 mb-1">{label}</div><div className={`text-2xl font-bold ${accent ? 'text-yellow-500' : green ? 'text-green-500' : 'text-white'}`}>{value}</div></div>;
}
