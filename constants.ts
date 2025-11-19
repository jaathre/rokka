import { Currency } from './types';

export const CURRENCIES: Currency[] = [
  {
    id: 'inr',
    name: 'Indian Rupee',
    code: 'INR',
    symbol: '₹',
    denominations: [
      { value: 500, label: '500', type: 'note' },
      { value: 200, label: '200', type: 'note' },
      { value: 100, label: '100', type: 'note' },
      { value: 50, label: '50', type: 'note' },
      { value: 20, label: '20', type: 'note' },
      { value: 10, label: '10', type: 'note' },
      { value: 5, label: '5', type: 'coin' },
      { value: 2, label: '2', type: 'coin' },
      { value: 1, label: '1', type: 'coin' },
    ],
  },
  {
    id: 'usd',
    name: 'US Dollar',
    code: 'USD',
    symbol: '$',
    denominations: [
      { value: 100, label: '100', type: 'note' },
      { value: 50, label: '50', type: 'note' },
      { value: 20, label: '20', type: 'note' },
      { value: 10, label: '10', type: 'note' },
      { value: 5, label: '5', type: 'note' },
      { value: 2, label: '2', type: 'note' },
      { value: 1, label: '1', type: 'note' },
    ],
  },
  {
    id: 'eur',
    name: 'Euro',
    code: 'EUR',
    symbol: '€',
    denominations: [
      { value: 500, label: '500', type: 'note' },
      { value: 200, label: '200', type: 'note' },
      { value: 100, label: '100', type: 'note' },
      { value: 50, label: '50', type: 'note' },
      { value: 20, label: '20', type: 'note' },
      { value: 10, label: '10', type: 'note' },
      { value: 5, label: '5', type: 'note' },
      { value: 2, label: '2', type: 'coin' },
      { value: 1, label: '1', type: 'coin' },
    ],
  },
  {
    id: 'gbp',
    name: 'British Pound',
    code: 'GBP',
    symbol: '£',
    denominations: [
      { value: 50, label: '50', type: 'note' },
      { value: 20, label: '20', type: 'note' },
      { value: 10, label: '10', type: 'note' },
      { value: 5, label: '5', type: 'note' },
      { value: 2, label: '2', type: 'coin' },
      { value: 1, label: '1', type: 'coin' },
    ],
  },
  {
    id: 'jpy',
    name: 'Japanese Yen',
    code: 'JPY',
    symbol: '¥',
    denominations: [
      { value: 10000, label: '10k', type: 'note' },
      { value: 5000, label: '5k', type: 'note' },
      { value: 2000, label: '2k', type: 'note' },
      { value: 1000, label: '1k', type: 'note' },
      { value: 500, label: '500', type: 'coin' },
      { value: 100, label: '100', type: 'coin' },
      { value: 50, label: '50', type: 'coin' },
      { value: 10, label: '10', type: 'coin' },
      { value: 5, label: '5', type: 'coin' },
      { value: 1, label: '1', type: 'coin' },
    ],
  },
  {
    id: 'aud',
    name: 'Australian Dollar',
    code: 'AUD',
    symbol: '$',
    denominations: [
      { value: 100, label: '100', type: 'note' },
      { value: 50, label: '50', type: 'note' },
      { value: 20, label: '20', type: 'note' },
      { value: 10, label: '10', type: 'note' },
      { value: 5, label: '5', type: 'note' },
      { value: 2, label: '2', type: 'coin' },
      { value: 1, label: '1', type: 'coin' },
    ],
  },
  {
    id: 'cad',
    name: 'Canadian Dollar',
    code: 'CAD',
    symbol: '$',
    denominations: [
      { value: 100, label: '100', type: 'note' },
      { value: 50, label: '50', type: 'note' },
      { value: 20, label: '20', type: 'note' },
      { value: 10, label: '10', type: 'note' },
      { value: 5, label: '5', type: 'note' },
      { value: 2, label: '2', type: 'coin' },
      { value: 1, label: '1', type: 'coin' },
    ],
  },
  {
    id: 'cny',
    name: 'Chinese Yuan',
    code: 'CNY',
    symbol: '¥',
    denominations: [
      { value: 100, label: '100', type: 'note' },
      { value: 50, label: '50', type: 'note' },
      { value: 20, label: '20', type: 'note' },
      { value: 10, label: '10', type: 'note' },
      { value: 5, label: '5', type: 'note' },
      { value: 1, label: '1', type: 'coin' },
    ],
  },
];

// VIBGYOR Colors for Chart consistency
export const CHART_COLORS = [
  '#8b5cf6', // Violet (Violet-500)
  '#6366f1', // Indigo (Indigo-500)
  '#3b82f6', // Blue (Blue-500)
  '#22c55e', // Green (Green-500)
  '#eab308', // Yellow (Yellow-500)
  '#f97316', // Orange (Orange-500)
  '#ef4444', // Red (Red-500)
];