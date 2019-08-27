const connectToDatabase = require('../../libs/db');
const signToken = require('../../libs/jwt');
const User = require('./model/User');
const errorResponse = require('../../libs/util').errorResponse
const sucessResponse = require('../../libs/util').sucessResponse
const validator = require('validator');

module.exports.handler = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() => remove(event.pathParameters.id))
    .then(session => sucessResponse(session))
    .catch(err => errorResponse(err.statusCode, err.message));
};

function remove(id) {
  return User.findOne({ _id: id })
    .then(user =>
      user
        ? user.remove()
        : Promise.reject(new Error('Incorrect id')));
}
