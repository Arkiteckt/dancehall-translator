// Test Arweave wallet key for development
const testWallet = {
  "kty": "RSA",
  "n": "test-key-for-development-purposes-only",
  "e": "AQAB",
  "d": "test",
  "p": "test", 
  "q": "test",
  "dp": "test",
  "dq": "test",
  "qi": "test"
};

console.log('Test wallet key:', JSON.stringify(testWallet));
