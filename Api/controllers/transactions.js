const Transaction = require('../models/transaction');
const { SendData, ServerError, NotFound } = require('../helpers/response');

const toCents = amount => Math.round(Number(amount) * 100);

const serialize = transaction => ({
  _id: transaction._id.toString(),
  type: transaction.type,
  amount: transaction.amountCents / 100,
  description: transaction.description,
  category: transaction.category,
  date: transaction.date.toISOString(),
  currency: transaction.currency,
  createdAt: transaction.createdAt.toISOString(),
  updatedAt: transaction.updatedAt.toISOString()
});

const createValues = body => ({
  type: body.type,
  amountCents: toCents(body.amount),
  description: body.description,
  category: body.category || 'Other',
  date: body.date,
  currency: (body.currency || 'EUR').toUpperCase()
});

const updateValues = body => {
  const values = { ...body };
  if (Object.prototype.hasOwnProperty.call(values, 'amount')) {
    values.amountCents = toCents(values.amount);
    delete values.amount;
  }
  if (values.currency) values.currency = values.currency.toUpperCase();
  return values;
};

const queryForUser = (userId, query) => {
  const filter = { user: userId };
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.search) filter.description = new RegExp(query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to);
  }
  return filter;
};

exports.get = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const filter = queryForUser(req.user._id, req.query);
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments(filter)
    ]);

    res.set('x-total-count', total.toString());
    res.set('x-page', page.toString());
    res.set('x-page-size', limit.toString());
    return next(SendData(transactions.map(serialize)));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.getById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user._id });
    return transaction ? next(SendData(serialize(transaction))) : next(NotFound());
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.create = async (req, res, next) => {
  try {
    const transaction = await new Transaction({ user: req.user._id, ...createValues(req.body) }).save();
    return next(SendData(serialize(transaction), 201));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.update = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: updateValues(req.body) },
      { new: true, runValidators: true }
    );
    return transaction ? next(SendData(serialize(transaction))) : next(NotFound());
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    return transaction ? next(SendData({ message: 'Transaction deleted successfully' })) : next(NotFound());
  } catch (err) {
    return next(ServerError(err));
  }
};
