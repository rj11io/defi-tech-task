const mongoose = require('mongoose');

const { Schema } = mongoose;

const TRANSACTION_TYPES = ['income', 'expense'];
const TRANSACTION_CATEGORIES = [
  'salary',
  'freelance',
  'housing',
  'food',
  'transport',
  'utilities',
  'health',
  'leisure',
  'shopping',
  'education',
  'gifts',
  'other'
];

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true
    },
    type: {
      type: String,
      enum: TRANSACTION_TYPES,
      required: true
    },
    amount: {
      type: Number,
      min: 1,
      max: 100000000000,
      required: true,
      validate: Number.isInteger
    },
    category: {
      type: String,
      enum: TRANSACTION_CATEGORIES,
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 100,
      required: true
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    date: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

schema.index({ userId: 1, date: -1, createdAt: -1 });

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', schema);

module.exports = Transaction;
module.exports.TRANSACTION_TYPES = TRANSACTION_TYPES;
module.exports.TRANSACTION_CATEGORIES = TRANSACTION_CATEGORIES;
