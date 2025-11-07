// Script to help find USDC addresses on ARC network
// Run this in browser console when connected to ARC network

export async function findUSDCAddress() {
  if (!window.ethereum) {
    console.log('Please install MetaMask first');
    return;
  }

  try {
    // Common USDC contract addresses across networks
    const commonUSDCAddresses = [
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Mainnet USDC
      '0x07865c6E87B9F70255377e024ace6630C1Eaa37F', // Goerli USDC
      '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Common testnet pattern
    ];

    const provider = new ethers.BrowserProvider(window.ethereum);
    
    for (const address of commonUSDCAddresses) {
      try {
        const contract = new ethers.Contract(address, [
          'function symbol() view returns (string)',
          'function name() view returns (string)',
          'function decimals() view returns (uint8)'
        ], provider);

        const symbol = await contract.symbol();
        const name = await contract.name();
        
        if (symbol === 'USDC' && name.includes('USD Coin')) {
          console.log('✅ Found USDC:', { address, symbol, name });
          return address;
        }
      } catch (error) {
        // Contract doesn't exist or not USDC
        continue;
      }
    }

    console.log('❌ No USDC found in common addresses');
    console.log('💡 Check: https://testnet-explorer.arc.network for USDC deployments');
    
  } catch (error) {
    console.error('Error finding USDC:', error);
  }
}

// Usage: 
// 1. Connect to ARC network in MetaMask
// 2. Open browser console
// 3. Paste: await findUSDCAddress()
