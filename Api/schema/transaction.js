module.exports = {
  transactionId: {
    $id: 'transactionId',
    type: 'object',
    properties: {
      id: { $ref: 'objectId' }
    },
    required: ['id'],
    additionalProperties: false
  },
  createTransaction: {
    $id: 'createTransaction',
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['income', 'expense'] },
      amount: { type: 'number', exclusiveMinimum: 0, multipleOf: 0.01 },
      description: { type: 'string', minLength: 1, maxLength: 160, isNotEmpty: true },
      category: { type: 'string', minLength: 1, maxLength: 64, isNotEmpty: true },
      date: { type: 'string', format: 'date-time' },
      currency: { type: 'string', pattern: '^[A-Za-z]{3}$' }
    },
    required: ['type', 'amount', 'description', 'date'],
    additionalProperties: false
  },
  updateTransaction: {
    $id: 'updateTransaction',
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['income', 'expense'] },
      amount: { type: 'number', exclusiveMinimum: 0, multipleOf: 0.01 },
      description: { type: 'string', minLength: 1, maxLength: 160, isNotEmpty: true },
      category: { type: 'string', minLength: 1, maxLength: 64, isNotEmpty: true },
      date: { type: 'string', format: 'date-time' },
      currency: { type: 'string', pattern: '^[A-Za-z]{3}$' }
    },
    minProperties: 1,
    additionalProperties: false
  },
  transactionQuery: {
    $id: 'transactionQuery',
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['income', 'expense'] },
      category: { type: 'string', maxLength: 64 },
      search: { type: 'string', maxLength: 160 },
      from: { type: 'string', format: 'date-time' },
      to: { type: 'string', format: 'date-time' },
      page: { type: 'integer', minimum: 1, default: 1 },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 100 }
    },
    additionalProperties: false
  }
};
