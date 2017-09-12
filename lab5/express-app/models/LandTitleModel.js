'use strict';


const unirest = require('unirest');

// this module has the model functions relating to LandTitle

// include the Person model for enrichment
const PersonModel = require('../models/PersonModel');

// return all instances of LandTitle as an array
exports.getAll = function (apiPath, callback) {
  unirest.get(apiPath + '/api/LandTitle').end(function (response) {
    let LandTitleList = response.body;
    // sort by titleId
    LandTitleList.sort(function (a,b) {
      if(a.titleId < b.titleId) {return -1;}
      if(a.titleId > b.titleId) {return 1;}
      return 0;
    });

    // do any enrichment here

    // get the list of persons by calling the function in the 'person' model
    // add the owner names to the property list
    // in this case we have used first and last names
    let PersonList;
    PersonModel.getAll(apiPath, function (PersonList) {

      for (let x = 0; x < LandTitleList.length; x++) {
        let owner = PersonList.find(function (Person) {
          return ('resource:' + Person.$class + '#' + Person.personId == LandTitleList[x].owner)
        });
        if (owner != null) {
          LandTitleList[x].ownerName = owner.firstName + ' ' + owner.lastName;
        }
      }

      callback(LandTitleList);
    });
  });
}

// return the instance of LandTitle identified by 'id'
exports.getById = function (id, apiPath, callback) {
  unirest.get(apiPath + '/api/LandTitle/' + id).end(function (response) {
    let LandTitle = response.body;

    // do any enrichment here

    // get the list of persons by calling the function in the 'person' model
    // add the owner names to the property list
    // in this case we have used first and last names
    let PersonList;
    PersonModel.getAll(apiPath, function (PersonList) {

      let owner = PersonList.find(function (Person) {
        return ('resource:' + Person.$class + '#' + Person.personId == LandTitle.owner)
      });
      if (owner != null) {
        LandTitle.ownerName = owner.firstName + ' ' + owner.lastName;
      }

      callback(LandTitle);
    });
  });
}

// create a new LandTitle from a prototype
// NB a prototype is a LandTitle but without the class & id fields
// rewrite the random ID generator with your own method if required
exports.create = function (LandTitle, apiPath, callback) {
  // input variables for relations can be short (e.g. ID:1234) or fully qualified
  // if short, expand them here

  if (!LandTitle.owner.includes("#")) {
    LandTitle.owner = "resource:net.biz.digitalPropertyNetwork.Person#" + LandTitle.owner;
  }


  // add the class and id to the LandTitle
  LandTitle.$class = "net.biz.digitalPropertyNetwork.LandTitle";
  LandTitle.titleId = "ID:" + Math.trunc(Math.random() * 10000);

  // call the 'POST' API
  unirest.post(apiPath + '/api/LandTitle')
    .headers({'Accept': 'application/json', 'Content-type': 'application/json'})
    .send(LandTitle)
    .end(function (response) {
      console.log(response.body);
      callback();
    });

}

// update an existing LandTitle with new data
// NB you can't change the id field
exports.update = function (LandTitle, apiPath, callback) {
  // add the class to the LandTitle
  LandTitle.$class = "net.biz.digitalPropertyNetwork.LandTitle";

  // call the 'PUT' API
  unirest.put(apiPath + '/api/LandTitle/' + LandTitle.titleId)
    .headers({'Accept': 'application/json', 'Content-type': 'application/json'})
    .send(LandTitle)
    .end(function (response) {
      console.log(response.body);
      callback();
    });

}

// delete a LandTitle
exports.delete = function (id, apiPath, callback) {
  // call the 'DELETE' API
  unirest.delete(apiPath + '/api/LandTitle/' + id).end(function (response) {
      console.log(response.body);
      callback();
    });

}
