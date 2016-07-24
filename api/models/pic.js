var mongoose = require('mongoose');

var picSchema = mongoose.Schema({
  url : String,
  owner : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Pic', picSchema);