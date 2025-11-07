require('dotenv').config();
const Arweave = require('arweave');

async function getAddress() {
  try {
    const arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https'
    });
    
    const walletKey = JSON.parse(process.env.ARWEAVE_WALLET_KEY);
    const address = await arweave.wallets.getAddress(walletKey);
    
    console.log('='.repeat(60));
    console.log('💰 YOUR WALLET ADDRESS:');
    console.log(address);
    console.log('='.repeat(60));
    console.log('💡 Copy this address to get test tokens from the faucet!');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

getAddress();
