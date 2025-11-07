import { ethers } from 'ethers';

// ARC Network Configuration
export const ARC_CONFIG = {
  chainId: '0x1ade', // 6876 in decimal - ARC Testnet
  chainName: 'ARC Testnet',
  rpcUrls: ['https://testnet-rpc.arc.network'],
  blockExplorerUrls: ['https://testnet-explorer.arc.network'],
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  }
};

// USDC Contract ABI (ERC-20 standard)
export const USDC_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// USDC Contract Addresses - UPDATE THESE WITH REAL ADDRESSES
export const USDC_CONTRACT_ADDRESSES = {
  // TODO: REPLACE WITH ACTUAL ARC USDC ADDRESSES
  testnet: '0xREPLACE_WITH_ARC_TESTNET_USDC', // Get from: https://testnet-explorer.arc.network
  mainnet: '0xREPLACE_WITH_ARC_MAINNET_USDC', // Get from: https://explorer.arc.network
  
  // Fallback addresses (these won't work on ARC but are here for reference)
  ethereum: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  goerli: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
};

export class ARCBlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.usdcContract = null;
    this.isSimulation = true;
  }

  // Check if we have real USDC addresses
  hasRealUSDCAddresses() {
    const testnetAddr = USDC_CONTRACT_ADDRESSES.testnet;
    return !testnetAddr.includes('REPLACE') && testnetAddr !== '0xSIMULATION';
  }

  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('No Ethereum wallet found. Please install MetaMask.');
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      const address = await this.signer.getAddress();
      const network = await this.provider.getNetwork();
      
      console.log('🔗 Wallet connected:', {
        address,
        chainId: network.chainId.toString(),
        networkName: network.name
      });

      // Switch to ARC network
      await this.switchToARCNetwork();

      // Check if we can use real USDC
      if (await this.isConnectedToARC() && this.hasRealUSDCAddresses()) {
        this.isSimulation = false;
        console.log('✅ Real USDC mode activated');
      } else {
        this.isSimulation = true;
        console.log('🎭 Simulation mode (no real USDC addresses)');
      }

      return address;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }

  async switchToARCNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARC_CONFIG.chainId }],
      });
      console.log('✅ Switched to ARC network');
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ARC_CONFIG],
          });
          console.log('✅ ARC network added to wallet');
        } catch (addError) {
          console.warn('⚠️ Could not add ARC network');
          throw new Error('Please add ARC network manually to your wallet');
        }
      } else {
        throw switchError;
      }
    }
  }

  async sendUSDCPayment(toAddress, amount) {
    if (this.isSimulation || !this.hasRealUSDCAddresses()) {
      return this.simulatePayment(toAddress, amount);
    }
    return this.realUSDCPayment(toAddress, amount);
  }

  async simulatePayment(toAddress, amount) {
    console.log(`💸 [SIMULATION] Sending ${amount} USDC to ${toAddress}`);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockHash = '0x' + Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    return {
      success: true,
      transactionHash: mockHash,
      blockNumber: Math.floor(Math.random() * 1000000),
      status: 'confirmed',
      isSimulation: true,
      message: this.hasRealUSDCAddresses() 
        ? 'Simulation - Add real USDC addresses to enable real payments'
        : 'Simulation - Real USDC addresses not configured'
    };
  }

  async realUSDCPayment(toAddress, amount) {
    if (!this.signer) throw new Error('Wallet not connected');
    if (!this.hasRealUSDCAddresses()) throw new Error('USDC addresses not configured');

    try {
      const usdcAddress = USDC_CONTRACT_ADDRESSES.testnet;
      this.usdcContract = new ethers.Contract(usdcAddress, USDC_ABI, this.signer);
      
      const decimals = await this.usdcContract.decimals();
      const symbol = await this.usdcContract.symbol();
      const amountInWei = ethers.parseUnits(amount.toString(), decimals);

      console.log(`💸 Sending ${amount} ${symbol} to ${toAddress}`);
      
      const transaction = await this.usdcContract.transfer(toAddress, amountInWei);
      console.log('📦 Transaction sent:', transaction.hash);
      
      const receipt = await transaction.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        isSimulation: false,
        message: 'Payment confirmed on ARC network'
      };
    } catch (error) {
      console.error('Real USDC payment failed:', error);
      throw error;
    }
  }

  async isConnectedToARC() {
    if (!window.ethereum) return false;
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      return chainId === ARC_CONFIG.chainId;
    } catch (error) {
      return false;
    }
  }

  async getConnectionInfo() {
    if (!this.signer) {
      return { 
        connected: false, 
        mode: 'disconnected',
        hasUSDC: this.hasRealUSDCAddresses()
      };
    }

    const address = await this.signer.getAddress();
    const isARC = await this.isConnectedToARC();
    const hasUSDC = this.hasRealUSDCAddresses();
    
    return {
      connected: true,
      mode: this.isSimulation ? 'simulation' : 'real',
      address: address,
      network: isARC ? 'ARC' : 'other',
      isSimulation: this.isSimulation,
      hasUSDC: hasUSDC,
      status: hasUSDC ? 'ready' : 'needs_usdc_address'
    };
  }
}

export default new ARCBlockchainService();
