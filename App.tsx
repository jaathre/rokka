
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CURRENCIES, CHART_COLORS } from './constants';
import { CashCount, BreakdownItem, NumberingSystem, Currency, Denomination, Theme, SavedRecord } from './types';
import DenominationRow from './components/DenominationRow';
import SummaryPanel from './components/SummaryPanel';
import SettingsModal from './components/SettingsModal';
import Numpad from './components/Numpad';
import { Menu, Share2, RotateCcw, AlertTriangle, Save } from 'lucide-react';
import html2canvas from 'html2canvas';
import { numberToWords } from './utils';

const App: React.FC = () => {
  // --- State ---
  const [currencies, setCurrencies] = useState<Currency[]>(CURRENCIES);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string>('inr');
  const [numberingSystem, setNumberingSystem] = useState<NumberingSystem>('indian');
  const [theme, setTheme] = useState<Theme>('light');
  const [counts, setCounts] = useState<CashCount>({});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [activeDenom, setActiveDenom] = useState<number | null>(null);
  
  // Load saved records from local storage
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>(() => {
    try {
      const saved = localStorage.getItem('rokka-saved');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load saved records", e);
      return [];
    }
  });

  // Save to local storage whenever savedRecords changes
  useEffect(() => {
    localStorage.setItem('rokka-saved', JSON.stringify(savedRecords));
  }, [savedRecords]);

  // --- Derived Data ---
  const currentCurrency = useMemo(() => 
    currencies.find(c => c.id === selectedCurrencyId) || currencies[0], 
  [currencies, selectedCurrencyId]);

  const { totalAmount, breakdown } = useMemo(() => {
    let amount = 0;
    let items = 0;
    const breakdownItems: BreakdownItem[] = [];

    currentCurrency.denominations.forEach((denom, index) => {
      const count = counts[denom.value] || 0;
      const value = count * denom.value;
      amount += value;
      items += count;

      breakdownItems.push({
        label: denom.label,
        count,
        totalValue: value,
        color: CHART_COLORS[index % CHART_COLORS.length],
      });
    });

    return { totalAmount: amount, totalCount: items, breakdown: breakdownItems };
  }, [counts, currentCurrency]);

  const formatLocale = numberingSystem === 'indian' ? 'en-IN' : 'en-US';

  const formattedTotal = new Intl.NumberFormat(formatLocale, {
    style: 'currency',
    currency: currentCurrency.code,
    maximumFractionDigits: 0,
    useGrouping: numberingSystem !== 'none'
  }).format(totalAmount);

  const totalInWords = useMemo(() => 
    numberToWords(totalAmount, numberingSystem), 
  [totalAmount, numberingSystem]);

  // --- Theme Effect ---
  const rootClass = useMemo(() => {
    if (theme === 'light') return 'h-screen flex flex-col font-sans overflow-hidden bg-[var(--bg-app)] transition-colors duration-300';
    if (theme === 'black') return 'dark theme-black h-screen flex flex-col font-sans overflow-hidden bg-[var(--bg-app)] transition-colors duration-300';
    return 'dark h-screen flex flex-col font-sans overflow-hidden bg-[var(--bg-app)] transition-colors duration-300';
  }, [theme]);

  // --- Handlers ---
  
  const handleRowClick = (denomValue: number) => {
    setActiveDenom(denomValue);
  };

  const handleNumpadClose = () => {
    setActiveDenom(null);
  };

  const handleNumpadPress = (key: string) => {
    if (activeDenom === null) return;

    setCounts(prev => {
      const currentCount = prev[activeDenom] || 0;
      let newCount = currentCount;

      if (key === 'CLEAR') {
        newCount = 0;
      } else if (key === 'BACKSPACE') {
        const str = currentCount.toString();
        newCount = str.length > 1 ? parseInt(str.slice(0, -1), 10) : 0;
      } else {
        // Number key
        const str = currentCount === 0 ? key : currentCount.toString() + key;
        // Prevent overflow/crazy numbers
        if (str.length <= 6) {
           newCount = parseInt(str, 10);
        }
      }

      return {
        ...prev,
        [activeDenom]: newCount
      };
    });
  };

  const handleCurrencyChange = (currencyId: string) => {
    setSelectedCurrencyId(currencyId);
    setCounts({});
    setActiveDenom(null);
  };

  const handleUpdateDenominations = (currencyId: string, newDenominations: Denomination[]) => {
    setCurrencies(prevCurrencies => 
      prevCurrencies.map(c => {
        if (c.id === currencyId) {
          return { ...c, denominations: newDenominations };
        }
        return c;
      })
    );
  };

  const handleResetClick = () => {
    setIsResetConfirmOpen(true);
  };

  const confirmReset = () => {
    setCounts({});
    setActiveDenom(null);
    setIsResetConfirmOpen(false);
  };

  const handleSave = () => {
    if (totalAmount === 0) return;
    
    const newRecord: SavedRecord = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      totalAmount,
      currencyCode: currentCurrency.code,
      counts: { ...counts }
    };

    setSavedRecords(prev => [newRecord, ...prev]);
    alert("Count saved successfully!");
  };

  const handleDeleteRecord = (id: string) => {
    setSavedRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleShare = async () => {
    await new Promise(resolve => setTimeout(resolve, 150));

    try {
      const canvas = await html2canvas(document.body, {
        backgroundColor: null, 
        scale: 2,
        ignoreElements: (element) => {
           return element.classList.contains('no-screenshot');
        }
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], `rokka-count-${Date.now()}.png`, { type: 'image/png' });
        const shareData = {
          title: 'ROKKA Cash Count',
          text: `Counted Total: ${formattedTotal}`,
          files: [file]
        };

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share(shareData);
          } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
               console.error('Error sharing', err);
            }
          }
        } else {
          const link = document.createElement('a');
          link.download = `rokka-count-${Date.now()}.png`;
          link.href = canvas.toDataURL();
          link.click();
        }
      });
    } catch (error) {
      console.error("Screenshot failed", error);
      alert("Could not capture screenshot.");
    }
  };

  return (
    <div className={rootClass}>
      {/* --- Header --- */}
      <header className="bg-[var(--bg-card)] border-b border-[var(--border-color)] shrink-0 z-30 shadow-sm h-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Left: Title */}
          <div className="flex items-center">
             <h1 className="text-2xl sm:text-3xl font-black text-slate-600 dark:text-slate-400 tracking-[0.2em] uppercase select-none">
              ROKKA
            </h1>
          </div>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Save */}
            <button
              onClick={handleSave}
              className="no-screenshot flex items-center gap-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors p-2 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              title="Save current count"
            >
               <Save size={20} />
               <span className="text-sm font-medium hidden sm:inline">Save</span>
            </button>

            {/* Reset */}
             <button
              onClick={handleResetClick}
              className="no-screenshot flex items-center gap-2 text-rose-600 hover:text-rose-700 dark:text-rose-500 dark:hover:text-rose-400 transition-colors p-2 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20"
              title="Reset all counts"
            >
              <RotateCcw size={20} />
              <span className="text-sm font-medium hidden sm:inline">Reset</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="no-screenshot flex items-center gap-2 text-[var(--text-muted)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-md hover:bg-[var(--bg-card-hover)]"
              title="Share"
            >
              <Share2 size={20} />
              <span className="text-sm font-medium hidden sm:inline">Share</span>
            </button>

            {/* Settings */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="no-screenshot flex items-center gap-2 text-[var(--text-muted)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 rounded-md hover:bg-[var(--bg-card-hover)]"
              title="Settings"
            >
              <Menu size={20} />
              <span className="text-sm font-medium hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full p-4 sm:p-6 gap-6">
        
        {/* Left Column: Inputs */}
        <div className="flex-1 flex flex-col min-w-0 lg:w-2/3 lg:flex-none h-full transition-all duration-300 relative">
            
            {/* Denominations List */}
            <div className={`flex-1 overflow-y-auto bg-[var(--bg-card)] rounded-t-2xl shadow-sm border border-[var(--border-color)] border-b-0 scroll-smooth relative transition-colors duration-300 ${activeDenom !== null ? 'pb-80 lg:pb-0' : ''}`}>
              
              {/* Table Header */}
              <div className="sticky top-0 z-20 bg-[var(--bg-card)]/95 backdrop-blur-sm flex items-center px-4 py-2 border-b border-[var(--border-color)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider transition-colors duration-300">
                <div className="w-[20%] text-right">VALUE</div>
                <div className="w-[5%] opacity-0">×</div>
                <div className="w-[30%] text-right">Count</div>
                <div className="w-[5%] opacity-0">=</div>
                <div className="w-[40%] text-right">Total</div>
              </div>

              <div className="divide-y divide-[var(--border-color)] pb-2">
                {currentCurrency.denominations.map((denom, index) => (
                  <DenominationRow
                    key={`${currentCurrency.id}-${denom.value}`}
                    denomination={denom}
                    count={counts[denom.value] || 0}
                    symbol={currentCurrency.symbol}
                    onRowClick={handleRowClick}
                    isActive={activeDenom === denom.value}
                    index={index}
                    numberingSystem={numberingSystem}
                  />
                ))}
                {currentCurrency.denominations.length === 0 && (
                   <div className="p-8 text-center text-[var(--text-muted)]">
                      <p>No denominations found.</p>
                      <button onClick={() => setIsSettingsOpen(true)} className="text-indigo-500 font-medium mt-2 hover:underline">Go to Settings to Add</button>
                   </div>
                )}
              </div>
            </div>

            {/* Grand Total Display - Always Visible */}
            <div className="bg-indigo-600 dark:bg-indigo-700 text-white py-3 px-4 flex flex-col gap-2 z-10 relative rounded-b-2xl transition-all shadow-lg">
                <div className="flex items-center justify-between w-full">
                    <div className="text-lg font-bold">Grand Total</div>
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-2xl font-bold">{formattedTotal}</span>
                    </div>
                </div>
                <div className="mt-1 pt-2 border-t border-white/20 text-center text-xs sm:text-sm font-medium uppercase tracking-wide opacity-90">
                    {totalInWords}
                </div>
            </div>
        </div>

        {/* Right Column: Summary */}
        <div className="hidden lg:block lg:w-1/3 h-full">
            <SummaryPanel
              breakdown={breakdown}
              currency={currentCurrency}
              numberingSystem={numberingSystem}
            />
        </div>
      </main>

      {/* Numpad Overlay */}
      {activeDenom !== null && (
        <div className="no-screenshot fixed bottom-0 left-0 right-0 z-40 animate-in slide-in-from-bottom duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:absolute lg:bottom-4 lg:left-auto lg:right-4 lg:w-96 lg:rounded-2xl">
           <Numpad onPress={handleNumpadPress} onClose={handleNumpadClose} />
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentCurrency={currentCurrency}
        currencies={currencies}
        onCurrencyChange={handleCurrencyChange}
        numberingSystem={numberingSystem}
        onNumberingChange={setNumberingSystem}
        onUpdateDenominations={handleUpdateDenominations}
        theme={theme}
        onThemeChange={setTheme}
        savedRecords={savedRecords}
        onDeleteRecord={handleDeleteRecord}
      />

      {/* Reset Confirmation Dialog */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--bg-card)] rounded-2xl shadow-xl max-w-sm w-full p-6 border border-[var(--border-color)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-[var(--text-main)] mb-2">
                <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-full text-rose-600 dark:text-rose-400">
                    <AlertTriangle size={20} />
                </div>
                <h3 className="text-lg font-bold">Reset Counts?</h3>
            </div>
            <p className="text-[var(--text-muted)] mb-6 ml-1">Are you sure you want to clear all current counts? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsResetConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl font-medium text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmReset}
                className="flex-1 py-2.5 rounded-xl font-medium bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-lg shadow-rose-500/20"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
