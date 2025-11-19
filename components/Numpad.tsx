import React from 'react';
import { Delete, Eraser, Check } from 'lucide-react';

interface NumpadProps {
  onPress: (key: string) => void;
  onClose: () => void;
}

const Numpad: React.FC<NumpadProps> = ({ onPress, onClose }) => {
  const buttons = [
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: 'C', value: 'CLEAR', icon: <Eraser size={20} /> },
    { label: '0', value: '0' },
    { label: '⌫', value: 'BACKSPACE', icon: <Delete size={20} /> },
  ];

  return (
    <div className="bg-[var(--bg-app)] rounded-2xl shadow-inner p-4 transition-colors duration-300">
      <div className="grid grid-cols-3 gap-3 mb-3">
        {buttons.map((btn) => (
          <button
            key={btn.value}
            onClick={() => onPress(btn.value)}
            className={`
              flex items-center justify-center h-14 sm:h-16 rounded-xl text-xl font-bold transition-all duration-100 active:scale-95
              ${btn.value === 'CLEAR' 
                ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/30 dark:hover:bg-indigo-900/40' 
                : btn.value === 'BACKSPACE'
                  ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-900/30 dark:hover:bg-indigo-900/40'
                  : 'bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm hover:bg-[var(--bg-card-hover)] border-b-2 border-[var(--border-color)] hover:border-[var(--border-strong)]'
              }
            `}
          >
            {btn.icon || btn.label}
          </button>
        ))}
      </div>
      
      <div>
        <button 
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-700 dark:bg-indigo-600 text-white font-semibold uppercase tracking-wide hover:bg-slate-800 dark:hover:bg-indigo-700 active:scale-95 transition-colors flex items-center justify-center gap-2"
        >
          <Check size={18} />
          <span className="text-sm">Done</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(Numpad);