import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CURRENCIES, CHART_COLORS } from './constants';
import { CashCount, BreakdownItem, NumberingSystem, Currency, Denomination, Theme } from './types';
import DenominationRow from './components/DenominationRow';
import SummaryPanel from './components/SummaryPanel';
import Numpad from './components/Numpad';
import SettingsModal from './components/SettingsModal';
import { Settings, Share2, RotateCcw, AlertTriangle } from 'lucide-react';
import html2canvas from 'html2canvas';

const App: React.FC = () => {
  // --- State ---
  const [currencies, setCurrencies] = useState<Currency[]>(CURRENCIES);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string>('inr');
  const [numberingSystem, setNumberingSystem] = useState<NumberingSystem>('indian');
  const [theme, setTheme] = useState<Theme>('light');
  const [counts, setCounts] = useState<CashCount>({});
  const [activeDenominationVal, setActiveDenominationVal] = useState<number | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

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
  }).format(totalAmount);

  // --- Theme Effect ---
  // This applies the class to the root element so standard Tailwind `dark:` classes work,
  // and the custom `theme-black` class triggers the CSS variable overrides in index.html.
  const rootClass = useMemo(() => {
    if (theme === 'light') return 'h-screen flex flex-col font-sans overflow-hidden bg-[var(--bg-app)] transition-colors duration-300';
    if (theme === 'black') return 'dark theme-black h-screen flex flex-col font-sans overflow-hidden bg-[var(--bg-app)] transition-colors duration-300';
    return 'dark h-screen flex flex-col font-sans overflow-hidden bg-[var(--bg-app)] transition-colors duration-300';
  }, [theme]);

  // --- Handlers ---
  const handleNumpadPress = useCallback((key: string) => {
    if (activeDenominationVal === null) return;

    setCounts(prev => {
      const currentCount = prev[activeDenominationVal] || 0;
      let newCount = currentCount;

      if (key === 'CLEAR') {
        newCount = 0;
      } else if (key === 'BACKSPACE') {
        newCount = Math.floor(currentCount / 10);
      } else {
        const digit = parseInt(key, 10);
        const potentialCount = currentCount * 10 + digit;
        if (potentialCount < 100000) { 
             newCount = potentialCount;
        }
      }

      return {
        ...prev,
        [activeDenominationVal]: newCount
      };
    });
  }, [activeDenominationVal]);

  const handleCurrencyChange = (currencyId: string) => {
    setSelectedCurrencyId(currencyId);
    setCounts({});
    setActiveDenominationVal(null);
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
    setActiveDenominationVal(null);
    setIsResetConfirmOpen(false);
  };

  const handleShare = async () => {
    setActiveDenominationVal(null);
    await new Promise(resolve => setTimeout(resolve, 150));

    try {
      // Use null background to respect the current theme's CSS variables
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full grid grid-cols-3 items-center">
          
          {/* Left: Settings */}
          <div className="justify-self-start">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="no-screenshot flex items-center gap-2 text-[var(--text-muted)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 -ml-2 rounded-md hover:bg-[var(--bg-card-hover)]"
            >
              <Settings size={20} />
              <span className="text-sm font-medium hidden sm:inline">Settings</span>
            </button>
          </div>

          {/* Center: Title */}
          <div className="justify-self-center">
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] tracking-[0.2em] uppercase select-none">
              ROKKA
            </h1>
          </div>

          {/* Right: Reset & Share Button */}
          <div className="justify-self-end flex items-center gap-1">
            <button
              onClick={handleResetClick}
              className="no-screenshot flex items-center gap-2 text-rose-600 hover:text-rose-700 dark:text-rose-500 dark:hover:text-rose-400 transition-colors p-2 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20"
              title="Reset all counts"
            >
              <RotateCcw size={20} />
              <span className="text-sm font-medium hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={handleShare}
              className="no-screenshot flex items-center gap-2 text-[var(--text-muted)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-2 -mr-2 rounded-md hover:bg-[var(--bg-card-hover)]"
            >
              <Share2 size={20} />
              <span className="text-sm font-medium hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full p-4 sm:p-6 gap-6">
        
        {/* Left Column: Inputs & Numpad */}
        <div className="flex-1 flex flex-col min-w-0 lg:w-2/3 lg:flex-none h-full transition-all duration-300">
            
            {/* Denominations List */}
            <div className="flex-1 overflow-y-auto bg-[var(--bg-card)] rounded-t-2xl shadow-sm border border-[var(--border-color)] border-b-0 scroll-smooth relative transition-colors duration-300">
              
              {/* Table Header */}
              <div className="sticky top-0 z-20 bg-[var(--bg-card)]/95 backdrop-blur-sm flex items-center px-4 py-3 border-b border-[var(--border-color)] text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider transition-colors duration-300">
                <div className="w-32 text-right">DENOMINATION</div>
                <div className="w-6 px-2 opacity-0">×</div>
                <div className="flex-1 text-right pr-8">Count</div>
                <div className="w-6 px-2 opacity-0">=</div>
                <div className="w-28 text-right">Total</div>
              </div>

              <div className="divide-y divide-[var(--border-color)] pb-4">
                {currentCurrency.denominations.map((denom, index) => (
                  <DenominationRow
                    key={`${currentCurrency.id}-${denom.value}`}
                    denomination={denom}
                    count={counts[denom.value] || 0}
                    symbol={currentCurrency.symbol}
                    isActive={activeDenominationVal === denom.value}
                    onSelect={setActiveDenominationVal}
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

            {/* Grand Total Display */}
            <div className={`bg-indigo-600 dark:bg-indigo-700 text-white py-3 px-4 flex items-center justify-between z-10 relative transition-all ${activeDenominationVal === null ? 'rounded-b-2xl mb-0' : 'rounded-b-none'}`}>
               <div className="text-lg font-bold">Grand Total</div>
               <div className="flex items-center gap-3">
                  <span className="font-mono text-2xl font-bold">{formattedTotal}</span>
               </div>
            </div>

            {/* Numpad */}
            {activeDenominationVal !== null && (
              <div className="no-screenshot bg-[var(--bg-card)] p-4 rounded-b-2xl shadow-sm border border-[var(--border-color)] border-t-0 animate-in slide-in-from-bottom-10 duration-200 fade-in transition-colors duration-300">
                <div className="max-w-md mx-auto">
                   <Numpad 
                      onPress={handleNumpadPress} 
                      onClose={() => setActiveDenominationVal(null)}
                   />
                </div>
              </div>
            )}
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