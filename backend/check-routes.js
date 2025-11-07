const fs = require('fs');

const routes = [
  'bounties',
  'translation', 
  'audio',
  'blockchain'
];

console.log('=== ROUTE FILES CHECK ===');
routes.forEach(route => {
  const exists = fs.existsSync(`./routes/${route}.js`);
  console.log(`${exists ? '✅' : '❌'} ${route}.js`);
});
