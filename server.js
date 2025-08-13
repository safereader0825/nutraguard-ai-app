const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>NutriGuard AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <h1>🎉 NutriGuard AI is LIVE!</h1>
        <p>Status: Working perfectly!</p>
        <p>Author: safereader0825</p>
        <p>Your nutrition scanner app is ready!</p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
