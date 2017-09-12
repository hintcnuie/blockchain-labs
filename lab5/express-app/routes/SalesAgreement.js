'use strict';

const express = require('express');
const router = express.Router();
const SalesAgreementModel = require('../models/SalesAgreementModel');

// handle the URL /SalesAgreement - this shows the list of all assets
router.get('/', function(req, res, next) {

  let SalesAgreementList;
  SalesAgreementModel.getAll(req.app.get('api path'), function (SalesAgreementList) {
    res.render('SalesAgreement-list',
               { title: 'SalesAgreement List',
                 SalesAgreementList: SalesAgreementList});
  });
});

// handle the URL /SalesAgreement/new - this shows the page for entering new data
router.get('/new', function(req, res, next) {
    res.render('SalesAgreement-new',
               { title: 'New SalesAgreement'});
});

// handle the URL /SalesAgreement/create - this handles the actual creation
router.get('/create', function(req, res, next) {
  // create the SalesAgreement object - $class & id will be added in the model
  let SalesAgreement = {
    "buyer": req.query.buyer,
        "seller": req.query.seller,
        
    "title": req.query.title
  };
  // call the 'create' method in the model, then show the list view
  SalesAgreementModel.create(SalesAgreement, req.app.get('api path'), function () {
    res.redirect('/SalesAgreement');
  });
});

// handle the URL /SalesAgreement/update/1234 - this shows the page for updating data
router.get('/update/:id', function(req, res, next) {
  let SalesAgreement;
  SalesAgreementModel.getById(req.params.id, req.app.get('api path'), function (SalesAgreement) {
    res.render('SalesAgreement-update',
               { title: 'Update SalesAgreement',
                 SalesAgreement: SalesAgreement,
                 id: req.params.id});
  });
});

// handle the URL /SalesAgreement/update/x/1234 - this handles the actual update
router.get('/update/x/:id', function(req, res, next) {
  // create the SalesAgreement object - $class will be added in the model
  let SalesAgreement = {
    "salesId": req.query.salesId,
      "buyer": req.query.buyer,
      "seller": req.query.seller,
      
    "title": req.query.title
  };
  // call the 'update' method in the model, then show the list view
  SalesAgreementModel.update(SalesAgreement, req.app.get('api path'), function () {
    res.redirect('/SalesAgreement');
  });
});

// handle the URL /SalesAgreement/delete/1234 - this shows the confirmation page for deleting an asset
router.get('/delete/:id', function(req, res, next) {
    let SalesAgreement;
    SalesAgreementModel.getById(req.params.id, req.app.get('api path'), function (SalesAgreement) {
      res.render('SalesAgreement-delete',
                 { title: 'Delete SalesAgreement?',
                   SalesAgreement: SalesAgreement,
                   id: req.params.id});
    });
});

// handle the URL /SalesAgreement/delete/x/1234 - this handles the actual deletion
router.get('/delete/x/:id', function(req, res, next) {
  // call the 'delete' method in the model, then show the list view
  SalesAgreementModel.delete(req.params.id, req.app.get('api path'), function () {
    res.redirect('/SalesAgreement');
  });
});

// handle the URL /SalesAgreement/1234 - this shows the details of an individual asset
router.get('/:id', function(req, res, next) {

  let SalesAgreement;
  SalesAgreementModel.getById(req.params.id, req.app.get('api path'), function (SalesAgreement) {
    res.render('SalesAgreement-detail',
               { title: 'SalesAgreement Detail',
                 SalesAgreement: SalesAgreement});
  });
});


module.exports = router;
