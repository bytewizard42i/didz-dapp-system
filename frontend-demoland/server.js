/** DIDz.io demoLand Server — port 3013 */
const express = require('express'), path = require('path'), cors = require('cors');
const app = express(); const PORT = process.env.PORT || 3013;
app.use(cors()); app.use(express.json()); app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/health', (req, res) => { res.json({ status: 'ok', app: 'didz-io-demoland' }); });
app.get('*', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.listen(PORT, () => { console.log(`DIDz.io demoLand running at http://localhost:${PORT}`); });
