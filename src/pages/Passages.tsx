import React, { useState, useMemo } from 'react';
import { usePassages, Passage } from '../contexts/PassagesContext';
import { useSettings } from '../contexts/SettingsContext';
import { BookOpen, Search, Plus, Edit2, Trash2, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export function Passages() {
  const navigate = useNavigate();
  const { passages, addPassage, updatePassage, deletePassage, setCurrentPassageId } = usePassages();
  const { settings } = useSettings();
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '', text: '', category: 'General', difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard'
  });

  const categories = useMemo(() => Array.from(new Set(passages.map(p => p.category))), [passages]);
  const filteredPassages = useMemo(() => passages.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.text.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (difficultyFilter && p.difficulty !== difficultyFilter) return false;
    return true;
  }), [passages, search, categoryFilter, difficultyFilter]);

  const handleOpenModal = (p?: Passage) => {
    if (p) {
      setEditingId(p.id);
      setFormData({ title: p.title, text: p.text, category: p.category, difficulty: p.difficulty });
    } else {
      setEditingId(null);
      setFormData({ title: '', text: '', category: 'General', difficulty: 'Easy' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updatePassage(editingId, formData);
    } else {
      addPassage(formData);
    }
    setIsModalOpen(false);
  };

  const handlePractice = (id: string) => {
    setCurrentPassageId(id);
    navigate('/');
  };

  const getFontSizeClass = () => {
    switch(settings.passageFontSize) {
      case 'sm': return 'text-sm';
      case 'base': return 'text-base';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      case '2xl': return 'text-2xl';
      default: return 'text-lg';
    }
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-yellow-500/10 rounded-xl">
            <BookOpen className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Library</h1>
            <p className="text-slate-400 mt-1">Manage and practice your texts.</p>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-6 py-3 rounded-lg font-bold transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>New Passage</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search passages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 transition-colors"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-yellow-500 md:w-48"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 outline-none focus:border-yellow-500 md:w-48"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPassages.map((p) => (
          <div key={p.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl flex flex-col group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-yellow-500 transition-colors">{p.title}</h3>
                <div className="flex space-x-2 mt-2 text-xs font-medium uppercase tracking-wider">
                  <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded">{p.category}</span>
                  <span className={`px-2 py-1 rounded ${
                    p.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : 
                    p.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 
                    'bg-red-500/20 text-red-400'
                  }`}>{p.difficulty}</span>
                </div>
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(p)} className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => deletePassage(p.id)} className="p-2 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className={cn("text-slate-400 font-serif line-clamp-3 mb-6 flex-1", getFontSizeClass())}>
              "{p.text}"
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-mono text-slate-500">
                {p.text.length} chars
              </span>
              <button 
                onClick={() => handlePractice(p.id)}
                className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 text-sm font-bold bg-yellow-500/10 hover:bg-yellow-500/20 px-4 py-2 rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Practice</span>
              </button>
            </div>
          </div>
        ))}
        {filteredPassages.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No passages found. Try adjusting your filters or add a new one!
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Passage' : 'New Passage'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Difficulty</label>
                  <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value as any})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-yellow-500 focus:outline-none">
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Text content</label>
                <textarea required rows={6} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono focus:border-yellow-500 focus:outline-none resize-none" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-slate-300 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-6 py-2 rounded-lg transition-colors">Save Passage</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
