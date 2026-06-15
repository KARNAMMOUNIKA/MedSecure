/**
 * Calculates medical risk score and returns reasons
 * @param {Object} profile - Medical profile details
 * @returns {Object} { riskScore: String, riskBreakdown: Array<String> }
 */
function calculateRisk(profile) {
  const breakdown = [];
  let score = 'Normal';

  const allergies = profile.allergies || [];
  const chronicDiseases = profile.chronicDiseases || [];
  const medications = profile.currentMedications || [];

  // Helper flags
  let hasSevereAllergy = false;
  let severeAllergen = '';
  let hasHeartDisease = false;
  let heartDiseaseSeverity = '';
  let hasAsthma = false;
  let asthmaSeverity = '';
  let hasDiabetes = false;
  let diabetesSeverity = '';
  let hasBPIssues = false;
  let bpSeverity = '';
  
  let moderateOrSevereCount = 0;
  let severeCount = 0;

  // Evaluate allergies
  allergies.forEach(a => {
    if (a.severity === 'severe') {
      hasSevereAllergy = true;
      severeAllergen = a.allergen;
    }
  });

  // Evaluate chronic diseases
  chronicDiseases.forEach(d => {
    const name = d.disease.toLowerCase();
    const severity = d.severity;

    if (severity === 'severe' || severity === 'moderate') {
      moderateOrSevereCount++;
      if (severity === 'severe') severeCount++;
    }

    if (name.includes('heart') || name.includes('cardiac') || name.includes('cardiovascular') || name.includes('coronary')) {
      hasHeartDisease = true;
      heartDiseaseSeverity = severity;
    } else if (name.includes('asthma') || name.includes('copd') || name.includes('respiratory') || name.includes('lung')) {
      hasAsthma = true;
      asthmaSeverity = severity;
    } else if (name.includes('diabetes') || name.includes('diabetic')) {
      hasDiabetes = true;
      diabetesSeverity = severity;
    } else if (name.includes('bp') || name.includes('blood pressure') || name.includes('hypertension')) {
      hasBPIssues = true;
      bpSeverity = severity;
    }
  });

  const medsCount = medications.length;
  const chronicCount = chronicDiseases.length;

  // CRITICAL CONDITIONS
  if (hasSevereAllergy && (hasHeartDisease || hasAsthma || hasBPIssues)) {
    score = 'Critical';
    breakdown.push(`Critical combination: Severe allergy (${severeAllergen}) combined with cardiovascular or respiratory conditions.`);
  } else if (hasHeartDisease && hasDiabetes && (heartDiseaseSeverity === 'severe' || diabetesSeverity === 'severe' || heartDiseaseSeverity === 'moderate')) {
    score = 'Critical';
    breakdown.push('Critical combination: High-severity Heart disease combined with Diabetes.');
  } else if (heartDiseaseSeverity === 'severe') {
    score = 'Critical';
    breakdown.push('Critical Risk: Severe cardiovascular disease reported.');
  } else if (severeCount >= 2) {
    score = 'Critical';
    breakdown.push(`Critical Risk: Multiple (${severeCount}) severe chronic conditions diagnosed.`);
  } else if (chronicCount >= 3 && medsCount >= 4) {
    score = 'Critical';
    breakdown.push(`Critical Risk: High medical complexity (${chronicCount} chronic conditions and ${medsCount} medications).`);
  }
  // HIGH CONDITIONS
  else if (score === 'Normal' && (
    heartDiseaseSeverity === 'moderate' || 
    diabetesSeverity === 'severe' || 
    asthmaSeverity === 'severe' || 
    bpSeverity === 'severe' ||
    hasSevereAllergy || 
    severeCount === 1 || 
    moderateOrSevereCount >= 2 ||
    medsCount >= 4
  )) {
    score = 'High';
    if (heartDiseaseSeverity === 'moderate') breakdown.push('High Risk: Moderate heart condition reported.');
    else if (diabetesSeverity === 'severe') breakdown.push('High Risk: Severe diabetes diagnosed.');
    else if (asthmaSeverity === 'severe') breakdown.push('High Risk: Severe asthma/respiratory issue diagnosed.');
    else if (bpSeverity === 'severe') breakdown.push('High Risk: Severe hypertension/BP issues diagnosed.');
    else if (hasSevereAllergy) breakdown.push(`High Risk: Severe anaphylactic allergy (${severeAllergen}) reported.`);
    else if (moderateOrSevereCount >= 2) breakdown.push('High Risk: Multiple moderate chronic conditions reported.');
    else if (medsCount >= 4) breakdown.push(`High Risk: High medication volume (${medsCount} active medications).`);
    else breakdown.push('High Risk: Active high-severity medical conditions.');
  }
  // MODERATE CONDITIONS
  else if (score === 'Normal' && (
    hasHeartDisease || 
    hasDiabetes || 
    hasAsthma || 
    hasBPIssues || 
    medsCount >= 2 || 
    moderateOrSevereCount === 1
  )) {
    score = 'Moderate';
    if (hasHeartDisease) breakdown.push('Moderate Risk: Mild heart condition reported.');
    else if (hasDiabetes) breakdown.push('Moderate Risk: Controlled or mild diabetes.');
    else if (hasAsthma) breakdown.push('Moderate Risk: Controlled or mild asthma.');
    else if (hasBPIssues) breakdown.push('Moderate Risk: Controlled high blood pressure/hypertension.');
    else if (medsCount >= 2) breakdown.push(`Moderate Risk: Ongoing management with ${medsCount} medications.`);
    else breakdown.push('Moderate Risk: Managed chronic condition.');
  }
  // NORMAL
  else if (score === 'Normal') {
    breakdown.push('Normal Status: No significant or high-severity chronic conditions reported.');
  }

  return {
    riskScore: score,
    riskBreakdown: breakdown,
  };
}

module.exports = { calculateRisk };
