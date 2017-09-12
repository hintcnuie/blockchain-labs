'use strict';

const express = require('express');
const router = express.Router();
const TransactionModel = require('../models/TransactionModel');

// handle the URL /Transaction - this shows the list of all transactions
router.get('/', function(req, res, next) {

  let TrxList;
  TransactionModel.getAll(req.app.get('api path'), function (TrxList) {
    res.render('Transaction-list',
               { title: 'Transaction List',
                 TrxList: TrxList,
                 properties: TrxList});
  });
});

// handle the URL /Transaction/1234 - this shows the details of an individual transaction
router.get('/:id', function(req, res, next) {

  let Trx;
  TransactionModel.getById(req.params.id, req.app.get('api path'), function (Trx) {
    res.render('Transaction-detail',
               { title: 'Transaction Detail',
                 Trx: Trx});
  });
});


module.exports = router;
