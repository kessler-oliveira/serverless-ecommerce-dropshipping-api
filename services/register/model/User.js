const mongoose = require('mongoose');
const validator = require('validator');

const model = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    validate: {
      validator(name) {
        return validator.isAscii(name);
      },
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator(password) {
        return validator.isAscii(password);
      },
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  type: {
    type: String,
    required: true,
    validate: {
      validator(type) {
        const whiteList = new Set(["CLIENT", "EXTERNAL", "VENDOR", "ADMIN"])
        return whiteList.has(type)
      },
    },
  },
});

module.exports = model;
