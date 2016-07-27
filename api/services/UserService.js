'use strict';

var User = require('../model/User');
var crypto = require('crypto');
var VError = require('verror');
var UserService = {};

UserService = {
  find: function find(email) {
    return User.findOne({ email: email })
      .then(function _verifyUser(user) {
        if (!user) {
          throw new VError('Could not find user.');
        }
        return user;
      })
      .catch(function _error(err) {
        throw new VError('Could not find user.', { error: err });
      });
  },

  register: function register(userData) {
    var md5 = crypto.createHash('md5');
    var user = new User({
      email: userData.email
    });
    md5.update(userData.password);
    user.password = md5.digest('hex');

    return user.save()
      .catch(function _error(err) {
        throw new VError('Could not create user.', { error: err });
      });
  }
};

module.exports = UserService;
