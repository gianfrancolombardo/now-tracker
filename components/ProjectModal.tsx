import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PRESET_COLORS, EMOJI_LIBRARY } from '../constants';
import { useTime } from '../context/TimeContext';
import { Project } from '../types';
import { Modal } from './Modal';
import { Search, X, Trash2 } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, projectToEdit }) => {
  const { addProject, updateProject, deleteProject } = useTime();
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_LIBRARY[0].char);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  // Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with project data if editing
  useEffect(() => {
    if (isOpen && projectToEdit) {
      setName(projectToEdit.name);
      setSelectedEmoji(projectToEdit.emoji);
      setSelectedColor(projectToEdit.color);
    } else if (isOpen && !projectToEdit) {
      // Reset defaults for new project
      setName('');
      setSelectedEmoji(EMOJI_LIBRARY[0].char);
      setSelectedColor(PRESET_COLORS[0]);
    }
  }, [isOpen, projectToEdit]);

  // Focus input when search opens
  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching]);

  // Reset search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsSearching(false);
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredEmojis = useMemo(() => {
    if (!searchQuery) return EMOJI_LIBRARY;
    const lowerQ = searchQuery.toLowerCase();
    return EMOJI_LIBRARY.filter(item =>
      item.tags.some(tag => tag.includes(lowerQ)) || item.char.includes(lowerQ)
    );
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (projectToEdit) {
      updateProject(projectToEdit.id, { name, emoji: selectedEmoji, color: selectedColor });
    } else {
      addProject({ name, emoji: selectedEmoji, color: selectedColor });
    }
    onClose();
  };

  const handleDelete = () => {
    if (projectToEdit && confirm(`Archive "${projectToEdit.name}"? It will be removed from the dashboard but kept in history.`)) {
      deleteProject(projectToEdit.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={projectToEdit ? 'Edit Project' : 'New Project'}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name Input */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-gray-950/50 border border-white/10 text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 outline-none text-lg placeholder-gray-700 transition-all shadow-inner"
            placeholder="e.g., Deep Work"
            autoFocus
          />
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Color Theme</label>
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-4 -mx-2 px-2">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-12 h-12 rounded-full transition-all duration-500 relative flex-shrink-0 ${selectedColor === color ? 'scale-110' : 'hover:scale-105 opacity-40 hover:opacity-100'}`}
                style={{ backgroundColor: color, boxShadow: selectedColor === color ? `0 0 25px ${color}80` : 'none' }}
              >
                {selectedColor === color && (
                  <div className="absolute inset-0 rounded-full border-[3px] border-white shadow-inner"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Picker with Search */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center mb-1">
            {isSearching ? (
              <div className="flex-1 flex items-center gap-3 animate-fade-in bg-white/5 rounded-2xl px-4 py-2 border border-white/10 glass-panel">
                <Search size={16} className="text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-base text-white w-full placeholder-gray-600"
                  placeholder="Search icons..."
                />
                <button
                  type="button"
                  onClick={() => { setIsSearching(false); setSearchQuery(''); }}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Icon</label>
                <button
                  type="button"
                  onClick={() => setIsSearching(true)}
                  className="p-2.5 bg-white/5 hover:bg-brand-500/20 rounded-xl text-gray-400 hover:text-brand-400 transition-all border border-white/5"
                >
                  <Search size={18} />
                </button>
              </>
            )}
          </div>

          <div className="bg-gray-950/40 rounded-[2rem] border border-white/5 shadow-inner">
            {filteredEmojis.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto no-scrollbar py-6 px-4">
                {filteredEmojis.map(item => (
                  <button
                    key={item.char}
                    type="button"
                    onClick={() => setSelectedEmoji(item.char)}
                    className={`h-16 w-16 text-3xl flex items-center justify-center rounded-2xl transition-all duration-300 flex-shrink-0 ${selectedEmoji === item.char ? 'bg-white/10 ring-2 ring-white/20 scale-125 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'hover:bg-white/5 opacity-40 hover:opacity-100 hover:scale-105'}`}
                  >
                    {item.char}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-600 text-sm font-medium italic">
                No icons found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {/* Soft Delete Button - Only shown when editing */}
          {projectToEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl text-base font-bold uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
            </button>
          )}

          <button
            type="submit"
            className={`py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl text-base font-bold uppercase tracking-wider transition-all shadow-lg shadow-brand-900/40 active:scale-[0.98] border-t border-white/10 ${projectToEdit ? 'flex-[4]' : 'w-full'}`}
          >
            {projectToEdit ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};