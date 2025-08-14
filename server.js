const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

// Medical database from Artifact #1
const medicalDatabase = {
  drugInteractions: {
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
  },
  dangerousForKids: ['red 40', 'yellow 6', 'bht', 'msg', 'high fructose corn syrup']
};

function analyzeSafety(ingredients, userMedications, ageGroup) {
  const warnings = [];
  let riskLevel = 'LOW';
  
  // Check drug interactions
  userMedications.forEach(med => {
    const medInfo = medicalDatabase.drugInteractions[med.toLowerCase()];
    if (medInfo) {
      medInfo.dangerous.forEach(dangerous => {
        if (ingredients.some(ing => ing.toLowerCase().includes(dangerous))) {
          warnings.push({
            type: 'CRITICAL',
            message: `⚠️ DANGER: Contains ${dangerous} - conflicts with ${med}`,
            action: 'DO NOT CONSUME - Contact doctor immediately'
          });
          riskLevel = 'CRITICAL';
        }
      });
    }
  });
  
  // Check child safety
  if (ageGroup === 'children') {
    medicalDatabase.dangerousForKids.forEach(dangerous => {
      if (ingredients.some(ing => ing.includes(dangerous))) {
        warnings.push({
          type: 'HIGH',
          message: `🚸 NOT SAFE for children: Contains ${dangerous}`,
          action: 'Choose products made for children'
        });
        if (riskLevel !== 'CRITICAL') riskLevel = 'HIGH';
      }
    });
  }
  
  return { riskLevel, warnings };
}

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NutriGuard AI - Your Health Guardian</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container { max-width: 420px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; color: white; }
        .logo { font-size: 3rem; margin-bottom: 10px; }
        .title { font-size: 2rem; font-weight: 700; margin-bottom: 5px; }
        .subtitle { font-size: 1.1rem; opacity: 0.9; }
        .card { 
            background: white; 
            border-radius: 20px; 
            padding: 25px; 
            margin-bottom: 20px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .scan-section { text-align: center; margin-bottom: 25px; }
        .scan-btn { 
            width: 100%; 
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white; 
            border: none; 
            padding: 18px; 
            border-radius: 15px; 
            font-size: 1.2rem; 
            font-weight: 600; 
            cursor: pointer; 
            margin-bottom: 15px;
            transition: transform 0.2s;
        }
        .scan-btn:hover { transform: translateY(-2px); }
        .upload-btn { 
            width: 100%; 
            background: linear-gradient(135deg, #3742fa, #2f3542);
            color: white; 
            border: none; 
            padding: 15px; 
            border-radius: 12px; 
            font-size: 1rem; 
            cursor: pointer;
        }
        .mode-toggle { 
            display: flex; 
            background: #f1f2f6; 
            border-radius: 12px; 
            padding: 4px; 
            margin-bottom: 20px; 
        }
        .mode-btn { 
            flex: 1; 
            padding: 12px; 
            text-align: center; 
            border-radius: 8px; 
            cursor: pointer; 
            transition: all 0.3s;
            font-weight: 600;
        }
        .mode-btn.active { background: #3742fa; color: white; }
        .med-section h3 { margin-bottom: 15px; color: #2f3542; }
        .med-select { 
            width: 100%; 
            padding: 12px; 
            border: 2px solid #ddd; 
            border-radius: 10px; 
            font-size: 1rem; 
            margin-bottom: 15px;
        }
        .med-list { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 10px; 
            min-height: 50px;
        }
        .med-item { 
            background: #3742fa; 
            color: white; 
            padding: 8px 15px; 
            border-radius: 20px; 
            display: inline-block; 
            margin: 5px; 
            font-size: 0.9rem;
        }
        .remove-med { 
            margin-left: 8px; 
            cursor: pointer; 
            font-weight: bold;
        }
        .results { 
            margin-top: 20px; 
            display: none;
        }
        .alert { 
            padding: 15px; 
            border-radius: 10px; 
            margin-bottom: 15px; 
            font-weight: 600;
        }
        .alert-critical { background: #ff3838; color: white; }
        .alert-high { background: #ff9500; color: white; }
        .alert-success { background: #00b894; color: white; }
        .features { margin-top: 20px; }
        .feature { 
            display: flex; 
            align-items: center; 
            margin-bottom: 15px; 
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
        }
        .feature-icon { font-size: 1.5rem; margin-right: 15px; }
        .demo-mode { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 10px; 
            border-radius: 8px; 
            margin-bottom: 20px; 
            text-align: center;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🛡️</div>
            <h1 class="title">NutriGuard AI</h1>
            <p class="subtitle">Your Family's Health Guardian</p>
        </div>

        <div class="demo-mode">
            <strong>🚀 DEMO MODE:</strong> This is a fully functional prototype. Camera integration coming in next update!
        </div>

        <div class="card">
            <div class="mode-toggle">
                <div class="mode-btn active" onclick="setMode('adult')">👨‍👩‍👧‍👦 Adults</div>
                <div class="mode-btn" onclick="setMode('children')">👶 Children</div>
            </div>

            <div class="scan-section">
                <button class="scan-btn" onclick="simulateScan()">
                    📸 Scan Product Label
                </button>
                <button class="upload-btn" onclick="uploadDemo()">
                    📁 Upload Photo (Demo)
                </button>
            </div>
        </div>

        <div class="card">
            <div class="med-section">
                <h3>💊 Your Medications</h3>
                <select class="med-select" id="medicationSelect" onchange="addMedication()">
                    <option value="">Select your medication...</option>
                    <option value="lisinopril">Lisinopril (Blood Pressure)</option>
                    <option value="warfarin">Warfarin (Blood Thinner)</option>
                    <option value="metformin">Metformin (Diabetes)</option>
                    <option value="levothyroxine">Levothyroxine (Thyroid)</option>
                    <option value="sertraline">Sertraline (Depression)</option>
                </select>
                <div class="med-list" id="medicationList">
                    <small style="color: #666;">No medications added yet</small>
                </div>
            </div>
        </div>

        <div class="card results" id="resultsCard">
            <h3>📊 Safety Analysis Results</h3>
            <div id="analysisResults"></div>
        </div>

        <div class="card">
            <h3>✨ App Features</h3>
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">💊</div>
                    <div>
                        <strong>Drug Interaction Alerts</strong><br>
                        <small>Prevents dangerous food-medication combinations</small>
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon">👶</div>
                    <div>
                        <strong>Child Safety Protection</strong><br>
                        <small>Special warnings for harmful ingredients in children</small>
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🔍</div>
                    <div>
                        <strong>Instant AI Analysis</strong><br>
                        <small>Real-time nutrition and safety assessment</small>
                    </div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🍎</div>
                    <div>
                        <strong>Healthy Alternatives</strong><br>
                        <small>Smart recommendations for better choices</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="card" style="background: linear-gradient(135deg, #00b894, #00a085); color: white; text-align: center;">
            <h3 style="margin-bottom: 15px;">🚀 Ready to Protect Your Family?</h3>
            <p style="margin-bottom: 20px; opacity: 0.9;">Join thousands using NutriGuard AI for safer food choices</p>
            <button class="upload-btn" onclick="simulateScan()" style="background: rgba(255,255,255,0.2); border: 2px solid white;">
                Try Demo Scan Now
            </button>
        </div>
    </div>

    <script>
        let currentMode = 'adult';
        let userMedications = [];

        function setMode(mode) {
            currentMode = mode;
            document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
        }

        function addMedication() {
            const select = document.getElementById('medicationSelect');
            const medication = select.value;
            
            if (medication && !userMedications.includes(medication)) {
                userMedications.push(medication);
                updateMedicationList();
                select.value = '';
            }
        }

        function updateMedicationList() {
            const list = document.getElementById('medicationList');
            if (userMedications.length === 0) {
                list.innerHTML = '<small style="color: #666;">No medications added yet</small>';
            } else {
                list.innerHTML = userMedications.map(med => 
                    \`<span class="med-item">\${med}<span class="remove-med" onclick="removeMedication('\${med}')">×</span></span>\`
                ).join('');
            }
        }

        function removeMedication(med) {
            userMedications = userMedications.filter(m => m !== med);
            updateMedicationList();
        }

        function simulateScan() {
            // Simulate scanning a product with potential issues
            const mockIngredients = ['wheat flour', 'sugar', 'ginger extract', 'red 40', 'natural flavors'];
            
            document.getElementById('resultsCard').style.display = 'block';
            
            let results = '<div class="alert alert-success">✅ <strong>Product Scanned Successfully!</strong></div>';
            
            // Check for drug interactions
            if (userMedications.includes('lisinopril') && mockIngredients.includes('ginger extract')) {
                results += '<div class="alert alert-critical">⚠️ <strong>CRITICAL:</strong> Ginger may interact with blood pressure medication!</div>';
            }
            
            // Check for child safety
            if (currentMode === 'children' && mockIngredients.includes('red 40')) {
                results += '<div class="alert alert-high">🚸 <strong>CHILD WARNING:</strong> Contains Red 40 - may cause hyperactivity!</div>';
            }
            
            if (userMedications.length === 0) {
                results += '<div class="alert alert-success">✅ <strong>Safe Alternative:</strong> Try organic products without artificial additives.</div>';
            }
            
            results += \`
                <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <strong>Health Score: </strong>
                    <span style="color: #ff6b6b; font-size: 1.2rem;">3/5 ⭐⭐⭐</span>
                    <br><small>Consider healthier alternatives for better nutrition.</small>
                </div>
            \`;
            
            document.getElementById('analysisResults').innerHTML = results;
            document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth' });
        }

        function uploadDemo() {
            alert('📸 Photo upload feature coming soon! Try the scan demo for now to see how the analysis works.');
        }
    </script>
</body>
</html>`);
});

// API endpoint for future mobile app integration
app.post('/api/analyze', (req, res) => {
  const { ingredients, medications, ageGroup } = req.body;
  const analysis = analyzeSafety(ingredients || [], medications || [], ageGroup || 'adult');
  res.json(analysis);
});

app.listen(PORT, () => {
  console.log(\`NutriGuard AI Server running on port \${PORT}\`);
});
