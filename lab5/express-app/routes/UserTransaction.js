'use strict';

const express = require('express');
const router = express.Router();
const UserTransactionModel = require('../models/UserTransactionModel');


// handle the URL /trx/RegisterPropertyForSale - this shows the page for entering data
router.get('/RegisterPropertyForSale', function(req, res, next) {
    res.render('RegisterPropertyForSale',
               { title: 'RegisterPropertyForSale'});
});

// handle the URL /trx/RegisterPropertyForSale/x - this handles the actual execution
router.get('/RegisterPropertyForSale/x', function(req, res, next) {
  // create the transaction - $class, id & timestamp will be added in the model
  let trx = {
  "seller": req.query.seller,
    
    "title": req.query.title
  };
  // call the transaction method in the model, then show the transaction view
  UserTransactionModel.RegisterPropertyForSale(trx, req.app.get('api path'), function () {
    res.redirect('/Transaction');
  });
});




module.exports = router;
