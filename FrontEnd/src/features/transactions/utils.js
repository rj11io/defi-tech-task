import dayjs from 'dayjs';

import { CATEGORY_LABELS } from './constants';

const currencyFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export const formatCurrency = cents => currencyFormatter.format((cents || 0) / 100);

export const formatEntryDate = date => dayjs(date).locale('en').format('D MMM YYYY');

export const getSummary = entries => {
  const income = entries.filter(entry => entry.type === 'income').reduce((sum, entry) => sum + entry.amount, 0);
  const expenses = entries.filter(entry => entry.type === 'expense').reduce((sum, entry) => sum + entry.amount, 0);
  const balance = income - expenses;

  return {
    income,
    expenses,
    balance,
    savingsRate: income > 0 ? Math.round((balance / income) * 100) : 0
  };
};

export const getExpenseBreakdown = entries => {
  const totals = {};
  entries
    .filter(entry => entry.type === 'expense')
    .forEach(entry => {
      totals[entry.category] = (totals[entry.category] || 0) + entry.amount;
    });
  const overall = Object.values(totals).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(totals)
    .map(([category, amount]) => ({
      category,
      label: CATEGORY_LABELS[category] || category,
      amount,
      percentage: overall > 0 ? Math.round((amount / overall) * 100) : 0
    }))
    .sort((first, second) => second.amount - first.amount);
};
