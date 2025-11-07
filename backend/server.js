const express = require('express');
const cors = require('cors');

const app = express();

require('dotenv').config();

// Enable CORS
app.use(cors());
app.use(express.json());

console.log('🔧 Starting Dancehall Translator Backend...');

// Load routes - INCLUDE ESTIMATE-PRICE FIRST
try {
  const estimatePriceRoute = require('./routes/estimate-price.js');
  app.use('/api/estimate-price', estimatePriceRoute);
  console.log('✅ Estimate Price route loaded');
} catch (e) {
  console.log('❌ Estimate Price route failed:', e.message);
}

try {
  const bountiesRoute = require('./routes/bounties.js');
  app.use('/api/bounties', bountiesRoute);
  console.log('✅ Bounties route loaded');
} catch (e) {
  console.log('❌ Bounties route failed:', e.message);
}

// FIXED: Mount translation routes at /api/translate
try {
  const translationRoute = require('./routes/translation.js');
  app.use('/api/translate', translationRoute); // This mounts ALL translation routes at /api/translate
  console.log('✅ Translation route loaded');
} catch (e) {
  console.log('❌ Translation route failed:', e.message);
}

try {
  const audioRoute = require('./routes/translation-audio.js');
  app.use('/api/audio', audioRoute);
  console.log('✅ Audio route loaded');
} catch (e) {
  console.log('❌ Audio route failed:', e.message);
}

// ADD BLOCKCHAIN ROUTE HERE
try {
  const blockchainRoute = require('./routes/blockchain.js');
  app.use('/api/blockchain', blockchainRoute);
  console.log('✅ Blockchain route loaded');
} catch (e) {
  console.log('❌ Blockchain route failed:', e.message);
}

// Basic routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Dancehall Translator API is running!',
    status: 'OK',
    endpoints: [
      '/api/estimate-price',
      '/api/bounties', 
      '/api/translate',
      '/api/audio',
      '/api/blockchain'
    ]
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// TEST ENDPOINT - Add this to verify the route is working
app.post('/api/translate/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Translation endpoint is reachable',
    data: req.body
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('🚀 Server running on port', PORT);
  console.log('📱 API: http://localhost:' + PORT);
  console.log('💰 Price estimation: /api/estimate-price');
  console.log('🎵 Translation: POST /api/translate');
});
