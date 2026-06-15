import React, { useState, useEffect } from 'react';
import { useAuth, API_URL } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, ShieldAlert, Heart, Phone, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const MedicalProfilePage = () => {
  const { token } = useAuth();
  
  // Tabs: 'personal' | 'medical' | 'medications' | 'contacts'
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Profile fields
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Prefer not to say');
  const [bloodGroup, setBloodGroup] = useState('Unknown');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [organDonorStatus, setOrganDonorStatus] = useState('Undecided');
  
  const [allergies, setAllergies] = useState([]);
  const [newAllergen, setNewAllergen] = useState('');
  const [newAllergenSeverity, setNewAllergenSeverity] = useState('mild');
  const [newAllergenDesc, setNewAllergenDesc] = useState('');

  const [chronicDiseases, setChronicDiseases] = useState([]);
  const [newDisease, setNewDisease] = useState('');
  const [newDiseaseSeverity, setNewDiseaseSeverity] = useState('mild');
  const [newDiseaseYear, setNewDiseaseYear] = useState('');

  const [currentMedications, setCurrentMedications] = useState([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');

  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRel, setNewContactRel] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  const [doctorName, setDoctorName] = useState('');
  const [doctorPhone, setDoctorPhone] = useState('');
  const [doctorHospital, setDoctorHospital] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.profile) {
          const p = data.profile;
          setDob(p.dob ? new Date(p.dob).toISOString().split('T')[0] : '');
          setGender(p.gender || 'Prefer not to say');
          setBloodGroup(p.bloodGroup || 'Unknown');
          setHeight(p.height || '');
          setWeight(p.weight || '');
          setOrganDonorStatus(p.organDonorStatus || 'Undecided');
          setAllergies(p.allergies || []);
          setChronicDiseases(p.chronicDiseases || []);
          setCurrentMedications(p.currentMedications || []);
          setEmergencyContacts(p.emergencyContacts || []);
          setDoctorName(p.doctorInfo?.name || '');
          setDoctorPhone(p.doctorInfo?.phone || '');
          setDoctorHospital(p.doctorInfo?.hospital || '');
        }
      } catch (err) {
        console.error(err);
        setErrorMsg('Failed to decrypt and load medical profile.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  // Allergies handlers
  const addAllergy = () => {
    if (!newAllergen) return;
    setAllergies([...allergies, { allergen: newAllergen, severity: newAllergenSeverity, description: newAllergenDesc }]);
    setNewAllergen('');
    setNewAllergenDesc('');
  };
  const removeAllergy = (index) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };

  // Chronic Diseases handlers
  const addDisease = () => {
    if (!newDisease) return;
    setChronicDiseases([...chronicDiseases, { disease: newDisease, severity: newDiseaseSeverity, diagnosedYear: newDiseaseYear ? parseInt(newDiseaseYear) : undefined }]);
    setNewDisease('');
    setNewDiseaseYear('');
  };
  const removeDisease = (index) => {
    setChronicDiseases(chronicDiseases.filter((_, i) => i !== index));
  };

  // Medications handlers
  const addMedication = () => {
    if (!newMedName) return;
    setCurrentMedications([...currentMedications, { name: newMedName, dosage: newMedDosage, frequency: newMedFreq }]);
    setNewMedName('');
    setNewMedDosage('');
    setNewMedFreq('');
  };
  const removeMedication = (index) => {
    setCurrentMedications(currentMedications.filter((_, i) => i !== index));
  };

  // Contacts handlers
  const addContact = () => {
    if (!newContactName || !newContactPhone) return;
    setEmergencyContacts([...emergencyContacts, { name: newContactName, relationship: newContactRel, phone: newContactPhone }]);
    setNewContactName('');
    setNewContactRel('');
    setNewContactPhone('');
  };
  const removeContact = (index) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!dob || dob === '') {
      setErrorMsg('Please specify Date of Birth.');
      setActiveTab('personal');
      return;
    }

    if (emergencyContacts.length === 0) {
      setErrorMsg('Please add at least one emergency contact under the Contacts tab.');
      setActiveTab('contacts');
      return;
    }

    setSaveLoading(true);

    try {
      const payload = {
        dob,
        gender,
        bloodGroup,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        organDonorStatus,
        allergies,
        chronicDiseases,
        currentMedications,
        emergencyContacts,
        doctorInfo: {
          name: doctorName,
          phone: doctorPhone,
          hospital: doctorHospital,
        },
      };

      const res = await fetch(`${API_URL}/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error saving medical profile');
      }

      setSuccessMsg(`Medical Profile updated successfully! Severity risk recalculated: ${data.profile.riskScore}`);
      window.scrollTo(0, 0);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#0ea5e9', fontWeight: 'bold' }}>
          Loading Medical Profile Forms...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar />
      
      <div className="container" style={styles.container}>
        <div style={styles.header}>
          <h1 className="title-gradient" style={{ fontSize: '2rem' }}>Configure Medical Identity</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Maintain an accurate record. Save changes to dynamically re-evaluate severity status.
          </p>
        </div>

        {errorMsg && (
          <div style={styles.errorAlert}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={styles.successAlert}>
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} style={styles.formContainer}>
          {/* Tab Navigation Headers */}
          <div className="tabs-header">
            <button type="button" className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`} onClick={() => setActiveTab('personal')}>
              <User size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Personal Details
            </button>
            <button type="button" className={`tab-btn ${activeTab === 'medical' ? 'active' : ''}`} onClick={() => setActiveTab('medical')}>
              <ShieldAlert size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Allergies & Diseases
            </button>
            <button type="button" className={`tab-btn ${activeTab === 'medications' ? 'active' : ''}`} onClick={() => setActiveTab('medications')}>
              <Heart size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Medications
            </button>
            <button type="button" className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`} onClick={() => setActiveTab('contacts')}>
              <Phone size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> Emergency Contacts
            </button>
          </div>

          {/* TAB 1: Personal Details */}
          {activeTab === 'personal' && (
            <div className="glass-card animate-fade-in" style={styles.tabContentCard}>
              <h3 style={styles.tabTitle}>Personal Identifiers</h3>
              <div style={styles.inputsGrid}>
                <div className="form-group">
                  <label className="form-label">Date of Birth *</label>
                  <input type="date" className="form-input" required value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <select className="form-select" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Blood Group *</label>
                  <select className="form-select" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                    <option value="Unknown">Unknown</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Height (cm)</label>
                  <input type="number" className="form-input" placeholder="e.g. 175" value={height} onChange={(e) => setHeight(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input type="number" className="form-input" placeholder="e.g. 70" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Organ Donor Status</label>
                  <select className="form-select" value={organDonorStatus} onChange={(e) => setOrganDonorStatus(e.target.value)}>
                    <option value="Undecided">Undecided</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Allergies & Diseases */}
          {activeTab === 'medical' && (
            <div className="glass-card animate-fade-in" style={styles.tabContentCard}>
              {/* Allergies Block */}
              <h3 style={styles.tabTitle}>Severe Allergies</h3>
              <p style={styles.tabSubtitle}>List allergens that cause anaphylaxis or moderate reactions</p>
              
              <div style={styles.nestedAdder}>
                <input type="text" className="form-input" placeholder="Allergen (e.g. Penicillin, Peanuts)" value={newAllergen} onChange={(e) => setNewAllergen(e.target.value)} style={{ flex: '2 1 200px' }} />
                <select className="form-select" value={newAllergenSeverity} onChange={(e) => setNewAllergenSeverity(e.target.value)} style={{ flex: '1 1 100px' }}>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
                <input type="text" className="form-input" placeholder="Reaction details (optional)" value={newAllergenDesc} onChange={(e) => setNewAllergenDesc(e.target.value)} style={{ flex: '2 1 200px' }} />
                <button type="button" onClick={addAllergy} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}><Plus size={18} /></button>
              </div>

              {allergies.length > 0 && (
                <div style={styles.badgeWrapper}>
                  {allergies.map((a, idx) => (
                    <div key={idx} style={styles.arrayItemBadge}>
                      <span style={{ fontWeight: 'bold' }}>{a.allergen}</span>
                      <span className={`badge badge-${a.severity}`} style={{ fontSize: '0.65rem', margin: '0 0.5rem' }}>{a.severity}</span>
                      {a.description && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>({a.description})</span>}
                      <Trash2 size={14} color="#ef4444" onClick={() => removeAllergy(idx)} style={{ cursor: 'pointer', marginLeft: 'auto' }} />
                    </div>
                  ))}
                </div>
              )}

              <hr style={styles.divider} />

              {/* Chronic Diseases Block */}
              <h3 style={styles.tabTitle}>Chronic Conditions</h3>
              <p style={styles.tabSubtitle}>List diagnosed medical diseases (e.g. Asthma, Congestive Heart Failure, Diabetes)</p>

              <div style={styles.nestedAdder}>
                <input type="text" className="form-input" placeholder="Disease Name" value={newDisease} onChange={(e) => setNewDisease(e.target.value)} style={{ flex: '2 1 200px' }} />
                <select className="form-select" value={newDiseaseSeverity} onChange={(e) => setNewDiseaseSeverity(e.target.value)} style={{ flex: '1 1 100px' }}>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
                <input type="number" className="form-input" placeholder="Diagnosis Year" value={newDiseaseYear} onChange={(e) => setNewDiseaseYear(e.target.value)} style={{ flex: '1 1 100px' }} />
                <button type="button" onClick={addDisease} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}><Plus size={18} /></button>
              </div>

              {chronicDiseases.length > 0 && (
                <div style={styles.badgeWrapper}>
                  {chronicDiseases.map((d, idx) => (
                    <div key={idx} style={styles.arrayItemBadge}>
                      <span style={{ fontWeight: 'bold' }}>{d.disease}</span>
                      <span className={`badge badge-${d.severity}`} style={{ fontSize: '0.65rem', margin: '0 0.5rem' }}>{d.severity}</span>
                      {d.diagnosedYear && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Since {d.diagnosedYear}</span>}
                      <Trash2 size={14} color="#ef4444" onClick={() => removeDisease(idx)} style={{ cursor: 'pointer', marginLeft: 'auto' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Medications */}
          {activeTab === 'medications' && (
            <div className="glass-card animate-fade-in" style={styles.tabContentCard}>
              <h3 style={styles.tabTitle}>Current Medications</h3>
              <p style={styles.tabSubtitle}>List active pharmaceutical treatments responders should be aware of</p>

              <div style={styles.nestedAdder}>
                <input type="text" className="form-input" placeholder="Medication Name (e.g. Metformin)" value={newMedName} onChange={(e) => setNewMedName(e.target.value)} style={{ flex: '2 1 200px' }} />
                <input type="text" className="form-input" placeholder="Dosage (e.g. 500mg)" value={newMedDosage} onChange={(e) => setNewMedDosage(e.target.value)} style={{ flex: '1 1 100px' }} />
                <input type="text" className="form-input" placeholder="Frequency (e.g. Twice daily)" value={newMedFreq} onChange={(e) => setNewMedFreq(e.target.value)} style={{ flex: '2 1 150px' }} />
                <button type="button" onClick={addMedication} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}><Plus size={18} /></button>
              </div>

              {currentMedications.length > 0 && (
                <div style={styles.badgeWrapper}>
                  {currentMedications.map((m, idx) => (
                    <div key={idx} style={styles.arrayItemBadge}>
                      <span style={{ fontWeight: 'bold' }}>{m.name}</span>
                      {m.dosage && <span style={{ fontSize: '0.85rem', color: '#fff', marginLeft: '0.5rem' }}>{m.dosage}</span>}
                      {m.frequency && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>({m.frequency})</span>}
                      <Trash2 size={14} color="#ef4444" onClick={() => removeMedication(idx)} style={{ cursor: 'pointer', marginLeft: 'auto' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Emergency Contacts & Doctor */}
          {activeTab === 'contacts' && (
            <div className="glass-card animate-fade-in" style={styles.tabContentCard}>
              <h3 style={styles.tabTitle}>Emergency Contacts *</h3>
              <p style={styles.tabSubtitle}>Designate individuals to alert in a medical dispatch (Add at least 1)</p>

              <div style={styles.nestedAdder}>
                <input type="text" className="form-input" placeholder="Contact Name" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} style={{ flex: '2 1 200px' }} />
                <input type="text" className="form-input" placeholder="Relationship (e.g. Spouse)" value={newContactRel} onChange={(e) => setNewContactRel(e.target.value)} style={{ flex: '1 1 120px' }} />
                <input type="tel" className="form-input" placeholder="Phone Number" value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} style={{ flex: '2 1 180px' }} />
                <button type="button" onClick={addContact} className="btn btn-secondary" style={{ padding: '0.75rem 1.25rem' }}><Plus size={18} /></button>
              </div>

              {emergencyContacts.length > 0 && (
                <div style={styles.badgeWrapper}>
                  {emergencyContacts.map((c, idx) => (
                    <div key={idx} style={styles.arrayItemBadge}>
                      <span style={{ fontWeight: 'bold' }}>{c.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0.5rem' }}>({c.relationship})</span>
                      <span style={{ color: 'var(--color-primary)', fontWeight: '500' }}>{c.phone}</span>
                      <Trash2 size={14} color="#ef4444" onClick={() => removeContact(idx)} style={{ cursor: 'pointer', marginLeft: 'auto' }} />
                    </div>
                  ))}
                </div>
              )}

              <hr style={styles.divider} />

              <h3 style={styles.tabTitle}>Primary Physician / Doctor</h3>
              <p style={styles.tabSubtitle}>Add doctor details for hospital communication</p>
              
              <div style={styles.inputsGrid}>
                <div className="form-group">
                  <label className="form-label">Doctor's Name</label>
                  <input type="text" className="form-input" placeholder="Dr. Jane Smith" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Physician Phone</label>
                  <input type="tel" className="form-input" placeholder="+1 (555) 000-0000" value={doctorPhone} onChange={(e) => setDoctorPhone(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hospital Affiliation</label>
                  <input type="text" className="form-input" placeholder="City General Hospital" value={doctorHospital} onChange={(e) => setDoctorHospital(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div style={styles.formActions}>
            <button type="submit" className="btn btn-primary" style={{ padding: '1rem 3rem' }} disabled={saveLoading}>
              {saveLoading ? 'Encrypting & Transmitting...' : 'Save & Encrypt Profile'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#0a0f1d',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: '#0a0f1d',
  },
  container: {
    padding: '3rem 2rem',
    maxWidth: '960px',
  },
  header: {
    marginBottom: '2.5rem',
  },
  errorAlert: {
    background: 'var(--color-danger-glow)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: 'var(--color-danger)',
    padding: '0.85rem 1.2rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
  },
  successAlert: {
    background: 'var(--color-success-glow)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--color-success)',
    padding: '0.85rem 1.2rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  tabContentCard: {
    padding: '2.5rem',
    minHeight: '400px',
  },
  tabTitle: {
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  tabSubtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.88rem',
    marginBottom: '1.5rem',
  },
  inputsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  nestedAdder: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    padding: '1rem',
    borderRadius: '8px',
  },
  badgeWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1rem',
  },
  arrayItemBadge: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    margin: '2rem 0',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '2rem',
  },
};

export default MedicalProfilePage;
