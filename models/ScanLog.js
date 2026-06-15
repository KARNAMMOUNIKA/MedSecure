const mongoose = require('mongoose');

const ScanLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scanTime: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: 'Unknown Location',
  },
  riskLevelViewed: {
    type: String,
    enum: ['Normal', 'Moderate', 'High', 'Critical'],
    required: true,
  },
});

module.exports = mongoose.model('ScanLog', ScanLogSchema);
