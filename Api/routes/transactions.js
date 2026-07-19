const express = require('express');
const controller = require('../controllers/transactions');
const { isAuth } = require('../middlewares/isAuth');
const { validator } = require('../middlewares/validator');

const router = express.Router();

router
  .route('/')
  .get(isAuth, validator({ query: 'transactionQuery' }), controller.list)
  .post(isAuth, validator({ body: 'createTransaction' }), controller.create);

router
  .route('/:id')
  .get(isAuth, validator({ params: 'id' }), controller.getById)
  .patch(isAuth, validator({ params: 'id', body: 'updateTransaction' }), controller.update)
  .delete(isAuth, validator({ params: 'id' }), controller.remove);

module.exports = router;
