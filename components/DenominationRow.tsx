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

// Helper for dark mode neutral styles.
// We use !important ('!') on some properties to ensure they override the colored utility classes 
// if there are any specificity issues, ensuring a strictly monochrome look in dark mode.
const DARK_STYLES = {
  base: 'dark:bg-transparent dark:hover:bg-[var(--bg-card-hover)]', 
  active: 'dark:!bg-[var(--bg-card-hover)] dark:!border-r-[var(--text-muted)]', 
  text: 'dark:!text-[var(--text-main)]', 
  subText: 'dark:!text-[var(--text-muted)]',
  countBase: 'dark:!text-[var(--border-strong)]',
  countActive: 'dark:!bg-[var(--bg-app)] dark:!text-[var(--text-main)] dark:!ring-[var(--border-strong)]'
};

// VIBGYOR color styles configuration for Light Mode
// Dark mode classes are now standardized via DARK_STYLES
const COLOR_STYLES = [
  // Violet
  { 
    base: `bg-violet-50/60 hover:bg-violet-100/70 ${DARK_STYLES.base}`, 
    active: `bg-violet-100 border-r-violet-500 ${DARK_STYLES.active}`, 
    text: `text-violet-900 ${DARK_STYLES.text}`, 
    subText: `text-violet-400 ${DARK_STYLES.subText}`,
    countBase: `text-violet-300 ${DARK_STYLES.countBase}`,
    countActive: `bg-white text-violet-600 ring-violet-200 ${DARK_STYLES.countActive}`
  },
  // Indigo
  { 
    base: `bg-indigo-50/60 hover:bg-indigo-100/70 ${DARK_STYLES.base}`, 
    active: `bg-indigo-100 border-r-indigo-500 ${DARK_STYLES.active}`, 
    text: `text-indigo-900 ${DARK_STYLES.text}`, 
    subText: `text-indigo-400 ${DARK_STYLES.subText}`,
    countBase: `text-indigo-300 ${DARK_STYLES.countBase}`,
    countActive: `bg-white text-indigo-600 ring-indigo-200 ${DARK_STYLES.countActive}`
  },
  // Blue
  { 
    base: `bg-blue-50/60 hover:bg-blue-100/70 ${DARK_STYLES.base}`, 
    active: `bg-blue-100 border-r-blue-500 ${DARK_STYLES.active}`, 
    text: `text-blue-900 ${DARK_STYLES.text}`, 
    subText: `text-blue-400 ${DARK_STYLES.subText}`,
    countBase: `text-blue-300 ${DARK_STYLES.countBase}`,
    countActive: `bg-white text-blue-600 ring-blue-200 ${DARK_STYLES.countActive}`
  },
  // Green
  { 
    base: `bg-green-50/60 hover:bg-green-100/70 ${DARK_STYLES.base}`, 
    active: `bg-green-100 border-r-green-500 ${DARK_STYLES.active}`, 
    text: `text-green-900 ${DARK_STYLES.text}`, 
    subText: `text-green-400 ${DARK_STYLES.subText}`,
    countBase: `text-green-300 ${DARK_STYLES.countBase}`,
    countActive: `bg-white text-green-600 ring-green-200 ${DARK_STYLES.countActive}`
  },
  // Yellow
  { 
    base: `bg-yellow-50/60 hover:bg-yellow-100/70 ${DARK_STYLES.base}`, 
    active: `bg-yellow-100 border-r-yellow-500 ${DARK_STYLES.active}`, 
    text: `text-yellow-900 ${DARK_STYLES.text}`, 
    subText: `text-yellow-400 ${DARK_STYLES.subText}`,
    countBase: `text-yellow-300 ${DARK_STYLES.countBase}`,
    countActive: `bg-white text-yellow-600 ring-yellow-200 ${DARK_STYLES.countActive}`
  },
  // Orange
  { 
    base: `bg-orange-50/60 hover:bg-orange-100/70 ${DARK_STYLES.base}`, 
    active: `bg-orange-100 border-r-orange-500 ${DARK_STYLES.active}`, 
    text: `text-orange-900 ${DARK_STYLES.text}`, 
    subText: `text-orange-400 ${DARK_STYLES.subText}`,
    countBase: `text-orange-300 ${DARK_STYLES.countBase}`,
    countActive: `bg-white text-orange-600 ring-orange-200 ${DARK_STYLES.countActive}`
  },
  // Red
  { 
    base: `bg-red-50/60 hover:bg-red-100/70 ${DARK_STYLES.base}`, 
    active: `bg-red-100 border-r-red-500 ${DARK_STYLES.active}`, 
    text: `text-red-900 ${DARK_STYLES.text}`, 
    subText: `text-red-400 ${DARK_STYLES.subText}`,
    countBase: `text-red-300 ${DARK_STYLES.countBase}`,
    countActive: `bg-white text-red-600 ring-red-200 ${DARK_STYLES.countActive}`
  },
];

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
  const style = COLOR_STYLES[index % COLOR_STYLES.length];
  const formatLocale = numberingSystem === 'indian' ? 'en-IN' : 'en-US';

  return (
    <div 
      onClick={() => onSelect(denomination.value)}
      className={`
        flex items-center py-3 px-4 cursor-pointer transition-all duration-200 border-b border-[var(--bg-card)] last:border-0
        ${isActive 
          ? `${style.active} border-r-4 pr-3` 
          : `${style.base} border-r-4 border-r-transparent`
        }
      `}
    >
      {/* Label - Right Aligned */}
      <div className="w-32 text-right">
        <span className={`text-lg font-bold ${style.text}`}>
          {symbol}{denomination.label}
        </span>
      </div>

      {/* Multiplication Symbol */}
      <div className={`${style.subText} font-light text-xl px-2 select-none opacity-50`}>×</div>

      {/* Count Display - Right Aligned */}
      <div className="flex-1 flex justify-end pr-4">
        <span className={`
          inline-block px-4 py-1 rounded-md font-mono text-xl min-w-[3rem] text-right transition-all
          ${isActive 
            ? `${style.countActive} shadow-sm ring-1 font-bold` 
            : `${style.text} opacity-70`
          }
          ${count === 0 && !isActive ? style.countBase : ''}
        `}>
          {count}
        </span>
      </div>

      {/* Equals Symbol */}
      <div className={`${style.subText} font-light text-xl px-2 select-none opacity-50`}>=</div>

      {/* Total Value - Right Aligned */}
      <div className="w-28 text-right">
        <span className={`font-mono font-medium text-lg ${isActive ? style.text : 'text-[var(--text-muted)]'}`}>
          {totalValue > 0 ? (
             <span className={style.text}>
               {symbol}{totalValue.toLocaleString(formatLocale, { maximumFractionDigits: 0 })}
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