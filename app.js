'use strict';

var bunyan = require('bunyan');
var mongoose = require('mongoose');
var restify = require('restify');
var jwt = require('jsonwebtoken');
var _ = require('underscore');

var config = require('./config');
var UserController = require('./api/controllers/UserController');
var SessionController = require('./api/controllers/SessionController');

var server = restify.createServer({
  name: 'fusion'
});
var log = bunyan.createLogger({
  name: 'fusion',
  stream: process.stdout
});
var objectId = mongoose.Types.ObjectId;

mongoose.connect(config.database);

/** **************************
 * Initialize restify server *
 *****************************/
server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(restify.authorizationParser());
server.on('after', restify.auditLogger({
  log: log,
  body: true
}));

/** ***********************************************
 * Indicate unprotected restify server end-points *
 **************************************************/
server.post('/api/v1/users', UserController.register);
server.post('/api/v1/sessions', SessionController.create);

/** *********************
 * Set up authorization *
 ************************/
server.use(function _authValidation(req, res, next) {
  var token = req.params.token || req.headers.token;
  var decodedClone;

  if (token) {
    jwt.verify(token, config.secret, function _checkValidationResult(err, decoded) {
      if (err) {
        res.send(401, {
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        decodedClone = _.clone(decoded);
        // if everything is good, save to request for use in other routes
        decodedClone.id = objectId(decoded.id);
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.send(new restify.errors.ForbiddenError('no token'));
  }
});

/** *********************************************
 * Indicate protected restify server end-points *
 ************************************************/
server.get('/api/v1/users', UserController.find);

/** *************************
 * Start the restify server *
 ****************************/
server.listen(8080, function _callback() {
  console.log(server.name + ' on 8080');
});
