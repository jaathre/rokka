
import React from 'react';
import { Denomination, NumberingSystem } from '../types';

interface DenominationRowProps {
  denomination: Denomination;
  count: number;
  symbol: string;
  isActive: boolean;
  onSelect: (value: number) => void;
  index: number;
  numberingSystem: NumberingSystem;
}

// Neutral monochrome styles for all rows
const ROW_STYLE = {
  base: 'bg-transparent hover:bg-[var(--bg-card-hover)]', 
  active: 'bg-[var(--bg-card-hover)] border-r-[var(--text-main)]', 
  text: 'text-[var(--text-main)]', 
  subText: 'text-[var(--text-muted)]',
  countBase: 'text-[var(--text-muted)]',
  countActive: 'bg-[var(--bg-app)] text-[var(--text-main)] ring-[var(--text-muted)]'
};

const DenominationRow: React.FC<DenominationRowProps> = ({
  denomination,
  count,
  symbol,
  isActive,
  onSelect,
  index,
  numberingSystem
}) => {
  const totalValue = count * denomination.value;
  const formatLocale = numberingSystem === 'indian' ? 'en-IN' : 'en-US';
  
  return (
    <div 
      onClick={() => onSelect(denomination.value)}
      className={`
        flex items-center py-2 px-4 cursor-pointer transition-all duration-200 border-b border-[var(--bg-card)] last:border-0
        ${isActive 
          ? `${ROW_STYLE.active} border-r-4 pr-3` 
          : `${ROW_STYLE.base} border-r-4 border-r-transparent`
        }
      `}
    >
      {/* Value Label - Right Aligned (25%) */}
      <div className="w-[25%] text-right">
        <span className={`text-lg font-bold ${ROW_STYLE.text}`}>
          {symbol}{denomination.label}
        </span>
      </div>

      {/* Multiplication Symbol (5%) */}
      <div className={`w-[5%] text-center ${ROW_STYLE.subText} font-light text-xl select-none opacity-50`}>×</div>

      {/* Count Display - Right Aligned (20%) */}
      <div className="w-[20%] flex justify-end">
        <span className={`
          inline-block px-2 py-1 rounded-md font-mono text-xl min-w-[2.5rem] text-center transition-all
          ${isActive 
            ? `${ROW_STYLE.countActive} shadow-sm ring-1 font-bold` 
            : `${ROW_STYLE.text} opacity-70`
          }
          ${count === 0 && !isActive ? ROW_STYLE.countBase : ''}
        `}>
          {count}
        </span>
      </div>

      {/* Equals Symbol (5%) */}
      <div className={`w-[5%] text-center ${ROW_STYLE.subText} font-light text-xl select-none opacity-50`}>=</div>

      {/* Total Value - Right Aligned (45%) */}
      <div className="w-[45%] text-right">
        <span className={`font-mono font-medium text-lg ${isActive ? ROW_STYLE.text : 'text-[var(--text-muted)]'}`}>
          {totalValue > 0 ? (
             <span className={ROW_STYLE.text}>
               {symbol}{totalValue.toLocaleString(formatLocale, { maximumFractionDigits: 0, useGrouping: numberingSystem !== 'none' })}
             </span>
          ) : (
             <span className="opacity-30">-</span>
          )}
        </span>
      </div>
    </div>
  );
};

export default React.memo(DenominationRow);
