var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  local          : {
    email        : String,
    password     : String,
  },
  twitter        : {
    id           : String
  }
});

module.exports = mongoose.model('User', userSchema);