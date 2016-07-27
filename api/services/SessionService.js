'use strict';

var User = require('../model/User');
var config = require('../../config');
var crypto = require('crypto');
var VError = require('verror');
var jwt = require('jsonwebtoken');
var SessionService = {};

SessionService = {
  create: function create(email, password) {
    var md5;
    var userData;
    var token;

    return User.findOne({ email: email })
      .then(function _checkPassword(user) {
        md5 = crypto.createHash('md5');
        md5.update(password);

        if (user.password !== md5.digest('hex')) {
          throw new VError('Invalid password');
        }

        userData = {
          email: user.email,
          id: user.id,
          privilege: []
        };
        token = jwt.sign(userData, config.secret, {
          expiresIn: 1440 * 60 // expires in 24 hours
        });
        return token;
      })
      .catch(function _handleError(err) {
        throw new VError('Could not login user.', { error: err });
      });
  }
};

module.exports = SessionService;
