import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  Play,
  X,
  FileText,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';

import { usePassages, Passage } from '../contexts/PassagesContext';
import { useSettings } from '../contexts/SettingsContext';
import { cn } from '../lib/utils';

export function Passages() {
  const navigate = useNavigate();

  const {
    passages,
    addPassage,
    updatePassage,
    deletePassage,
    setCurrentPassageId,
  } = usePassages();

  const { settings } = useSettings();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    text: '',
    category: 'General',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
  });

  const categories = useMemo(
    () => Array.from(new Set(passages.map((p) => p.category))),
    [passages]
  );

  const filteredPassages = useMemo(() => {
    return passages.filter((p) => {
      const searchText = search.toLowerCase().trim();

      if (
        searchText &&
        !p.title.toLowerCase().includes(searchText) &&
        !p.text.toLowerCase().includes(searchText)
      ) {
        return false;
      }

      if (categoryFilter && p.category !== categoryFilter) {
        return false;
      }

      if (difficultyFilter && p.difficulty !== difficultyFilter) {
        return false;
      }

      return true;
    });
  }, [passages, search, categoryFilter, difficultyFilter]);

  const handleOpenModal = (p?: Passage) => {
    if (p) {
      setEditingId(p.id);

      setFormData({
        title: p.title,
        text: p.text,
        category: p.category,
        difficulty: p.difficulty,
      });
    } else {
      setEditingId(null);

      setFormData({
        title: '',
        text: '',
        category: 'General',
        difficulty: 'Easy',
      });
    }

    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.text.trim()) {
      return;
    }

    if (editingId) {
      updatePassage(editingId, {
        ...formData,
        title: formData.title.trim(),
        text: formData.text.trim(),
      });
    } else {
      addPassage({
        ...formData,
        title: formData.title.trim(),
        text: formData.text.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const handlePractice = (id: string) => {
    setCurrentPassageId(id);
    navigate('/');
  };

  const handleDelete = (id: string) => {
    deletePassage(id);
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setDifficultyFilter('');
  };

  const getFontSizeClass = () => {
    switch (settings.passageFontSize) {
      case 'sm':
        return 'text-sm';
      case 'base':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      case 'xl':
        return 'text-xl';
      case '2xl':
        return 'text-2xl';
      default:
        return 'text-lg';
    }
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';

      case 'Hard':
        return 'bg-red-500/10 text-red-400 border-red-500/20';

      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="page-enter w-full max-w-7xl mx-auto py-4 sm:py-6 lg:py-8">

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

          <div>
            <div className="flex items-center gap-3 mb-3">

              <div className="w-11 h-11 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-yellow-400" />
              </div>

              <span className="pro-badge">
                <Sparkles className="w-3.5 h-3.5" />
                Typing Library
              </span>

            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Passage Library
            </h1>

            <p className="text-slate-400 mt-2 max-w-2xl">
              Choose a passage, practice your typing skills, or manage your
              personal typing library.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="pro-btn pro-btn-primary w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            New Passage
          </button>

        </div>
      </div>

      {/* LIBRARY STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">

        <div className="pro-card p-4">
          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-yellow-400" />
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Passages
              </p>

              <p className="text-xl font-bold text-white">
                {passages.length}
              </p>
            </div>

          </div>
        </div>

        <div className="pro-card p-4">
          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Categories
              </p>

              <p className="text-xl font-bold text-white">
                {categories.length}
              </p>
            </div>

          </div>
        </div>

        <div className="pro-card p-4">
          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Easy
              </p>

              <p className="text-xl font-bold text-white">
                {passages.filter((p) => p.difficulty === 'Easy').length}
              </p>
            </div>

          </div>
        </div>

        <div className="pro-card p-4">
          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-red-400" />
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Hard
              </p>

              <p className="text-xl font-bold text-white">
                {passages.filter((p) => p.difficulty === 'Hard').length}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* FILTERS */}
      <div className="pro-card p-4 sm:p-5 mb-8">

        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-4 h-4 text-yellow-400" />

          <span className="text-sm font-semibold text-white">
            Search & Filters
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

          {/* SEARCH */}
          <div className="relative md:col-span-2 xl:col-span-2">

            {!search && (
              <Search
                className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"
              />
            )}

            <input
              type="text"
              placeholder="Search by title or passage text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                'pro-input w-full transition-all',
                search ? '!pl-4' : '!pl-12'
              )}
            />

          </div>

          {/* CATEGORY */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pro-input"
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* DIFFICULTY */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="pro-input"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

        </div>

        {(search || categoryFilter || difficultyFilter) && (
          <div className="mt-4 flex items-center justify-between gap-3">

            <p className="text-xs text-slate-500">
              Showing{' '}
              <span className="text-slate-300 font-semibold">
                {filteredPassages.length}
              </span>{' '}
              of{' '}
              <span className="text-slate-300 font-semibold">
                {passages.length}
              </span>{' '}
              passages
            </p>

            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              Clear filters
            </button>

          </div>
        )}

      </div>

      {/* PASSAGE GRID */}
      {filteredPassages.length > 0 ? (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {filteredPassages.map((p) => (

            <div
              key={p.id}
              className="group pro-card p-5 sm:p-6 hover:border-slate-600 transition-all duration-300"
            >

              {/* CARD HEADER */}
              <div className="flex items-start justify-between gap-4 mb-5">

                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-2 mb-3">

                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      {p.category}
                    </span>

                    <span
                      className={cn(
                        'px-2.5 py-1 rounded-full border text-[10px] uppercase tracking-wider font-bold',
                        getDifficultyStyle(p.difficulty)
                      )}
                    >
                      {p.difficulty}
                    </span>

                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors truncate">
                    {p.title}
                  </h3>

                </div>

                {/* EDIT / DELETE */}
                <div className="flex items-center gap-1.5 shrink-0">

                  <button
                    onClick={() => handleOpenModal(p)}
                    className="w-9 h-9 rounded-xl border border-slate-700 bg-slate-900/70 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-800 transition-all flex items-center justify-center"
                    title="Edit passage"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-9 h-9 rounded-xl border border-slate-700 bg-slate-900/70 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all flex items-center justify-center"
                    title="Delete passage"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>

              {/* PASSAGE PREVIEW */}
              <div className="rounded-2xl border border-slate-700/70 bg-slate-950/50 p-4 sm:p-5 mb-5">

                <p
                  className={cn(
                    'text-slate-300 leading-relaxed font-serif line-clamp-4',
                    getFontSizeClass()
                  )}
                >
                  "{p.text}"
                </p>

              </div>

              {/* CARD FOOTER */}
              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-2 text-xs text-slate-500">

                  <FileText className="w-4 h-4" />

                  <span className="font-mono">
                    {p.text.length.toLocaleString()} characters
                  </span>

                </div>

                <button
                  onClick={() => handlePractice(p.id)}
                  className="pro-btn pro-btn-primary !px-4 !py-2.5 text-sm"
                >
                  <Play className="w-4 h-4" />
                  Practice
                </button>

              </div>

            </div>

          ))}

        </div>

      ) : (

        /* EMPTY STATE */
        <div className="pro-card py-16 px-6 text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-5">
            <Search className="w-7 h-7 text-slate-500" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            No passages found
          </h3>

          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Try changing your search or filters, or create a new passage for
            your library.
          </p>

          {(search || categoryFilter || difficultyFilter) && (
            <button
              onClick={clearFilters}
              className="pro-btn pro-btn-secondary"
            >
              Clear Filters
            </button>
          )}

        </div>

      )}

      {/* MODAL */}
      {isModalOpen && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md">

          <div className="w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-5 border-b border-slate-800">

              <div>

                <p className="text-xs uppercase tracking-widest text-yellow-400 font-bold mb-1">
                  Passage Library
                </p>

                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {editingId ? 'Edit Passage' : 'Create New Passage'}
                </h2>

              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* MODAL FORM */}
            <form
              onSubmit={handleSave}
              className="p-5 sm:p-6 overflow-y-auto max-h-[calc(92vh-90px)]"
            >

              <div className="space-y-5">

                {/* TITLE */}
                <div>

                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Passage Title
                  </label>

                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter passage title"
                    className="pro-input"
                  />

                </div>

                {/* CATEGORY + DIFFICULTY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>

                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Category
                    </label>

                    <input
                      required
                      type="text"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                        })
                      }
                      placeholder="e.g. General"
                      className="pro-input"
                    />

                  </div>

                  <div>

                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Difficulty
                    </label>

                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          difficulty: e.target.value as
                            | 'Easy'
                            | 'Medium'
                            | 'Hard',
                        })
                      }
                      className="pro-input"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>

                  </div>

                </div>

                {/* TEXT */}
                <div>

                  <div className="flex items-center justify-between mb-2">

                    <label className="text-sm font-semibold text-slate-300">
                      Passage Content
                    </label>

                    <span className="text-xs text-slate-500 font-mono">
                      {formData.text.length.toLocaleString()} characters
                    </span>

                  </div>

                  <textarea
                    required
                    rows={9}
                    value={formData.text}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        text: e.target.value,
                      })
                    }
                    placeholder="Type or paste your passage here..."
                    className="pro-input resize-none font-mono leading-relaxed"
                  />

                </div>

                {/* BUTTONS */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="pro-btn pro-btn-secondary"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="pro-btn pro-btn-primary"
                  >
                    <Plus className="w-4 h-4" />
                    {editingId ? 'Save Changes' : 'Create Passage'}
                  </button>

                </div>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}