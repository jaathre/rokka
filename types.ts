
export interface Denomination {
  value: number;
  label: string; // e.g. "500", "200"
  type: 'note' | 'coin';
}

export interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  denominations: Denomination[];
}

export interface CashCount {
  [value: number]: number; // maps denomination value to count
}

export interface BreakdownItem {
  label: string;
  count: number;
  totalValue: number;
  color: string;
}

export interface SavedRecord {
  id: string;
  timestamp: number;
  totalAmount: number;
  currencyCode: string;
  counts: CashCount;
}

export type NumberingSystem = 'indian' | 'international' | 'none';

export type Theme = 'light' | 'dark' | 'black';
