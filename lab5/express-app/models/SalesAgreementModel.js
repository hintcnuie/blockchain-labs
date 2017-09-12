'use strict';


const unirest = require('unirest');

// this module has the model functions relating to SalesAgreement

// return all instances of SalesAgreement as an array
exports.getAll = function (apiPath, callback) {
  unirest.get(apiPath + '/api/SalesAgreement').end(function (response) {
    let SalesAgreementList = response.body;
    // sort by salesId
    SalesAgreementList.sort(function (a,b) {
      if(a.salesId < b.salesId) {return -1;}
      if(a.salesId > b.salesId) {return 1;}
      return 0;
    });
    // do any enrichment here
    callback(SalesAgreementList);
  });
}

// return the instance of SalesAgreement identified by 'id'
exports.getById = function (id, apiPath, callback) {
  unirest.get(apiPath + '/api/SalesAgreement/' + id).end(function (response) {
    let SalesAgreement = response.body;
    // do any enrichment here
    callback(SalesAgreement);
  });
}

// create a new SalesAgreement from a prototype
// NB a prototype is a SalesAgreement but without the class & id fields
// rewrite the random ID generator with your own method if required
exports.create = function (SalesAgreement, apiPath, callback) {
  // input variables for relations can be short (e.g. ID:1234) or fully qualified
  // if short, expand them here
  
  if (!SalesAgreement.buyer.includes("#")) {
    SalesAgreement.buyer = "resource:net.biz.digitalPropertyNetwork.Person#" + SalesAgreement.buyer;
  }
  
  if (!SalesAgreement.seller.includes("#")) {
    SalesAgreement.seller = "resource:net.biz.digitalPropertyNetwork.Person#" + SalesAgreement.seller;
  }
  
  if (!SalesAgreement.title.includes("#")) {
    SalesAgreement.title = "resource:net.biz.digitalPropertyNetwork.LandTitle#" + SalesAgreement.title;
  }
  

  // add the class and id to the SalesAgreement
  SalesAgreement.$class = "net.biz.digitalPropertyNetwork.SalesAgreement";
  SalesAgreement.salesId = "ID:" + Math.trunc(Math.random() * 10000);

  // call the 'POST' API
  unirest.post(apiPath + '/api/SalesAgreement')
    .headers({'Accept': 'application/json', 'Content-type': 'application/json'})
    .send(SalesAgreement)
    .end(function (response) {
      console.log(response.body);
      callback();
    });

}

// update an existing SalesAgreement with new data
// NB you can't change the id field
exports.update = function (SalesAgreement, apiPath, callback) {
  // add the class to the SalesAgreement
  SalesAgreement.$class = "net.biz.digitalPropertyNetwork.SalesAgreement";

  // call the 'PUT' API
  unirest.put(apiPath + '/api/SalesAgreement/' + SalesAgreement.salesId)
    .headers({'Accept': 'application/json', 'Content-type': 'application/json'})
    .send(SalesAgreement)
    .end(function (response) {
      console.log(response.body);
      callback();
    });

}

// delete a SalesAgreement
exports.delete = function (id, apiPath, callback) {
  // call the 'DELETE' API
  unirest.delete(apiPath + '/api/SalesAgreement/' + id).end(function (response) {
      console.log(response.body);
      callback();
    });

}
