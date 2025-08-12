javascript// MEDICAL SAFETY ENGINE - The Brain of NutriGuard AI
class MedicalSafetyEngine {
  constructor() {
    this.drugInteractions = {
      'lisinopril': {
        dangerous: ['potassium', 'ginger', 'salt substitute'],
        warnings: 'Can cause dangerous heart rhythm problems',
        severity: 'CRITICAL'
      },
      'warfarin': {
        dangerous: ['vitamin k', 'spinach', 'kale', 'ginger'],
        warnings: 'Blocks blood thinner effects - increases clot risk',
        severity: 'CRITICAL'
      },
      'metformin': {
        dangerous: ['alcohol', 'high sugar'],
        warnings: 'Can cause dangerous blood sugar changes',
        severity: 'HIGH'
      }
    };

    this.dangerousForKids = [
      'red 40', 'yellow 6', 'bht', 'msg', 'high fructose corn syrup'
    ];
  }

  // MAIN SAFETY ANALYSIS
  analyzeSafety(ingredients, userProfile) {
    const warnings = [];
    let riskLevel = 'LOW';

    // Check drug interactions
    if (userProfile.medications) {
      userProfile.medications.forEach(med => {
        const medInfo = this.drugInteractions[med.toLowerCase()];
        if (medInfo) {
          medInfo.dangerous.forEach(dangerous => {
            if (ingredients.some(ing => ing.toLowerCase().includes(dangerous))) {
              warnings.push({
                type: 'DRUG_INTERACTION',
                severity: 'CRITICAL',
                message: `DANGER: Contains ${dangerous} - conflicts with ${med}`,
                action: 'DO NOT CONSUME - Contact doctor immediately'
              });
              riskLevel = 'CRITICAL';
            }
          });
        }
      });
    }

    // Check child safety
    if (userProfile.ageGroup === 'children') {
      this.dangerousForKids.forEach(dangerous => {
        if (ingredients.some(ing => ing.includes(dangerous))) {
          warnings.push({
            type: 'CHILD_WARNING',
            severity: 'HIGH',
            message: `NOT SAFE for children: Contains ${dangerous}`,
            action: 'Choose products made for children'
          });
          if (riskLevel !== 'CRITICAL') riskLevel = 'HIGH';
        }
      });
    }

    return {
      riskLevel,
      warnings,
      overallAdvice: this.getAdvice(riskLevel)
    };
  }

  getAdvice(riskLevel) {
    switch(riskLevel) {
      case 'CRITICAL': return '🚨 DO NOT CONSUME - Serious health risk';
      case 'HIGH': return '⚠️ AVOID - High health risk';
      case 'MEDIUM': return '🤔 USE CAUTION - Consider alternatives';
      default: return '✅ Generally safe in moderation';
    }
  }
}

module.exports = MedicalSafetyEngine;
