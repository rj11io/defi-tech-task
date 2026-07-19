const express = require('express');
const controller = require('../controllers/transactions');
const { isAuth } = require('../middlewares/isAuth');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router
  .route('/')
  .get(validator({ query: 'transactionQuery' }), isAuth, controller.get)
  .post(validator('createTransaction'), isAuth, controller.create);

router
  .route('/:id')
  .get(validator({ params: 'transactionId' }), isAuth, controller.getById)
  .patch(validator({ params: 'transactionId', body: 'updateTransaction' }), isAuth, controller.update)
  .delete(validator({ params: 'transactionId' }), isAuth, controller.delete);

module.exports = router;
