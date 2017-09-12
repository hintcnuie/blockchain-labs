'use strict';


const unirest = require('unirest');

// this module has the model functions relating to user transactions


exports.RegisterPropertyForSale = function (trx, apiPath, callback) {
  // input variables for relations can be short (e.g. ID:1234) or fully qualified
  // if short, expand them here
  
  if (!trx.seller.includes("#")) {
    trx.seller = "resource:net.biz.digitalPropertyNetwork.Person#" + trx.seller;
  }
  
  if (!trx.title.includes("#")) {
    trx.title = "resource:net.biz.digitalPropertyNetwork.LandTitle#" + trx.title;
  }
  

  // add the class and timestamp to the transaction
  // the transaction ID is assigned by the system
  trx.$class = "net.biz.digitalPropertyNetwork.RegisterPropertyForSale";
  trx.timestamp = new Date().toISOString();

  unirest.post(apiPath + '/api/RegisterPropertyForSale/')
    .headers({'Accept': 'application/json', 'Content-type': 'application/json'})
    .send(trx)
    .end(function (response) {
      console.log(response.body);
      callback();
    });
}

