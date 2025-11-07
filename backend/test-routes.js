const fs = require('fs');
const path = require('path');

console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);

const routes = [
  './routes/bounties.js',
  './routes/translation-audio.js', 
  './routes/translation.js',
  'routes/bounties.js',
  'routes/translation-audio.js',
  'routes/translation.js'
];

routes.forEach(routePath => {
  const fullPath = path.resolve(routePath);
  const exists = fs.existsSync(fullPath);
  console.log(`\nTesting: ${routePath}`);
  console.log(`Resolved to: ${fullPath}`);
  console.log(`Exists: ${exists}`);
  
  if (exists) {
    try {
      const stats = fs.statSync(fullPath);
      console.log(`Size: ${stats.size} bytes`);
      console.log(`Readable: ${fs.accessSync(fullPath, fs.constants.R_OK) ? 'Yes' : 'No'}`);
    } catch (e) {
      console.log(`Error accessing: ${e.message}`);
    }
  }
});
