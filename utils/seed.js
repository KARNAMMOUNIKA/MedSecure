const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const MedicalProfile = require('../models/MedicalProfile');
const ScanLog = require('../models/ScanLog');
const SecurityLog = require('../models/SecurityLog');
const { calculateRisk } = require('./riskCalculator');

dotenv.config({ path: '../.env' }); // Load from parent directory of utils

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medsecure';
    console.log(`Connecting to database at ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing database tables...');
    await User.deleteMany();
    await MedicalProfile.deleteMany();
    await ScanLog.deleteMany();
    await SecurityLog.deleteMany();

    console.log('Seeding database tables...');

    // 1. Create Admin Account
    const adminUser = await User.create({
      name: 'MedSecure Administrator',
      email: 'admin@medsecure.com',
      phone: '+1 (555) 010-0000',
      password: 'password123',
      role: 'admin',
      qrToken: 'admin-qr-not-used',
    });
    console.log('Created Admin: admin@medsecure.com');

    // 2. Create Moderate Risk Patient Account
    const patientUser = await User.create({
      name: 'Alexander Mercer',
      email: 'patient@medsecure.com',
      phone: '+1 (555) 019-2834',
      password: 'password123',
      role: 'user',
      qrToken: 'alexander-mercer-qr-token',
    });
    console.log('Created User: patient@medsecure.com');

    // Profile details for Alexander
    const alexProfileFields = {
      user: patientUser._id,
      dob: new Date('1988-08-14'),
      gender: 'Male',
      bloodGroup: 'O-',
      allergies: [
        { allergen: 'Penicillin', severity: 'severe', description: 'Causes severe anaphylaxis, hives, and difficulty breathing.' },
        { allergen: 'Peanuts', severity: 'moderate', description: 'Causes throat swelling and hives.' },
      ],
      chronicDiseases: [
        { disease: 'Type 2 Diabetes', severity: 'moderate', diagnosedYear: 2018 },
        { disease: 'Hypertension (High Blood Pressure)', severity: 'mild', diagnosedYear: 2020 },
      ],
      currentMedications: [
        { name: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily with meals' },
        { name: 'Lisinopril 10mg', dosage: '10mg', frequency: 'Once daily in the morning' },
      ],
      height: 180,
      weight: 78,
      organDonorStatus: 'Yes',
      emergencyContacts: [
        { name: 'Eleanor Mercer', relationship: 'Spouse', phone: '+1 (555) 019-2835' },
      ],
      doctorInfo: {
        name: 'Dr. Robert Vance',
        phone: '+1 (555) 014-9988',
        hospital: 'Mercy Medical Center',
      },
    };

    const alexRisk = calculateRisk(alexProfileFields);
    alexProfileFields.riskScore = alexRisk.riskScore;
    alexProfileFields.riskBreakdown = alexRisk.riskBreakdown;

    const alexProfile = await MedicalProfile.create(alexProfileFields);
    console.log(`Created Medical Profile for Alexander. Risk Score: ${alexProfile.riskScore}`);

    // 3. Create Critical Risk Patient Account
    const criticalUser = await User.create({
      name: 'Sarah Jenkins',
      email: 'critical@medsecure.com',
      phone: '+1 (555) 018-7711',
      password: 'password123',
      role: 'user',
      qrToken: 'sarah-jenkins-qr-token',
    });
    console.log('Created User: critical@medsecure.com');

    const sarahProfileFields = {
      user: criticalUser._id,
      dob: new Date('1965-03-22'),
      gender: 'Female',
      bloodGroup: 'AB+',
      allergies: [
        { allergen: 'Bee Venom', severity: 'severe', description: 'Anaphylaxis. Requires immediate EpiPen administration.' },
      ],
      chronicDiseases: [
        { disease: 'Congestive Heart Failure', severity: 'severe', diagnosedYear: 2015 },
        { disease: 'Severe Asthma', severity: 'severe', diagnosedYear: 2012 },
      ],
      currentMedications: [
        { name: 'Carvedilol 6.25mg', dosage: '6.25mg', frequency: 'Twice daily' },
        { name: 'Albuterol Inhaler', dosage: '90mcg', frequency: 'As needed for shortness of breath' },
        { name: 'Furosemide 40mg', dosage: '40mg', frequency: 'Once daily in the morning' },
      ],
      height: 165,
      weight: 62,
      organDonorStatus: 'Yes',
      emergencyContacts: [
        { name: 'David Jenkins', relationship: 'Son', phone: '+1 (555) 018-7712' },
      ],
      doctorInfo: {
        name: 'Dr. Evelyn Foster',
        phone: '+1 (555) 013-4477',
        hospital: 'Saint Jude General Hospital',
      },
    };

    const sarahRisk = calculateRisk(sarahProfileFields);
    sarahProfileFields.riskScore = sarahRisk.riskScore;
    sarahProfileFields.riskBreakdown = sarahRisk.riskBreakdown;

    const sarahProfile = await MedicalProfile.create(sarahProfileFields);
    console.log(`Created Medical Profile for Sarah. Risk Score: ${sarahProfile.riskScore}`);

    // 4. Create Scan Logs for Sarah Jenkins (to populate user scan history)
    const scanLogs = [
      {
        user: criticalUser._id,
        scanTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        ipAddress: '192.168.1.152',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
        location: 'Saint Jude General Hospital - ER Dept',
        riskLevelViewed: 'Critical',
      },
      {
        user: criticalUser._id,
        scanTime: new Date(Date.now() - 28 * 60 * 60 * 1000), // 28 hours ago
        ipAddress: '172.56.21.90',
        userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 Chrome/98.0.4758.101 Mobile Safari/537.36',
        location: 'Ambulance Services - Unit 14 (Mobile)',
        riskLevelViewed: 'Critical',
      },
      {
        user: patientUser._id,
        scanTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        ipAddress: '64.233.160.10',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/100.0.4896.75 Safari/537.36',
        location: 'Community Clinic - First Response Unit',
        riskLevelViewed: 'Moderate',
      },
    ];

    await ScanLog.insertMany(scanLogs);
    console.log('Inserted Scan Logs.');

    // 5. Create Security Logs
    const securityLogs = [
      {
        user: adminUser._id,
        action: 'LOGIN_SUCCESS',
        details: 'Admin panel accessed.',
        ipAddress: '127.0.0.1',
        userAgent: 'Console/Seeder',
      },
      {
        user: patientUser._id,
        action: 'LOGIN_SUCCESS',
        details: 'User logged in: patient@medsecure.com',
        ipAddress: '127.0.0.1',
        userAgent: 'Console/Seeder',
      },
      {
        user: criticalUser._id,
        action: 'PROFILE_UPDATE',
        details: 'Medical profile updated successfully',
        ipAddress: '127.0.0.1',
        userAgent: 'Console/Seeder',
      },
    ];

    await SecurityLog.insertMany(securityLogs);
    console.log('Inserted Security Logs.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
