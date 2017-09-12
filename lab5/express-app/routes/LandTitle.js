'use strict';

const express = require('express');
const router = express.Router();
const LandTitleModel = require('../models/LandTitleModel');

const PersonModel = require('../models/PersonModel');
const UserTransactionModel = require('../models/UserTransactionModel');

// handle the URL /LandTitle - this shows the list of all assets
router.get('/', function(req, res, next) {

  let LandTitleList;
  LandTitleModel.getAll(req.app.get('api path'), function (LandTitleList) {
    res.render('LandTitle-list',
               { title: 'LandTitle List',
                 LandTitleList: LandTitleList});
  });
});

// handle the URL /LandTitle/new - this shows the page for entering new data
router.get('/new', function(req, res, next) {
  // get the list of Persons to populate the drop-down
  PersonModel.getAll(req.app.get('api path'), function (PersonList) {
    res.render('LandTitle-new',
              { title: 'New LandTitle',
                owners: PersonList});
  });
});

// handle the URL /LandTitle/create - this handles the actual creation
router.get('/create', function(req, res, next) {
  // create the LandTitle object - $class & id will be added in the model
  let LandTitle = {
    "owner": "resource:net.biz.digitalPropertyNetwork.Person#" + req.query.ownerId,
    "information": req.query.information,
    "forSale": req.query.forSale
  };
  // call the 'create' method in the model, then show the list view
  LandTitleModel.create(LandTitle, req.app.get('api path'), function () {
    res.redirect('/LandTitle');
  });
});

// handle the URL /LandTitle/sell/1234
// this route was created to manage calls to the RegisterPropertyForSale user transaction
router.get('/sell/:titleId', function(req, res, next) {
  // get the LandTitle object
  let LandTitle;
  LandTitleModel.getById(req.params.titleId, req.app.get('api path'), function (LandTitle) {

    let trx = {
      title: req.params.titleId,
      seller: LandTitle.owner
    }

    UserTransactionModel.RegisterPropertyForSale(trx, req.app.get('api path'), function (LandTitle) {
      res.redirect('/LandTitle');
    });

  });

});



// handle the URL /LandTitle/update/1234 - this shows the page for updating data
router.get('/update/:id', function(req, res, next) {
  let LandTitle;
  LandTitleModel.getById(req.params.id, req.app.get('api path'), function (LandTitle) {

    PersonModel.getAll(req.app.get('api path'), function (PersonList) {
      res.render('LandTitle-update',
                 { title: 'Update LandTitle',
                   LandTitle: LandTitle,
                   id: req.params.id,
                   owners: PersonList});
    });
  });

});

// handle the URL /LandTitle/update/x/1234 - this handles the actual update
router.get('/update/x/:id', function(req, res, next) {
  // create the LandTitle object - $class will be added in the model
  let LandTitle = {
    "titleId": req.query.titleId,
      "owner": req.query.owner,
      "information": req.query.information,

    "forSale": req.query.forSale
  };
  // call the 'update' method in the model, then show the list view
  LandTitleModel.update(LandTitle, req.app.get('api path'), function () {
    res.redirect('/LandTitle');
  });
});

// handle the URL /LandTitle/delete/1234 - this shows the confirmation page for deleting an asset
router.get('/delete/:id', function(req, res, next) {
    let LandTitle;
    LandTitleModel.getById(req.params.id, req.app.get('api path'), function (LandTitle) {
      res.render('LandTitle-delete',
                 { title: 'Delete LandTitle?',
                   LandTitle: LandTitle,
                   id: req.params.id});
    });
});

// handle the URL /LandTitle/delete/x/1234 - this handles the actual deletion
router.get('/delete/x/:id', function(req, res, next) {
  // call the 'delete' method in the model, then show the list view
  LandTitleModel.delete(req.params.id, req.app.get('api path'), function () {
    res.redirect('/LandTitle');
  });
});

// handle the URL /LandTitle/1234 - this shows the details of an individual asset
router.get('/:id', function(req, res, next) {

  let LandTitle;
  LandTitleModel.getById(req.params.id, req.app.get('api path'), function (LandTitle) {
    res.render('LandTitle-detail',
               { title: 'LandTitle Detail',
                 LandTitle: LandTitle});
  });
});


module.exports = router;
