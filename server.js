const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
    <title>NutriGuard AI</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 400px; margin: 0 auto; }
        .header { text-align: center; color: white; margin-bottom: 30px; }
        .card { background: white; padding: 20px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .btn { width: 100%; padding: 15px; border: none; border-radius: 10px; font-size: 16px; margin-bottom: 10px; cursor: pointer; font-weight: bold; }
        .btn-scan { background: #ff6b6b; color: white; }
        .btn-upload { background: #3742fa; color: white; }
        .toggle { display: flex; background: #f1f2f6; border-radius: 10px; margin-bottom: 20px; }
        .toggle-btn { flex: 1; padding: 10px; text-align: center; cursor: pointer; border-radius: 8px; font-weight: bold; }
        .toggle-btn.active { background: #3742fa; color: white; }
        .med-select { width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 8px; margin-bottom: 15px; }
        .results { display: none; margin-top: 20px; }
        .alert { padding: 15px; border-radius: 8px; margin-bottom: 10px; font-weight: bold; }
        .alert-danger { background: #ff3838; color: white; }
        .alert-warning { background: #ffb700; color: white; }
        .alert-success { background: #00b894; color: white; }
        .feature { display: flex; align-items: center; margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 8px; }
        .emoji { font-size: 24px; margin-right: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ NutriGuard AI</h1>
            <p>Your Family Health Guardian</p>
        </div>
        <div class="card">
            <div class="toggle">
                <div class="toggle-btn active" onclick="setMode('adult')">👨‍👩‍👧‍👦 Adults</div>
                <div class="toggle-btn" onclick="setMode('children')">👶 Children</div>
            </div>
            <button class="btn btn-scan" onclick="startScan()">📸 Scan Product Label</button>
            <button class="btn btn-upload" onclick="uploadPhoto()">📁 Upload Photo</button>
        </div>
        <div class="card">
            <h3>💊 Add Your Medications</h3>
            <select class="med-select" id="medSelect" onchange="addMed()">
                <option value="">Select medication...</option>
                <option value="Lisinopril">Lisinopril (Blood Pressure)</option>
                <option value="Warfarin">Warfarin (Blood Thinner)</option>
                <option value="Metformin">Metformin (Diabetes)</option>
            </select>
            <div id="medList" style="color: #666; font-size: 14px;">No medications added</div>
        </div>
        <div class="card results" id="resultsCard">
            <h3>📊 Analysis Results</h3>
            <div id="analysisResults"></div>
        </div>
        <div class="card">
            <h3>✨ Features</h3>
            <div class="feature">
                <div class="emoji">💊</div>
                <div><strong>Drug Interaction Alerts</strong><br><small>Prevents dangerous combinations</small></div>
            </div>
            <div class="feature">
                <div class="emoji">👶</div>
                <div><strong>Child Safety</strong><br><small>Special warnings for kids</small></div>
            </div>
            <div class="feature">
                <div class="emoji">🔍</div>
                <div><strong>Instant Analysis</strong><br><small>Real-time assessment</small></div>
            </div>
        </div>
    </div>
    <script>
        let currentMode = 'adult';
        let medications = [];
        function setMode(mode) {
            currentMode = mode;
            document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
        }
        function addMed() {
            const select = document.getElementById('medSelect');
            const med = select.value;
            if (med && !medications.includes(med)) {
                medications.push(med);
                updateMedList();
                select.value = '';
            }
        }
        function updateMedList() {
            const list = document.getElementById('medList');
            if (medications.length === 0) {
                list.innerHTML = 'No medications added';
            } else {
                list.innerHTML = medications.join(', ');
            }
        }
        function startScan() {
            document.getElementById('resultsCard').style.display = 'block';
            let results = '<div class="alert alert-success">✅ Product scanned successfully!</div>';
            if (medications.includes('Lisinopril')) {
                results += '<div class="alert alert-danger">⚠️ WARNING: This product contains ginger which may interact with blood pressure medication!</div>';
            }
            if (currentMode === 'children') {
                results += '<div class="alert alert-warning">🚸 CHILD ALERT: Contains artificial colors that may cause hyperactivity!</div>';
            }
            results += '<div class="alert alert-success">✅ RECOMMENDATION: Try organic alternatives without artificial additives.</div>';
            document.getElementById('analysisResults').innerHTML = results;
            document.getElementById('resultsCard').scrollIntoView();
        }
        function uploadPhoto() {
            alert('📸 Photo upload coming soon! Try the scan demo for now.');
        }
    </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log('NutriGuard AI running on port ' + PORT);
});