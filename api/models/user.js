var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  local          : {
    name         : String,
    email        : String,
    password     : String,
  },
  twitter        : {
    id           : String
  }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.getName = function() {
  return this.local.name ? this.local.name : this.local.email;
}


module.exports = mongoose.model('User', userSchema);