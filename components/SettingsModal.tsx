
import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, Save, Palette, Globe, Trash2, FileText, ChevronRight, ArrowLeft, Layers, Plus, Coins, Banknote, Smartphone, Github, Info, Calendar } from 'lucide-react';
import { NumberingSystem, Currency, Denomination, Theme, SavedRecord } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurrency: Currency;
  currencies: Currency[];
  onCurrencyChange: (id: string) => void;
  numberingSystem: NumberingSystem;
  onNumberingChange: (system: NumberingSystem) => void;
  onUpdateDenominations: (currencyId: string, denoms: Denomination[]) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  savedRecords: SavedRecord[];
  onDeleteRecord: (id: string) => void;
}

type SettingsView = 'main' | 'general' | 'appearance' | 'saved' | 'denominations' | 'about';

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentCurrency,
  currencies,
  onCurrencyChange,
  numberingSystem,
  onNumberingChange,
  onUpdateDenominations,
  theme,
  onThemeChange,
  savedRecords,
  onDeleteRecord
}) => {
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const [editingDenoms, setEditingDenoms] = useState<Denomination[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCurrentView('main');
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentView === 'denominations') {
        setEditingDenoms([...currentCurrency.denominations]);
    }
  }, [currentView, currentCurrency]);

  if (!isOpen) return null;

  const getTitle = () => {
    switch (currentView) {
      case 'general': return 'General';
      case 'appearance': return 'Appearance';
      case 'saved': return 'Saved Records';
      case 'denominations': return 'Edit Denominations';
      case 'about': return 'About';
      default: return 'Settings';
    }
  };

  // --- Denomination Handlers ---
  const handleAddDenom = () => {
    setEditingDenoms(prev => [
        { value: 0, label: '0', type: 'note' }, 
        ...prev
    ]);
  };

  const handleRemoveDenom = (index: number) => {
    setEditingDenoms(prev => prev.filter((_, i) => i !== index));
  };

  const handleDenomChange = (index: number, field: keyof Denomination, value: string | number) => {
    setEditingDenoms(prev => {
        const newDenoms = [...prev];
        const updatedItem = { ...newDenoms[index], [field]: value };
        if (field === 'value') {
            updatedItem.label = value.toString();
        }
        newDenoms[index] = updatedItem;
        return newDenoms;
    });
  };

  const handleSaveDenominations = () => {
    const validDenoms = editingDenoms
        .filter(d => d.value > 0)
        .sort((a, b) => b.value - a.value);
    onUpdateDenominations(currentCurrency.id, validDenoms);
    setCurrentView('main');
  };


  const renderHeader = () => (
    <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-card)]/95 backdrop-blur-md shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-3">
        {currentView !== 'main' && (
          <button 
            onClick={() => setCurrentView('main')}
            className="p-1.5 -ml-2 hover:bg-[var(--bg-card-hover)] rounded-full text-[var(--text-muted)] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h2 className="text-xl font-bold text-[var(--text-main)]">{getTitle()}</h2>
      </div>
      <button 
        onClick={onClose}
        className="p-2 hover:bg-[var(--bg-card-hover)] rounded-full text-[var(--text-muted)] transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );

  const renderMainView = () => (
    <div className="p-6 space-y-3">
      <button 
        onClick={() => setCurrentView('general')}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-app)] hover:bg-[var(--bg-card-hover)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-[var(--bg-card)] rounded-lg shadow-sm text-[var(--text-muted)] group-hover:text-indigo-500 transition-colors">
            <Globe size={20} />
          </div>
          <div className="text-left">
            <div className="font-semibold text-[var(--text-main)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400">General</div>
            <div className="text-xs text-[var(--text-muted)] group-hover:text-indigo-500/70">Currency & Formatting</div>
          </div>
        </div>
        <ChevronRight size={18} className="text-[var(--border-strong)] group-hover:text-indigo-400" />
      </button>

      <button 
        onClick={() => setCurrentView('denominations')}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-app)] hover:bg-[var(--bg-card-hover)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-[var(--bg-card)] rounded-lg shadow-sm text-[var(--text-muted)] group-hover:text-indigo-500 transition-colors">
            <Layers size={20} />
          </div>
          <div className="text-left">
            <div className="font-semibold text-[var(--text-main)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Denominations</div>
            <div className="text-xs text-[var(--text-muted)] group-hover:text-indigo-500/70">Edit notes & coins</div>
          </div>
        </div>
        <ChevronRight size={18} className="text-[var(--border-strong)] group-hover:text-indigo-400" />
      </button>

      <button 
        onClick={() => setCurrentView('appearance')}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-app)] hover:bg-[var(--bg-card-hover)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-[var(--bg-card)] rounded-lg shadow-sm text-[var(--text-muted)] group-hover:text-indigo-500 transition-colors">
             <Palette size={20} />
          </div>
          <div className="text-left">
            <div className="font-semibold text-[var(--text-main)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Appearance</div>
            <div className="text-xs text-[var(--text-muted)] group-hover:text-indigo-500/70">Themes & display</div>
          </div>
        </div>
        <ChevronRight size={18} className="text-[var(--border-strong)] group-hover:text-indigo-400" />
      </button>

      <button 
        onClick={() => setCurrentView('saved')}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-app)] hover:bg-[var(--bg-card-hover)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-[var(--bg-card)] rounded-lg shadow-sm text-[var(--text-muted)] group-hover:text-indigo-500 transition-colors">
             <Save size={20} />
          </div>
          <div className="text-left">
            <div className="font-semibold text-[var(--text-main)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Saved Records</div>
            <div className="text-xs text-[var(--text-muted)] group-hover:text-indigo-500/70">View saved counts</div>
          </div>
        </div>
        <ChevronRight size={18} className="text-[var(--border-strong)] group-hover:text-indigo-400" />
      </button>

      <button 
        onClick={() => setCurrentView('about')}
        className="w-full flex items-center justify-between p-4 rounded-xl bg-[var(--bg-app)] hover:bg-[var(--bg-card-hover)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-[var(--bg-card)] rounded-lg shadow-sm text-[var(--text-muted)] group-hover:text-indigo-500 transition-colors">
             <Info size={20} />
          </div>
          <div className="text-left">
            <div className="font-semibold text-[var(--text-main)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400">About</div>
            <div className="text-xs text-[var(--text-muted)] group-hover:text-indigo-500/70">App info & developer</div>
          </div>
        </div>
        <ChevronRight size={18} className="text-[var(--border-strong)] group-hover:text-indigo-400" />
      </button>
    </div>
  );

  const renderGeneralView = () => (
    <div className="p-6 space-y-6">
      
      {/* Numbering System */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">Numbering System</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
           <button 
              onClick={() => onNumberingChange('indian')}
              className={`p-3 rounded-xl border text-left transition-all
                ${numberingSystem === 'indian' 
                   ? 'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-900/20 dark:border-indigo-400 dark:text-indigo-300' 
                   : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'}
              `}
           >
             <div className="text-sm font-semibold mb-1">Indian</div>
             <div className="text-xs opacity-70 font-mono">1,00,000</div>
           </button>

           <button 
              onClick={() => onNumberingChange('international')}
              className={`p-3 rounded-xl border text-left transition-all
                ${numberingSystem === 'international' 
                   ? 'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-900/20 dark:border-indigo-400 dark:text-indigo-300' 
                   : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'}
              `}
           >
             <div className="text-sm font-semibold mb-1">International</div>
             <div className="text-xs opacity-70 font-mono">100,000</div>
           </button>

           <button 
              onClick={() => onNumberingChange('none')}
              className={`p-3 rounded-xl border text-left transition-all
                ${numberingSystem === 'none' 
                   ? 'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-900/20 dark:border-indigo-400 dark:text-indigo-300' 
                   : 'bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)]'}
              `}
           >
             <div className="text-sm font-semibold mb-1">None</div>
             <div className="text-xs opacity-70 font-mono">100000</div>
           </button>
        </div>
      </div>

      <hr className="border-[var(--border-color)]" />

      {/* Currency Selection */}
      <div>
        <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">Select Currency</label>
        <div className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-app)]">
          <div className="max-h-[40vh] overflow-y-auto divide-y divide-[var(--border-color)]">
            {currencies.map((curr) => (
              <button
                key={curr.id}
                onClick={() => onCurrencyChange(curr.id)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 transition-colors text-left
                  ${curr.id === currentCurrency.id 
                    ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-200' 
                    : 'hover:bg-[var(--bg-card-hover)] text-[var(--text-main)]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg opacity-60 w-8 text-center">{curr.symbol}</span>
                  <div>
                    <div className="text-sm font-semibold">{curr.name}</div>
                    <div className="text-xs opacity-60">{curr.code}</div>
                  </div>
                </div>
                {curr.id === currentCurrency.id && (
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDenominationsView = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/20 text-sm text-indigo-800 dark:text-indigo-200 shrink-0">
           Customize denominations for <strong>{currentCurrency.name}</strong>. Entries with value 0 will be ignored.
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24 bg-[var(--bg-app)]">
          {editingDenoms.map((denom, index) => (
            <div key={index} className="flex items-center gap-3 bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-color)] shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Type Toggle */}
                <button 
                  onClick={() => handleDenomChange(index, 'type', denom.type === 'note' ? 'coin' : 'note')}
                  className={`h-12 w-12 flex items-center justify-center rounded-lg shrink-0 transition-colors ${denom.type === 'note' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}
                  title={`Toggle Type: ${denom.type}`}
                >
                    {denom.type === 'note' ? <Banknote size={24} /> : <Coins size={24} />}
                </button>

                {/* Value Input */}
                <div className="flex-1">
                    <label className="text-[10px] uppercase font-bold text-[var(--text-muted)] pl-1 mb-1 block">Value</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold select-none">
                            {currentCurrency.symbol}
                        </span>
                        <input 
                            type="number" 
                            value={denom.value === 0 ? '' : denom.value}
                            placeholder="0"
                            onChange={(e) => handleDenomChange(index, 'value', Number(e.target.value))}
                            className="w-full bg-[var(--bg-app)] border border-[var(--border-color)] rounded-lg pl-8 pr-4 py-2.5 font-mono text-lg font-bold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                        />
                    </div>
                </div>

                {/* Delete */}
                <button 
                    onClick={() => handleRemoveDenom(index)}
                    className="h-12 w-12 flex items-center justify-center text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors mt-5"
                    title="Remove"
                >
                    <Trash2 size={20} />
                </button>
            </div>
          ))}
          
          <button 
            onClick={handleAddDenom}
            className="w-full py-4 border-2 border-dashed border-[var(--border-color)] rounded-xl text-[var(--text-muted)] font-medium hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span>Add Denomination</span>
          </button>
        </div>

        {/* Footer Action */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[var(--bg-card)] border-t border-[var(--border-color)] z-10">
             <button 
                onClick={handleSaveDenominations}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
             >
                 <Save size={18} />
                 Save Changes
             </button>
        </div>
      </div>
    );
  };

  const renderAppearanceView = () => (
    <div className="p-6">
      <label className="block text-sm font-medium text-[var(--text-muted)] mb-3">Theme</label>
      <div className="grid grid-cols-1 gap-3">
        {/* Light Mode */}
        <button 
            onClick={() => onThemeChange('light')}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left
                ${theme === 'light' 
                ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900' 
                : 'border-[var(--border-color)] bg-[var(--bg-app)] text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]'}
            `}
        >
          <div className={`p-2 rounded-full shadow-sm ${theme === 'light' ? 'bg-white text-indigo-500' : 'bg-[var(--bg-card)] text-[var(--text-muted)]'}`}>
            <Sun size={20} />
          </div>
          <div>
             <div className="text-sm font-semibold">Light</div>
             <div className="text-xs opacity-60">Clean and bright</div>
          </div>
        </button>
        
        {/* Dark Mode */}
        <button 
            onClick={() => onThemeChange('dark')}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left
                ${theme === 'dark' 
                ? 'border-indigo-500 bg-slate-800 text-white' 
                : 'border-[var(--border-color)] bg-slate-800 text-slate-300 hover:bg-slate-700'}
            `}
        >
          <div className={`p-2 rounded-full shadow-sm ${theme === 'dark' ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
            <Moon size={20} />
          </div>
          <div>
             <div className="text-sm font-semibold">Dark</div>
             <div className="text-xs opacity-60">Slate grey comfort</div>
          </div>
        </button>

        {/* Black Mode */}
        <button 
            onClick={() => onThemeChange('black')}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left
                ${theme === 'black' 
                ? 'border-white bg-black text-white' 
                : 'border-[var(--border-color)] bg-black text-zinc-400 hover:border-zinc-700'}
            `}
        >
          <div className={`p-2 rounded-full shadow-sm ${theme === 'black' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500'}`}>
            <Smartphone size={20} />
          </div>
          <div>
             <div className="text-sm font-semibold">OLED Black</div>
             <div className="text-xs opacity-60">Pure black for efficiency</div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderSavedView = () => (
    <div className="p-6 space-y-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
            {savedRecords.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)] flex flex-col items-center">
                    <div className="p-3 bg-[var(--bg-app)] rounded-full mb-3">
                        <FileText size={24} className="opacity-50"/>
                    </div>
                    <p className="font-medium">No saved counts yet</p>
                    <p className="text-xs mt-1 opacity-70">Tap the green Save button on the main screen</p>
                </div>
            ) : (
                <div className="divide-y divide-[var(--border-color)]">
                    {savedRecords.map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-4 hover:bg-[var(--bg-card-hover)] transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-[var(--bg-app)] rounded-lg text-[var(--text-muted)] group-hover:bg-[var(--bg-card)] group-hover:text-indigo-500 transition-all">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-[var(--text-main)] font-mono">
                                        {new Intl.NumberFormat(numberingSystem === 'indian' ? 'en-IN' : 'en-US', {
                                            style: 'currency',
                                            currency: record.currencyCode,
                                            maximumFractionDigits: 0
                                        }).format(record.totalAmount)}
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)]">
                                        {new Date(record.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => onDeleteRecord(record.id)}
                                className="p-2 text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors opacity-50 group-hover:opacity-100"
                                title="Delete"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );

  const renderAboutView = () => (
    <div className="p-6 flex flex-col items-center text-center space-y-6">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-xl flex items-center justify-center mb-2">
        <span className="text-3xl font-black text-white tracking-wider">R</span>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-[var(--text-main)]">ROKKA</h3>
        <p className="text-[var(--text-muted)] font-medium">Cash Denomination Counter</p>
      </div>

      <div className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xs mx-auto">
        A simple, elegant tool for counting cash efficiently. Designed with focus on usability and aesthetics.
      </div>

      <div className="w-full pt-4">
        <a 
            href="https://github.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group"
        >
            <Github size={20} className="text-[var(--text-main)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
            <span className="font-semibold text-[var(--text-main)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400">My GitHub Profile</span>
        </a>
      </div>

      <div className="mt-auto pt-8">
         <p className="text-xs text-[var(--text-muted)]">
            Built with React & Tailwind<br/>
            v1.1.0
         </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[var(--border-color)] animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col relative transition-colors duration-300">
        
        {renderHeader()}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-[var(--bg-app)]">
            {currentView === 'main' && renderMainView()}
            {currentView === 'general' && renderGeneralView()}
            {currentView === 'denominations' && renderDenominationsView()}
            {currentView === 'appearance' && renderAppearanceView()}
            {currentView === 'saved' && renderSavedView()}
            {currentView === 'about' && renderAboutView()}
        </div>
        
        {/* Footer only on main view */}
        {currentView === 'main' && (
            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-app)] text-center shrink-0">
                <p className="text-xs text-[var(--text-muted)]">ROKKA v1.1.0</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
