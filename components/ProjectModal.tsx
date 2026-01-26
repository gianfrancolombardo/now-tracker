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
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Color Theme</label>
          <div className="flex flex-wrap gap-3">
            {PRESET_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full transition-all duration-300 relative ${selectedColor === color ? 'scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'}`}
                style={{ backgroundColor: color, boxShadow: selectedColor === color ? `0 0 15px ${color}` : 'none' }}
              >
                {selectedColor === color && (
                  <div className="absolute inset-0 rounded-full border-2 border-white"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Picker with Search */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center h-8">
            {isSearching ? (
              <div className="flex-1 flex items-center gap-2 animate-fade-in bg-gray-800/50 rounded-xl px-3 py-1 border border-white/10">
                <Search size={14} className="text-gray-400" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
                  placeholder="Search icons..."
                />
                <button 
                  type="button" 
                  onClick={() => { setIsSearching(false); setSearchQuery(''); }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Icon</label>
                <button 
                  type="button"
                  onClick={() => setIsSearching(true)}
                  className="p-2 bg-gray-800/50 hover:bg-brand-500/20 rounded-lg text-gray-400 hover:text-brand-400 transition-colors"
                >
                  <Search size={16} />
                </button>
              </>
            )}
          </div>

          <div className="bg-gray-950/30 rounded-2xl p-4 border border-white/5 max-h-48 overflow-y-auto no-scrollbar shadow-inner">
            {filteredEmojis.length > 0 ? (
              <div className="grid grid-cols-6 gap-2">
                {filteredEmojis.map(item => (
                  <button
                    key={item.char}
                    type="button"
                    onClick={() => setSelectedEmoji(item.char)}
                    className={`aspect-square text-2xl flex items-center justify-center rounded-xl transition-all duration-200 ${selectedEmoji === item.char ? 'bg-brand-500/20 ring-1 ring-brand-500 scale-110 shadow-[0_0_10px_rgba(14,165,233,0.3)]' : 'hover:bg-white/5 opacity-70 hover:opacity-100 hover:scale-105'}`}
                  >
                    {item.char}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600 text-sm">
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