
import React from 'react';
import { Denomination, NumberingSystem } from '../types';

interface DenominationRowProps {
  denomination: Denomination;
  count: number;
  symbol: string;
  onRowClick: (value: number) => void;
  isActive: boolean;
  index: number;
  numberingSystem: NumberingSystem;
}

const DenominationRow: React.FC<DenominationRowProps> = ({
  denomination,
  count,
  symbol,
  onRowClick,
  isActive,
  numberingSystem
}) => {
  const totalValue = count * denomination.value;
  const formatLocale = numberingSystem === 'indian' ? 'en-IN' : 'en-US';
  
  return (
    <div 
      onClick={() => onRowClick(denomination.value)}
      className={`flex items-center py-2 px-4 border-b border-[var(--bg-card)] last:border-0 cursor-pointer transition-colors group
        ${isActive 
          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30' 
          : 'hover:bg-[var(--bg-card-hover)]'
        }
      `}
    >
      {/* Value Label - 20% */}
      <div className="w-[20%] text-right">
        <span className={`text-lg font-bold transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-main)]'}`}>
          {symbol}{denomination.label}
        </span>
      </div>

      {/* X - 5% */}
      <div className="w-[5%] text-center text-[var(--text-muted)] font-light text-xl select-none opacity-30 group-hover:opacity-50 transition-opacity">×</div>

      {/* Input (Read Only) - 30% */}
      <div className="w-[30%] flex justify-end">
        <input
            type="text"
            readOnly
            inputMode="none" // Prevents keyboard on some devices
            value={count === 0 ? '' : count.toString()}
            placeholder="0"
            className={`w-full max-w-[8rem] text-right bg-transparent border rounded-md px-2 py-1 text-xl font-bold focus:outline-none placeholder:text-[var(--text-muted)]/30 transition-all cursor-pointer pointer-events-none
                ${isActive 
                    ? 'text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 bg-white/50 dark:bg-black/20' 
                    : 'text-[var(--text-main)] border-transparent group-hover:border-[var(--border-color)]'
                }
            `}
        />
      </div>

      {/* = - 5% */}
      <div className="w-[5%] text-center text-[var(--text-muted)] font-light text-xl select-none opacity-30 group-hover:opacity-50 transition-opacity">=</div>

      {/* Total Value - 40% */}
      <div className="w-[40%] text-right">
        <span className={`font-mono font-medium text-lg transition-colors ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-[var(--text-main)]'}`}>
          {totalValue > 0 ? (
             <span>
               {symbol}{totalValue.toLocaleString(formatLocale, { maximumFractionDigits: 0, useGrouping: numberingSystem !== 'none' })}
             </span>
          ) : (
             <span className="opacity-20 text-[var(--text-muted)]">-</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default React.memo(DenominationRow);
