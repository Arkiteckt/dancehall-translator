const fs = require('fs');
const path = require('path');

const debugPatterns = [
  /🎵 REAL AI TRANSLATION DEBUG:/,
  /🔵 DIRECT RENDER TEST:/,
  /🟢 APP LOADED:/,
  /Has Result:/,
  /Original:.*chars/,
  /Translated:.*chars/,
  /All Keys:/,
  /View: result/,
  /ORIGINAL:/,
  /TRANSLATED:/
];

function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Remove lines containing debug patterns
    debugPatterns.forEach(pattern => {
      content = content.split('\n')
        .filter(line => !pattern.test(line))
        .join('\n');
    });
    
    // Remove debug divs or components
    content = content.replace(/<div[^>]*>.*REAL AI TRANSLATION DEBUG.*?<\/div>/gs, '');
    content = content.replace(/<div[^>]*>.*DIRECT RENDER TEST.*?<\/div>/gs, '');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Cleaned: ${filePath}`);
      return true;
    }
  } catch (error) {
    console.log(`❌ Error cleaning ${filePath}:`, error.message);
  }
  return false;
}

// Find and clean all JSX files
const srcDir = './src';
const files = [];

function findFiles(dir) {
  const items = fs.readdirSync(dir);
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findFiles(fullPath);
    } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
      files.push(fullPath);
    }
  });
}

findFiles(srcDir);
console.log(`🔍 Found ${files.length} files to check...`);

let cleanedCount = 0;
files.forEach(file => {
  if (cleanFile(file)) {
    cleanedCount++;
  }
});

console.log(`🎉 Cleaned ${cleanedCount} files`);
