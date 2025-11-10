const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchainService');

// Create bounty on ARC blockchain
router.post('/bounties/create', async (req, res) => {
  try {
    const { title, description, amount, creator } = req.body;
    
    const result = await blockchainService.createBounty({
      title,
      description, 
      amount,
      creator,
      currency: 'AR'
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get bounty data from ARC
router.get('/bounties/:txId', async (req, res) => {
  try {
    const { txId } = req.params;
    const result = await blockchainService.getBounty(txId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Deploy bounty smart contract
router.post('/bounties/contract', async (req, res) => {
  try {
    const { creator, amount, description } = req.body;
    
    const result = await blockchainService.createBountyContract({
      creator,
      amount,
      description
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ARC Blockchain API is running',
    network: 'Arweave Mainnet',
    features: ['Bounties', 'Smart Contracts', 'Permanent Storage']
  });
});

module.exports = router;
