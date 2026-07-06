const express = require('express');
const path = require('path');

const app = express();
const PORT = 3010;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'didz-demoland-portal', port: PORT });
});

app.listen(PORT, () => {
  console.log(`🌐 DIDz DemoLand Portal → http://localhost:${PORT}`);
});
