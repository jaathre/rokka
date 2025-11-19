
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { BreakdownItem, Currency, NumberingSystem } from '../types';
import { CHART_COLORS } from '../constants';
import { TrendingUp } from 'lucide-react';

interface SummaryPanelProps {
  breakdown: BreakdownItem[];
  currency: Currency;
  numberingSystem: NumberingSystem;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  breakdown,
  currency,
  numberingSystem
}) => {
  const data = useMemo(() => {
    // Filter out zero values for the chart
    return breakdown.filter((item) => item.totalValue > 0);
  }, [breakdown]);

  const hasData = data.length > 0;
  const formatLocale = numberingSystem === 'indian' ? 'en-IN' : 'en-US';

  return (
    <div className="h-full flex flex-col">
      {/* Chart Card */}
      <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)] h-full flex flex-col transition-colors duration-300">
        <h3 className="text-[var(--text-main)] font-semibold mb-4 flex items-center gap-2 shrink-0">
          <TrendingUp size={18} className="text-indigo-500" />
          Distribution
        </h3>
        
        <div className="flex-1 min-h-0 flex items-center justify-center">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="totalValue"
                  stroke="var(--bg-card)"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    formatter={(value: number) => new Intl.NumberFormat(formatLocale, { 
                      style: 'currency', 
                      currency: currency.code, 
                      maximumFractionDigits: 0,
                      useGrouping: numberingSystem !== 'none'
                    }).format(value)}
                    contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-main)'
                    }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-[var(--text-muted)]">
              <p>No data to display</p>
              <p className="text-sm mt-1 opacity-70">Start counting to see analytics</p>
            </div>
          )}
        </div>

        {hasData && (
           <div className="mt-4 text-center shrink-0">
               <p className="text-xs text-[var(--text-muted)]">Value breakdown by denomination</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(SummaryPanel);
