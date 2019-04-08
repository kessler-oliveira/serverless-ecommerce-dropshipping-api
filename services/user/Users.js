const connectToDatabase = require('../../libs/db');
const User = require('./User');

module.exports.get = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(getUsers)
    .then(users => ({
      statusCode: 200,
      body: JSON.stringify(users)
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

 function getUsers() {
  return User.find({})
    .then(users => users)
    .catch(err => Promise.reject(new Error(err)));
}