'use strict';


const unirest = require('unirest');

// this module has the model functions relating to Person

// return all instances of Person as an array
exports.getAll = function (apiPath, callback) {
  unirest.get(apiPath + '/api/Person').end(function (response) {
    let PersonList = response.body;
    // sort by personId
    PersonList.sort(function (a,b) {
      if(a.personId < b.personId) {return -1;}
      if(a.personId > b.personId) {return 1;}
      return 0;
    });
    // do any enrichment here
    callback(PersonList);
  });
}

// return the instance of Person identified by 'id'
exports.getById = function (id, apiPath, callback) {
  unirest.get(apiPath + '/api/Person/' + id).end(function (response) {
    let Person = response.body;
    // do any enrichment here
    callback(Person);
  });
}

// create a new Person from a prototype
// NB a prototype is a Person but without the class & id fields
// rewrite the random ID generator with your own method if required
exports.create = function (Person, apiPath, callback) {
  // input variables for relations can be short (e.g. ID:1234) or fully qualified
  // if short, expand them here
  

  // add the class and id to the Person
  Person.$class = "net.biz.digitalPropertyNetwork.Person";
  Person.personId = "ID:" + Math.trunc(Math.random() * 10000);

  // call the 'POST' API
  unirest.post(apiPath + '/api/Person')
    .headers({'Accept': 'application/json', 'Content-type': 'application/json'})
    .send(Person)
    .end(function (response) {
      console.log(response.body);
      callback();
    });

}

// update an existing Person with new data
// NB you can't change the id field
exports.update = function (Person, apiPath, callback) {
  // add the class to the Person
  Person.$class = "net.biz.digitalPropertyNetwork.Person";

  // call the 'PUT' API
  unirest.put(apiPath + '/api/Person/' + Person.personId)
    .headers({'Accept': 'application/json', 'Content-type': 'application/json'})
    .send(Person)
    .end(function (response) {
      console.log(response.body);
      callback();
    });

}

// delete a Person
exports.delete = function (id, apiPath, callback) {
  // call the 'DELETE' API
  unirest.delete(apiPath + '/api/Person/' + id).end(function (response) {
      console.log(response.body);
      callback();
    });

}
