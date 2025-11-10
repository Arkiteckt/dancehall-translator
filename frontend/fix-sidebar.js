const fs = require('fs');
const content = fs.readFileSync('src/components/Sidebar.jsx', 'utf8');

// Replace the LogoText styled component
const fixedContent = content.replace(
  /const LogoText = styled\.h1`[^`]*`/,
  `const LogoText = styled.h1\`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  padding: 0;
\``
);

fs.writeFileSync('src/components/Sidebar.jsx', fixedContent);
console.log('✅ Fixed LogoText gradient styles');
