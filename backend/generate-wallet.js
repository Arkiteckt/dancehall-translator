const Arweave = require('arweave');

async function generateWallet() {
  try {
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });

    // Generate new wallet
    const jwk = await arweave.wallets.generate();
    const address = await arweave.wallets.getAddress(jwk);
    
    console.log('💰 New Arweave Wallet Created!');
    console.log('🔑 Address:', address);
    console.log('📝 Wallet JSON (SAVE THIS SECURELY):');
    console.log(JSON.stringify(jwk, null, 2));
    
    return { jwk, address };
  } catch (error) {
    console.error('❌ Error generating wallet:', error);
  }
}

// Run the function
generateWallet();