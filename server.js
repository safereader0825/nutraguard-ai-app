const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>NutriGuard AI - Your Health Guardian</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
            .container { max-width: 400px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 2.5rem; margin-bottom: 10px; }
            .title { color: white; font-size: 1.8rem; font-weight: 700; margin-bottom: 5px; }
            .subtitle { color: rgba(255,255,255,0.9); font-size: 1rem; }
            .card { background: white; border-radius: 20px; padding: 25px; margin-bottom: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
            .scan-btn { width: 100%; background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white; border: none; padding: 18px; border-radius: 15px; font-size: 1.1rem; font-weight: 600; cursor: pointer; margin-bottom: 15px; }
            .scan-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(238,90,36,0.3); }
            .upload-btn { width: 100%; background: linear-gradient(135deg, #3742fa, #2f3542); color: white; border: none; padding: 15px; border-radius: 12px; font-size: 1rem; cursor: pointer; }
            .toggle-group { display: flex; background: #f1f2f6; border-radius: 12px; padding: 4px; margin-bottom: 20px; }
            .toggle { flex: 1; padding: 10px; text-align: center; border-radius: 8px; cursor: pointer; transition: all 0.3s; }
            .toggle.active { background: #3742fa; color: white; }
            .input-group { margin-bottom: 15px; }
            .input-group label { display: block; font-weight: 600; color: #2f3542; margin-bottom: 8px; }
            .input-group input, .input-group select { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 10px; font-size: 1rem; }
            .med-list { background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 15px; }
            .med-item { background: #3742fa; color: white; padding: 8px 12px; border-radius: 20px; display: inline-block; margin: 5px; font-size: 0.9rem; }
            .alert { padding: 15px; border-radius: 10px; margin-bottom: 15px; }
            .alert-danger { background: #ff3838; color: white; }
            .alert-warning { background: #ffb700; color: white; }
            .alert-success { background: #00b894; color: white; }
            .feature { display: flex; align-items: center; margin-bottom: 15px; }
            .feature-icon { font-size: 1.5rem; margin-right: 15px; }
            .hidden { display: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🛡️</div>
                <h1 class="title">NutriGuard AI</h1>
                <p class="subtitle">Your Family's Health Guardian</p>
            </div>

            <div class="card">
                <div class="toggle-group">
                    <div class="toggle active" onclick="setMode('adult')">👨‍👩‍👧‍👦 Adults</div>
                    <div class="toggle" onclick="setMode('children')">👶 Children</div>
                </div>

                <button class="scan-btn" onclick="startScan()">
                    📸 Scan Product Label
                </button>
                
                <button class="upload-btn" onclick="uploadPhoto()">
                    📁 Upload Photo
                </button>
            </div>

            <div class="card">
                <h3 style="margin-bottom: 15px; color: #2f3542;">⚕️ Your Medications</h3>
                
                <div class="input-group">
                    <select id="medicationSelect" onchange="addMedication()">
                        <option value="">Select your medication...</option>
                        <option value="lisinopril">Lisinopril (Blood Pressure)</option>
                        <option value="warfarin">Warfarin (Blood Thinner)</option>
                        <option value="metformin">Metformin (Diabetes)</option>
                        <option value="levothyroxine">Levothyroxine (Thyroid)</option>
                        <option value="sertraline">Sertraline (Depression)</option>
                    </select>
                </div>

                <div class="med-list" id="medicationList">
                    <small style="color: #666;">No medications added yet</small>
                </div>
            </div>

            <div class="card" id="resultsCard" style="display: none;">
                <h3 style="margin-bottom: 15px; color: #2f3542;">📊 Analysis Results</h3>
                <div id="analysisResults"></div>
            </div>

            <div class="card">
                <h3 style="margin-bottom: 15px; color: #2f3542;">✨ Features</h3>
                
                <div class="feature">
                    <div class="feature-icon">💊</div>
                    <div>
                        <strong>Drug Interaction Alerts</strong><br>
                        <small>Warns about dangerous food-medication combinations</small>
                    </div>
                </div>

                <div class="feature">
                    <div class="feature-icon">👶</div>
                    <div>
                        <strong>Child Safety Warnings</strong><br>
                        <small>Special alerts for harmful ingredients in children</small>
                    </div>
                </div>

                <div class="feature">
                    <div class="feature-icon">🔍</div>
                    <div>
                        <strong>Instant Analysis</strong><br>
                        <small>Real-time nutrition and safety assessment</small>
                    </div>
                </div>

                <div class="feature">
                    <div class="feature-icon">🍎</div>
                    <div>
                        <strong>Healthy Alternatives</strong><br>
                        <small>Suggests better food options for your health</small>
                    </div>
                </div>
            </div>

            <div class="card" style="text-align: center; background: linear-gradient(135deg, #ff6b6b, #ee5a24); color: white;">
                <h3 style="margin-bottom: 10px;">🚀 Ready to Protect Your Family?</h3>
                <p style="margin-bottom: 15px; opacity: 0.9;">Try scanning your first product!</p>
                <button class="upload-btn" onclick="startScan()" style="background: rgba(255,255,255,0.2); border: 2px solid white;">
                    Get Started Now
                </button>
            </div>
        </div>

        <script>
            let currentMode = 'adult';
            let userMedications = [];

            function setMode(mode) {
                currentMode = mode;
                document.querySelectorAll('.toggle').forEach(t => t.classList.remove('active'));
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
                        \`<span class="med-item">\${med} <span onclick="removeMedication('\${med}')" style="cursor: pointer; margin-left: 5px;">×</span></span>\`
                    ).join('');
                }
            }

            function removeMedication(med) {
                userMedications = userMedications.filter(m => m !== med);
                updateMedicationList();
            }

            function startScan() {
                // Simulate scanning process
                document.getElementById('resultsCard').style.display = 'block';
                document.getElementById('analysisResults').innerHTML = \`
                    <div class="alert alert-danger">
                        <strong>⚠️ CRITICAL WARNING:</strong> This product contains ginger extract which may interact with blood pressure medications.
                    </div>
                    <div class="alert alert-warning">
                        <strong>🚸 CHILD WARNING:</strong> Contains artificial colors (Red 40) that may cause hyperactivity in children.
                    </div>
                    <div class="alert alert-success">
                        <strong>✅ SAFE ALTERNATIVE:</strong> Try organic fruit snacks without artificial additives.
                    </div>
                    <div style="margin-top: 15px;">
                        <strong>Overall Health Score: </strong>
                        <span style="color: #ff3838; font-size: 1.2rem;">2/5 ⭐⭐</span>
                    </div>
                \`;
                
                // Scroll to results
                document.getElementById('resultsCard').scrollIntoView({ behavior: 'smooth' });
            }

            function uploadPhoto() {
                alert('📸 Camera feature coming soon! For now, try the scan demo above.');
            }
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(\`NutriGuard AI Server running on port \${PORT}\`);