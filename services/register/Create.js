const connectToDatabase = require('../../libs/db');
const signToken = require('../../libs/jwt');
const User = require('./model/User');
const bcrypt = require('bcryptjs-then');
const errorResponse = require('../../libs/util').errorResponse
const sucessResponse = require('../../libs/util').sucessResponse

module.exports.handler = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() => create(JSON.parse(event.body)))
    .then(session => sucessResponse(session))
    .catch(err => errorResponse(err.statusCode, err.message));
};

function create(eventBody) {
  return User.findOne({ email: eventBody.email })
    .then(user =>
      user
        ? Promise.reject(new Error('User with that email exists.'))
        : bcrypt.hash(eventBody.password, 8))
    .then(hash =>
      User.create({ name: eventBody.name, email: eventBody.email, password: hash, type: eventBody.type }))
    .then(user => ({ auth: true, token: signToken(user._id) })); 
}
