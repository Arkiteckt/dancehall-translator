const Arweave = require('arweave');

async function createWallet() {
  try {
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
    
    console.log('🔑 Generating Arweave wallet...');
    const jwk = await arweave.wallets.generate();
    const address = await arweave.wallets.getAddress(jwk);
    
    console.log('='.repeat(60));
    console.log('�� ARWEAVE WALLET CREATED!');
    console.log('='.repeat(60));
    console.log('📧 WALLET ADDRESS (for faucet):');
    console.log(address);
    console.log('');
    console.log('🔐 WALLET KEY (copy EXACTLY for .env):');
    console.log('ARWEAVE_WALLET_KEY=' + JSON.stringify(jwk));
    console.log('='.repeat(60));
    console.log('💡 Copy the ENTIRE line starting with ARWEAVE_WALLET_KEY=');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createWallet();
