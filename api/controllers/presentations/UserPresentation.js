'use strict';

var UserPresentation = module.exports = {};

UserPresentation.present = function present(userData) {
  return {
    id: userData.id,
    email: userData.email
  };
};
