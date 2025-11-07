require('dotenv').config();

console.log('=== ENVIRONMENT VARIABLES TEST ===');
console.log('ELEVEN_LABS_API_KEY exists:', !!process.env.ELEVEN_LABS_API_KEY);
console.log('ELEVEN_LABS_API_KEY length:', process.env.ELEVEN_LABS_API_KEY?.length || 0);
console.log('ELEVEN_LABS_API_KEY value:', process.env.ELEVEN_LABS_API_KEY || 'NOT FOUND');
console.log('All environment variables:', Object.keys(process.env).filter(key => key.includes('ELEVEN')));
