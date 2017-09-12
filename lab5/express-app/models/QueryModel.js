'use strict';


const unirest = require('unirest');

// this module has the model functions relating to queries
// modify each query function to properly handle the content of the query
// rename the file to prevent subsequent generator runs from over-writing
// see the README.md file for details on how to use queries


// return data from query Q1
// Description: select Person by last name
// SELECT net.biz.digitalPropertyNetwork.Person
//      WHERE (lastName == _$nameParam)
//
exports.Q1 = function (nameParam, apiPath, callback) {
  unirest.get(apiPath + '/api/queries/Q1?nameParam=' + nameParam).end(function (response) {
    let ResultList = response.body;
    // do any enrichment here
    callback(ResultList);
  });
}
