const mongoose = require('mongoose');

const SecurityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    required: true,
    enum: ['LOGIN_SUCCESS', 'LOGIN_FAILURE', 'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_SUCCESS', 'PROFILE_UPDATE', 'ACCOUNT_SUSPENDED', 'ACCOUNT_UNSUSPENDED', 'ADMIN_ACCESS'],
  },
  details: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SecurityLog', SecurityLogSchema);
