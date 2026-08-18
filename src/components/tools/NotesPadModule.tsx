import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Download,
  Copy,
  Check,
  Tag,
  Clock,
  Edit3,
  Bookmark
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { WorkplaceNote } from '../../types/erp';

export const NotesPadModule: React.FC = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    currentUser
  } = useERP();

  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  const selectedNote = notes.find(n => n.id === selectedNoteId) || notes[0];

  const categories: WorkplaceNote['category'][] = ['Executive', 'HR', 'Engineering', 'Finance', 'Procurement', 'General'];

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'ALL' || n.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleCreateNewNote = () => {
    const newCreated = addNote({
      title: 'Untitled Note',
      category: 'General',
      content: '# New Workplace Memo\n\nStart typing notes, meeting minutes, or action items...',
      tags: ['Workplace', 'Draft'],
      pinned: false,
      authorName: currentUser.name
    });
    setSelectedNoteId(newCreated.id);
  };

  const handleCopyContent = () => {
    if (!selectedNote) return;
    navigator.clipboard.writeText(selectedNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!selectedNote) return;
    const blob = new Blob([selectedNote.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedNote.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = selectedNote?.content ? selectedNote.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = selectedNote ? selectedNote.content.length : 0;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto" id="notes-pad-module-root">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Productivity & Documentation
            </span>
            <span className="text-xs text-neutral-400 font-mono">Local & Cloud Sync</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Notes & Workplace Text Pad</h1>
          <p className="text-sm text-neutral-400">Capture meeting minutes, architectural decisions, HR guidelines, and rapid scratchpad notes</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNewNote}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/20 transition-all cursor-pointer"
            id="btn-create-note"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        
        {/* Left Sidebar: Notes Directory */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4 flex flex-col">
          
          {/* Search and Category Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search notes or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setCategoryFilter('ALL')}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  categoryFilter === 'ALL' ? 'bg-amber-600 text-white' : 'bg-neutral-950 text-neutral-400 hover:text-white'
                }`}
              >
                All ({notes.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                    categoryFilter === cat ? 'bg-amber-600 text-white' : 'bg-neutral-950 text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px]">
            {filteredNotes.length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-500 space-y-2 border border-dashed border-neutral-800 rounded-xl">
                <p>No notes found.</p>
                <button
                  onClick={handleCreateNewNote}
                  className="px-3 py-1 bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 rounded-lg text-[11px] font-medium"
                >
                  + Add first note
                </button>
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = selectedNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-amber-950/20 border-amber-500/50 shadow-md'
                        : 'bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        {note.pinned && <Pin className="w-3 h-3 text-amber-400 shrink-0" />}
                        <span className="text-xs font-bold text-white truncate">{note.title || 'Untitled'}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-neutral-800 text-neutral-300 shrink-0">
                        {note.category}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {note.content.replace(/[#*`_]/g, '')}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-1">
                      <span>{note.authorName}</span>
                      <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Editor Area */}
        {selectedNote ? (
          <div className="lg:col-span-8 p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4 flex flex-col">
            
            {/* Editor Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                  placeholder="Note Title"
                  className="w-full text-xl font-black text-white bg-transparent border-none focus:outline-hidden"
                />
                <div className="flex items-center gap-2 mt-1">
                  <select
                    value={selectedNote.category}
                    onChange={(e) => updateNote(selectedNote.id, { category: e.target.value as WorkplaceNote['category'] })}
                    className="px-2 py-0.5 rounded-md bg-neutral-950 border border-neutral-800 text-[10px] text-amber-300 font-mono focus:outline-hidden"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Updated: {new Date(selectedNote.updatedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateNote(selectedNote.id, { pinned: !selectedNote.pinned })}
                  className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                    selectedNote.pinned
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                  title={selectedNote.pinned ? 'Unpin Note' : 'Pin to Top'}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleCopyContent}
                  className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1"
                  title="Copy to Clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleDownloadMarkdown}
                  className="p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1"
                  title="Export .md"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {notes.length > 1 && (
                  <button
                    onClick={() => {
                      deleteNote(selectedNote.id);
                      setSelectedNoteId(notes.find(n => n.id !== selectedNote.id)?.id || '');
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Markdown Text Area */}
            <div className="flex-1 flex flex-col">
              <textarea
                value={selectedNote.content}
                onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                className="w-full flex-1 p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 text-neutral-200 font-mono text-xs leading-relaxed focus:outline-hidden focus:border-amber-500/50 resize-none min-h-[380px]"
                placeholder="Write markdown here..."
              />
            </div>

            {/* Footer Stats */}
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 border-t border-neutral-800/80 pt-3">
              <div className="flex items-center gap-3">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{charCount} characters</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Check className="w-3 h-3" />
                <span>Auto-saved to local state</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 p-12 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex flex-col items-center justify-center text-center">
            <EmptyState
              icon={FileText}
              title="No Note Selected"
              description="Create a new workplace memo, meeting minutes, architecture document, or daily notes scratchpad."
              actionText="+ Create Workplace Note"
              onAction={handleCreateNewNote}
            />
          </div>
        )}

      </div>

    </div>
  );
};
