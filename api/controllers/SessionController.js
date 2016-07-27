'use strict';

var validator = require('validator');
var restify = require('restify');

var SessionService = require('../services/SessionService');

module.exports = {
  create: function create(req, res, next) {
    var email = req.params.email;
    var password = req.params.password;

    if (!email || !password) {
      return next(new restify.InvalidArgumentError('email or password can not be null'));
    }
    if (!validator.isEmail(email)) {
      return next(new restify.InvalidArgumentError('error email address'));
    }

    return SessionService.create(email, password)
      .then(function _success(token) {
        res.send(200, {
          token: token
        });
      });
  }
};
