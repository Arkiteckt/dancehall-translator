const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Replace all 'request' view names with 'translation'
content = content.replace(/currentView === 'request'/g, "currentView === 'translation'");
content = content.replace(/setCurrentView\('request'\)/g, "setCurrentView('translation')");

// Also update the useEffect debug to show the correct view names
content = content.replace(
  /console\.log\('🔍 currentView:', currentView\);/,
  `console.log('🔍 currentView:', currentView);\n    console.log('🔍 Available views: dashboard, translation, payment, result');`
);

fs.writeFileSync('src/App.jsx', content);
console.log('✅ Fixed view name mismatches');
