const jwt = require('jsonwebtoken'); 

module.exports = signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: 86400 // expires in 24 hours
  });
};