const Irys = require('@irys/sdk');

class BlockchainService {
    constructor() {
        this.irys = null;
        this.initialized = false;
        // Force mock mode for development - we don't want real blockchain during development
        this.useMock = true; 
        this.initializationError = null;
    }

    async initialize() {
        try {
            if (this.initialized) return;
            
            console.log('🔗 Initializing Blockchain Service...');
            
            // FOR DEVELOPMENT: Always use mock mode
            console.log('🎭 DEVELOPMENT MODE: Using MOCK blockchain');
            this.useMock = true;
            this.initialized = true;
            return;

            // The code below would only run in production with real wallet keys
            /*
            if (!process.env.ARWEAVE_WALLET_KEY) {
                console.log('❌ No ARWEAVE_WALLET_KEY - using mock mode');
                this.useMock = true;
                this.initialized = true;
                return;
            }

            let walletKey;
            try {
                const keyString = process.env.ARWEAVE_WALLET_KEY.trim();
                console.log('🔑 Processing wallet key...');
                
                // Check if this is a real wallet key or test key
                if (keyString.includes('test-key') || keyString.includes('"n":"test"')) {
                    console.log('🎭 Test wallet key detected - using mock mode');
                    this.useMock = true;
                    this.initialized = true;
                    return;
                }
                
                // Try to parse as JSON
                if (keyString.startsWith('{')) {
                    walletKey = JSON.parse(keyString);
                    console.log('✅ Using real Arweave wallet key');
                } else {
                    console.log('❌ Invalid wallet key format - using mock mode');
                    this.useMock = true;
                    this.initialized = true;
                    return;
                }
            } catch (parseError) {
                console.log('❌ Failed to parse wallet key - using mock mode');
                this.useMock = true;
                this.initialized = true;
                return;
            }

            try {
                console.log('🔄 Connecting to REAL Irys...');
                this.irys = new Irys({
                    url: 'https://node2.irys.xyz',
                    token: 'arweave',
                    key: walletKey,
                });

                const address = this.irys.address;
                console.log(`✅ REAL Irys connected! Address: ${address}`);
                
                this.initialized = true;
                this.useMock = false;
                console.log('🚀 REAL blockchain mode activated');
                
            } catch (initError) {
                console.error('❌ Real Irys failed - using mock mode:', initError.message);
                this.useMock = true;
                this.initialized = true;
            }
            */
            
        } catch (error) {
            console.error('❌ Initialization error - using mock mode:', error.message);
            this.useMock = true;
            this.initialized = true;
        }
    }

    async storeTranslation(translationData) {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            // Always use mock mode for development
            return this.storeTranslationMock(translationData);

        } catch (error) {
            console.error('❌ Blockchain storage failed:', error.message);
            return this.storeTranslationMock(translationData);
        }
    }

    async storeTranslationMock(translationData) {
        const mockTransactionId = 'mock_' + Math.random().toString(36).substring(2, 15);
        
        console.log(`✅ Translation stored in MOCK Arweave: ${mockTransactionId}`);
        console.log(`🎵 Artist: ${translationData.artist || 'Unknown'}`);
        console.log(`🎵 Song: ${translationData.song || 'Unknown'}`);
        console.log(`📝 Content: ${translationData.originalText?.substring(0, 50)}...`);
        
        return {
            transactionId: mockTransactionId,
            blockchain: 'arweave-mock',
            url: `https://arweave.net/${mockTransactionId}`,
            status: 'confirmed',
            timestamp: new Date().toISOString(),
            note: 'Mock transaction - Perfect for development! 🚀'
        };
    }

    async getStatus() {
        if (!this.initialized) {
            await this.initialize();
        }
        
        return {
            initialized: this.initialized,
            useMock: this.useMock,
            mode: 'development-mock',
            address: 'test-mode-no-real-wallet-needed',
            blockchain: 'arweave-mock',
            note: 'Using mock blockchain for development - no real funds needed!'
        };
    }
}

module.exports = new BlockchainService();
