const arweaveService = require('./blockchainService');
const arcService = require('./arcBlockchainService');

class BlockchainOrchestrator {
  constructor() {
    this.services = {
      arweave: arweaveService,
      arc: arcService
    };
  }

  async storeTranslation(translationData) {
    console.log('🌐 Storing translation on multiple blockchains...');
    
    const results = {
      arweave: null,
      arc: null,
      timestamp: new Date().toISOString()
    };

    try {
      // 1. First store on Arweave (permanent storage)
      console.log('📦 Step 1: Storing on Arweave...');
      results.arweave = await this.services.arweave.storeTranslation(translationData);
      
      // 2. Then store reference on Arc (smart contract)
      if (results.arweave.transactionId && !results.arweave.transactionId.startsWith('mock_')) {
        console.log('📝 Step 2: Storing reference on Arc...');
        results.arc = await this.services.arc.storeTranslation({
          ...translationData,
          arweaveTxId: results.arweave.transactionId,
          id: `translation_${Date.now()}`
        });
      } else {
        console.log('⚠️ Skipping Arc storage - Arweave used mock transaction');
        results.arc = { error: 'Arweave mock transaction' };
      }

      console.log('✅ Dual blockchain storage completed!');
      return results;

    } catch (error) {
      console.error('❌ Dual blockchain storage failed:', error);
      
      // Try to store on at least one blockchain
      if (!results.arweave) {
        console.log('🔄 Falling back to Arweave only...');
        results.arweave = await this.services.arweave.storeTranslation(translationData);
      }
      
      return results;
    }
  }

  async getStatus() {
    const status = {};
    
    for (const [name, service] of Object.entries(this.services)) {
      try {
        status[name] = await service.getStatus();
      } catch (error) {
        status[name] = { error: error.message };
      }
    }
    
    return status;
  }

  // Get translation from both blockchains
  async getTranslation(arweaveTxId, arcTxId = null) {
    const results = {};
    
    try {
      // Get full data from Arweave
      if (arweaveTxId && !arweaveTxId.startsWith('mock_')) {
        // This would require implementing getTransactionData in your arweave service
        results.arweave = { txId: arweaveTxId, note: 'Implement fetch from Arweave gateway' };
      }
      
      // Get reference data from Arc
      if (arcTxId && !arcTxId.startsWith('0xmock')) {
        results.arc = await this.services.arc.getTranslationFromArc(arcTxId);
      }
      
    } catch (error) {
      console.error('Error fetching translation:', error);
    }
    
    return results;
  }
}

module.exports = new BlockchainOrchestrator();
