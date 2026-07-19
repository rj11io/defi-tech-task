const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
      index: true
    },
    amountCents: {
      type: Number,
      required: true,
      min: 1,
      max: 99999999999999,
      validate: {
        validator: Number.isSafeInteger,
        message: 'Amount must be a safe integer number of cents'
      }
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160
    },
    category: {
      type: String,
      trim: true,
      maxlength: 64,
      default: 'Other'
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    currency: {
      type: String,
      uppercase: true,
      trim: true,
      enum: ['EUR'],
      minlength: 3,
      maxlength: 3,
      default: 'EUR'
    }
  },
  { timestamps: true }
);

schema.index({ user: 1, date: -1 });

module.exports = mongoose.models.Transaction || mongoose.model('Transaction', schema);
