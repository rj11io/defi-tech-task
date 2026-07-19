export const CATEGORIES = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'housing', label: 'Housing' },
  { value: 'food', label: 'Food & groceries' },
  { value: 'transport', label: 'Transport' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'health', label: 'Health' },
  { value: 'leisure', label: 'Leisure' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'education', label: 'Education' },
  { value: 'gifts', label: 'Gifts' },
  { value: 'other', label: 'Other' }
];

export const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map(category => [category.value, category.label]));

export const TYPE_OPTIONS = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' }
];
