var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../auth');

/* GET secure route */
router.get('/secure',passport.authenticate('jwt', { session: false }), function(req, res, next) {
  res.send('access to secure route')
});

module.exports = router;
