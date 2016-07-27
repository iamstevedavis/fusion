'use strict';

var validator = require('validator');
var restify = require('restify');

var UserService = require('../services/UserService');
var UserPresentation = require('./presentations/UserPresentation');

module.exports = {
  find: function find(req, res, next) {
    return UserService.find(req.query.email)
      .then(UserPresentation.present)
      .then(function _success(presentedUser) {
        res.send(200, presentedUser);
        return next();
      })
      .catch(function _handleError(err) {
        res.send(500, err);
        return next();
      });
  },

  register: function register(req, res, next) {
    if (!req.params.email || !req.params.password) {
      return next(new restify.InvalidArgumentError('email or password can not be null'));
    }
    if (!validator.isEmail(req.params.email)) {
      return next(new restify.InvalidArgumentError('error email address'));
    }

    return UserService.register(req.params)
      .then(function _success(user) {
        res.send(200, UserPresentation.present(user));
        return next();
      })
      .catch(function _handleError(err) {
        res.send(500, err);
        return next();
      });
  }
};
