var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'digital-property@1.0.0',
    description: 'Hyperledger Composer Express project'
  });
});

module.exports = router;
