const connectToDatabase = require('../../libs/db');
const User = require('../user/User');

module.exports.handler = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      me(event.requestContext.authorizer.principalId) // the decoded.id from the VerifyToken.auth will be passed along as the principalId under the authorizer
    )
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => {
      console.log(err)
      return {
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: { stack: err.stack, message: err.message }
      }
    });
};

function me(userId) {
  return User.findById(userId, { password: 0 })
    .then(user =>
      !user
        ? Promise.reject('No user found.')
        : user
    )
    .catch(err => Promise.reject(new Error(err)));
}
