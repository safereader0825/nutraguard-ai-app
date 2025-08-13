const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
<head>
    <title>NutriGuard AI - Health Scanner</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 400px; margin: 0 auto; }
        .header { text-align: center; color: white; margin-bottom: 30px; }
        .card { background: white; padding: 20px; border-radius: 15px; margin-bottom: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .btn { width: 100%; padding: 15px; border: none; border-radius: 10px; font-size: 16px; margin-bottom: 10px; cursor: pointer; }
        .btn-primary { background: #ff6b6b; color: white; }
        .btn-secondary { background: #3742fa; color: white; }
        .feature { display: flex; align-items: center; margin-bottom: 15px; }
        .emoji { font-size: 20px; margin-right: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ NutriGuard AI</h1>
            <p>Your Family's Health Guardian</p>
        </div>

        <div class="card">
            <button class="btn btn-primary" onclick="startScan()">📸 Scan Product Label</button>
            <button class="btn btn-secondary" onclick="uploadPhoto()">📁 Upload Photo</button>
        </div>

        <div class="card">
            <h3>⚕️ Add Your Medications</h3>
            <select id="meds" onchange="addMed()">
                <option value="">Select medication...</option>
                <option value="Lisinopril">Lisinopril (Blood Pressure)</option>
                <option value="Warfarin">Warfarin (Blood Thinner)</option>
                <option value="Metformin">Metformin (Diabetes)</option>
            </select>
            <div id="medList" style="margin-top: 10px; color: #666;">No medications added</div>
        </div>

        <div class="card" id="results" style="display: none;">
            <h3>📊 Analysis Results</h3>
            <div style="background: #ff3838; color: white; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                ⚠️ WARNING: Contains ginger - may interact with blood pressure medications!
            </div>
            <div style="background: #ffb700; color: white; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                🚸 CHILD ALERT: Contains artificial colors that may cause hyperactivity
            </div>
            <div style="background: #00b894; color: white; padding: 10px; border-radius: 5px;">
                ✅ ALTERNATIVE: Try organic snacks without artificial additives
            </div>
        </div>

        <div class="card">
            <h3>✨ Features</h3>
            <div class="feature">
                <div class="emoji">💊</div>
                <div><strong>Drug Interaction Alerts</strong><br>Warns about dangerous combinations</div>
            </div>
            <div class="feature">
                <div class="emoji">👶</div>
                <div><strong>Child Safety</strong><br>Special warnings for kids</div>
            </div>
            <div class="feature">
                <div class="emoji">🔍</div>
                <div><strong>Instant Analysis</strong><br>Real-time health assessment</div>
            </div>
        </div>
    </div>

    <script>
        let medications = [];
        
        function addMed() {
            const select = document.getElementById('meds');
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
            document.getElementById('results').style.display = 'block';
            document.getElementById('results').scrollIntoView();
        }
        
        function uploadPhoto() {
            alert('📸 Camera feature coming soon! Try the scan demo for now.');
        }
    </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log('NutriGuard AI running on port ' + PORT);
});
