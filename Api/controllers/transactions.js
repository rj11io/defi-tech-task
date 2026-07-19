const Transaction = require('../models/transaction');
const { NotFound, SendData, ServerError } = require('../helpers/response');

const responseFields = '_id type amount category description note date createdAt updatedAt';

const toResponse = transaction => {
  const data = transaction.toObject();
  delete data.userId;
  delete data.__v;
  return data;
};

const buildQuery = (userId, { type, category, from, to }) => {
  const query = { userId };

  if (type) query.type = type;
  if (category) query.category = category;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  return query;
};

exports.list = async (req, res, next) => {
  try {
    const data = await Transaction.find(buildQuery(res.locals.user._id, req.query))
      .select(responseFields)
      .sort({ date: -1, createdAt: -1 })
      .limit(500)
      .lean();

    return next(SendData(data));
  } catch (error) {
    return next(ServerError(error));
  }
};

exports.create = async (req, res, next) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      userId: res.locals.user._id
    });

    return next(SendData(toResponse(transaction), 201));
  } catch (error) {
    return next(ServerError(error));
  }
};

exports.getById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: res.locals.user._id
    })
      .select(responseFields)
      .lean();

    return transaction ? next(SendData(transaction)) : next(NotFound());
  } catch (error) {
    return next(ServerError(error));
  }
};

exports.update = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: res.locals.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .select(responseFields)
      .lean();

    return transaction ? next(SendData(transaction)) : next(NotFound());
  } catch (error) {
    return next(ServerError(error));
  }
};

exports.remove = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: res.locals.user._id
    });

    return transaction ? next(SendData({ message: 'Entry deleted successfully' })) : next(NotFound());
  } catch (error) {
    return next(ServerError(error));
  }
};
