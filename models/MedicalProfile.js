const mongoose = require('mongoose');

const MedicalProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    dob: {
      type: Date,
      required: [true, 'Please add Date of Birth'],
    },
    gender: {
      type: String,
      required: [true, 'Please add Gender'],
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    },
    bloodGroup: {
      type: String,
      required: [true, 'Please add Blood Group'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    },
    allergies: [
      {
        allergen: { type: String, required: true },
        severity: { type: String, enum: ['mild', 'moderate', 'severe'], required: true },
        description: { type: String },
      },
    ],
    chronicDiseases: [
      {
        disease: { type: String, required: true },
        severity: { type: String, enum: ['mild', 'moderate', 'severe'], required: true },
        diagnosedYear: { type: Number },
      },
    ],
    currentMedications: [
      {
        name: { type: String, required: true },
        dosage: { type: String }, // e.g. 500mg
        frequency: { type: String }, // e.g. Twice a day
      },
    ],
    height: {
      type: Number, // in cm
    },
    weight: {
      type: Number, // in kg
    },
    organDonorStatus: {
      type: String,
      enum: ['Yes', 'No', 'Undecided'],
      default: 'Undecided',
    },
    emergencyContacts: [
      {
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        phone: { type: String, required: true },
      },
    ],
    doctorInfo: {
      name: { type: String },
      phone: { type: String },
      hospital: { type: String },
    },
    riskScore: {
      type: String,
      enum: ['Normal', 'Moderate', 'High', 'Critical'],
      default: 'Normal',
    },
    riskBreakdown: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MedicalProfile', MedicalProfileSchema);
