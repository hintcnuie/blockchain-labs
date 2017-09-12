'use strict';


const unirest = require('unirest');

// this module has the model functions relating to system transactions

// return all transactions as an array
exports.getAll = function (apiPath, callback) {
  unirest.get(apiPath + '/api/system/transactions').end(function (response) {
    let TrxList = response.body;
    // sort by timestamp, most recent first
    TrxList.sort(function (a,b) {
      if(a.timestamp < b.timestamp) {return 1;}
      if(a.timestamp > b.timestamp) {return -1;}
      return 0;
    });
    // do any enrichment here
    for (let x = 0; x < TrxList.length; x++) {
      enrich(TrxList[x]);
    }

    callback(TrxList);
  });
}

// return the transaction identified by 'id'
exports.getById = function (id, apiPath, callback) {
  unirest.get(apiPath + '/api/system/transactions/' + id).end(function (response) {
    let Trx = response.body;
    // do any enrichment here
    enrich(Trx);

    callback(Trx);
  });
}

// add some display variables
function enrich(t) {
  // type is $class without the namespace qualifier
  var a1 = t.$class.split(".");
  t.type = a1[a1.length - 1];
  // registry is registryId without the namespace qualifier
  if ('registryId' in t) {
    var a2 = t.registryId.split(".");
    t.registry = a2[a2.length - 1];
  }
}
