var mongoose = require('mongoose');

var UserSchema   = new mongoose.Schema({
  name: String,
  email: String,
  pendingTasks: [String],
  dateCreated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
