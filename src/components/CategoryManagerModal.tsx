import React, { useState } from 'react';
import { Category, StudyTextbook } from '../types';
import { Tag, Plus, Edit2, Trash2, X, Check, Folder } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  textbooks: StudyTextbook[];
  onCreateCategory: (cat: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
  onEditCategory: (cat: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

const COMMON_EMOJIS = ['🧠', '📚', '⏰', '🥗', '✨', '⚡', '🎯', '🔥', '💡', '🛡️', '🧬', '🔬', '💼', '🧘'];

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  textbooks,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📁');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#F59E0B');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingCategory(null);
    setName('');
    setIcon('🎯');
    setDescription('');
    setColor('#3B82F6');
    setErrorMessage('');
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsCreating(false);
    setName(cat.name);
    setIcon(cat.icon || '📁');
    setDescription(cat.description || '');
    setColor(cat.color || '#F59E0B');
    setErrorMessage('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Category name cannot be empty.');
      return;
    }

    try {
      if (editingCategory) {
        await onEditCategory({
          ...editingCategory,
          name: name.trim(),
          icon: icon.trim() || '📁',
          description: description.trim(),
          color
        });
        setEditingCategory(null);
      } else {
        await onCreateCategory({
          name: name.trim(),
          icon: icon.trim() || '📁',
          description: description.trim(),
          color
        });
        setIsCreating(false);
      }
      setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save category.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteCategory(id);
      setConfirmDeleteId(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
      <div className="w-full max-w-xl bg-[#FFFDF9] border-2 border-black rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#F8FAFC] border-b-2 border-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-700" />
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-tight text-black font-mono">
                Category Management
              </h2>
              <p className="text-[11px] text-slate-600 font-sans">
                Create, customize, and organize your visual curriculum categories
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 border border-black rounded bg-white hover:bg-slate-100 text-black cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {errorMessage && (
            <div className="p-2.5 bg-rose-50 border border-rose-300 rounded text-rose-900 text-xs font-mono">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Form when Creating or Editing */}
          {(isCreating || editingCategory) && (
            <form onSubmit={handleSave} className="p-4 bg-amber-50/70 border-2 border-black rounded-md space-y-3">
              <div className="flex items-center justify-between border-b border-black/20 pb-1.5 text-xs font-mono font-bold text-black">
                <span>{editingCategory ? '✏️ Edit Category' : '➕ Create New Category'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCategory(null);
                  }}
                  className="text-slate-500 hover:text-black text-[11px]"
                >
                  Cancel
                </button>
              </div>

              {/* Icon & Name Row */}
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1 space-y-1">
                  <label className="block text-[11px] font-mono font-bold text-slate-700">Icon / Emoji</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    maxLength={4}
                    className="w-full text-center py-1.5 text-base border-2 border-black rounded bg-white font-mono"
                  />
                </div>

                <div className="col-span-3 space-y-1">
                  <label className="block text-[11px] font-mono font-bold text-slate-700">Category Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Focus & Peak Execution"
                    className="w-full px-2.5 py-1.5 text-xs border-2 border-black rounded bg-white font-mono"
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick Emoji Picker */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-mono text-slate-500">Quick Emojis:</span>
                {COMMON_EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setIcon(e)}
                    className="p-1 text-sm bg-white hover:bg-amber-100 rounded border border-black/20 cursor-pointer"
                  >
                    {e}
                  </button>
                ))}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono font-bold text-slate-700">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of topics covered..."
                  className="w-full px-2.5 py-1.5 text-xs border border-black rounded bg-white font-mono"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCategory(null);
                  }}
                  className="px-3 py-1 bg-white border border-black rounded text-xs font-mono font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 bg-black hover:bg-slate-800 text-white border border-black rounded text-xs font-mono font-extrabold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Categories List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-black/20 pb-1 text-xs font-mono font-bold text-slate-700">
              <span>All Categories ({categories.length})</span>
              {!isCreating && !editingCategory && (
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="px-2.5 py-1 bg-black text-white hover:bg-slate-800 rounded font-mono text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Category</span>
                </button>
              )}
            </div>

            {categories.map((cat) => {
              const count = textbooks.filter((t) => t.categoryId === cat.id).length;
              const isDeleting = confirmDeleteId === cat.id;

              return (
                <div
                  key={cat.id}
                  className="p-3 bg-white border-2 border-black rounded-md flex items-center justify-between gap-3 shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0 p-1 bg-amber-50 border border-black/20 rounded">
                      {cat.icon || '📁'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-black font-sans-custom truncate">
                          {cat.name}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-100 border border-black/30 px-1.5 py-0.2 rounded font-bold">
                          {count} {count === 1 ? 'guide' : 'guides'}
                        </span>
                      </div>
                      {cat.description && (
                        <p className="text-[11px] text-slate-600 truncate max-w-md font-sans">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isDeleting ? (
                      <div className="flex items-center gap-1 bg-rose-50 border border-rose-300 p-1 rounded font-mono text-xs">
                        <span className="text-rose-800 text-[11px] font-bold px-1">Delete?</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-[11px]"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[11px]"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          className="p-1.5 text-slate-600 hover:text-black hover:bg-slate-100 border border-transparent hover:border-black rounded transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(cat.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-300 rounded transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#F8FAFC] border-t-2 border-black flex items-center justify-between text-xs font-mono text-slate-600">
          <span>Categories help group videos in your library navigation.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-black text-white font-bold rounded hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
