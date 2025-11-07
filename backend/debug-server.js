const fs = require('fs');
const path = require('path');

console.log('=== DEBUGGING SERVER ===');
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);

// Test each route file individually
const routes = [
  { name: 'Bounties', file: 'bounties.js' },
  { name: 'Audio', file: 'translation-audio.js' },
  { name: 'Translation', file: 'translation.js' }
];

routes.forEach(route => {
  console.log(`\n--- Testing ${route.name} ---`);
  
  const relativePath = `./routes/${route.file}`;
  const absolutePath = path.join(__dirname, 'routes', route.file);
  const cwdPath = path.join(process.cwd(), 'routes', route.file);
  
  console.log('Relative path:', relativePath);
  console.log('Absolute path:', absolutePath);
  console.log('CWD path:', cwdPath);
  
  // Check if files exist
  console.log('Relative exists:', fs.existsSync(relativePath));
  console.log('Absolute exists:', fs.existsSync(absolutePath));
  console.log('CWD exists:', fs.existsSync(cwdPath));
  
  // Try to require
  let loaded = false;
  [relativePath, absolutePath, cwdPath].forEach(testPath => {
    if (fs.existsSync(testPath) && !loaded) {
      try {
        const module = require(testPath);
        console.log(`✅ SUCCESS loading from: ${testPath}`);
        console.log(`   Module type: ${typeof module}`);
        loaded = true;
      } catch (e) {
        console.log(`❌ FAILED loading from: ${testPath}`);
        console.log(`   Error: ${e.message}`);
      }
    }
  });
});
