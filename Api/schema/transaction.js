const { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } = require('../models/transaction');

const properties = {
  type: { type: 'string', enum: TRANSACTION_TYPES },
  amount: { type: 'integer', minimum: 1, maximum: 100000000000 },
  category: { type: 'string', enum: TRANSACTION_CATEGORIES },
  description: { type: 'string', minLength: 1, maxLength: 100, isNotEmpty: true },
  note: { type: 'string', maxLength: 500 },
  date: { type: 'string', format: 'date-time' }
};

module.exports = {
  createTransaction: {
    $id: 'createTransaction',
    type: 'object',
    properties,
    required: ['type', 'amount', 'category', 'description', 'date'],
    additionalProperties: false
  },
  updateTransaction: {
    $id: 'updateTransaction',
    type: 'object',
    properties,
    minProperties: 1,
    additionalProperties: false
  },
  transactionQuery: {
    $id: 'transactionQuery',
    type: 'object',
    properties: {
      type: { type: 'string', enum: TRANSACTION_TYPES },
      category: { type: 'string', enum: TRANSACTION_CATEGORIES },
      from: { type: 'string', format: 'date-time' },
      to: { type: 'string', format: 'date-time' }
    },
    additionalProperties: false
  }
};
