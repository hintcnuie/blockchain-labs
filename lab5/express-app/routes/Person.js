'use strict';

const express = require('express');
const router = express.Router();
const PersonModel = require('../models/PersonModel');

// handle the URL /Person - this shows the list of all assets
router.get('/', function(req, res, next) {

  let PersonList;
  PersonModel.getAll(req.app.get('api path'), function (PersonList) {
    res.render('Person-list',
               { title: 'Person List',
                 PersonList: PersonList});
  });
});

// handle the URL /Person/new - this shows the page for entering new data
router.get('/new', function(req, res, next) {
    res.render('Person-new',
               { title: 'New Person'});
});

// handle the URL /Person/create - this handles the actual creation
router.get('/create', function(req, res, next) {
  // create the Person object - $class & id will be added in the model
  let Person = {
    "firstName": req.query.firstName,
        
    "lastName": req.query.lastName
  };
  // call the 'create' method in the model, then show the list view
  PersonModel.create(Person, req.app.get('api path'), function () {
    res.redirect('/Person');
  });
});

// handle the URL /Person/update/1234 - this shows the page for updating data
router.get('/update/:id', function(req, res, next) {
  let Person;
  PersonModel.getById(req.params.id, req.app.get('api path'), function (Person) {
    res.render('Person-update',
               { title: 'Update Person',
                 Person: Person,
                 id: req.params.id});
  });
});

// handle the URL /Person/update/x/1234 - this handles the actual update
router.get('/update/x/:id', function(req, res, next) {
  // create the Person object - $class will be added in the model
  let Person = {
    "personId": req.query.personId,
      "firstName": req.query.firstName,
      
    "lastName": req.query.lastName
  };
  // call the 'update' method in the model, then show the list view
  PersonModel.update(Person, req.app.get('api path'), function () {
    res.redirect('/Person');
  });
});

// handle the URL /Person/delete/1234 - this shows the confirmation page for deleting an asset
router.get('/delete/:id', function(req, res, next) {
    let Person;
    PersonModel.getById(req.params.id, req.app.get('api path'), function (Person) {
      res.render('Person-delete',
                 { title: 'Delete Person?',
                   Person: Person,
                   id: req.params.id});
    });
});

// handle the URL /Person/delete/x/1234 - this handles the actual deletion
router.get('/delete/x/:id', function(req, res, next) {
  // call the 'delete' method in the model, then show the list view
  PersonModel.delete(req.params.id, req.app.get('api path'), function () {
    res.redirect('/Person');
  });
});

// handle the URL /Person/1234 - this shows the details of an individual asset
router.get('/:id', function(req, res, next) {

  let Person;
  PersonModel.getById(req.params.id, req.app.get('api path'), function (Person) {
    res.render('Person-detail',
               { title: 'Person Detail',
                 Person: Person});
  });
});


module.exports = router;
