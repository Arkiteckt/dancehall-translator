const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchainService');


console.log('🎵 Blockchain route file is loading...');

console.log('✅ Blockchain route loaded');


// Store translation on blockchain

router.post('/store-translation', async (req, res) => {
  try {
    const { 
      originalText, 
      translatedText, 
      songTitle, 
      artistName, 
      culturalNotes 
    } = req.body;

    if (!originalText || !translatedText) {
      return res.status(400).json({
        success: false,
        error: 'Original text and translated text are required'
      });
    }

    const translationData = {
      originalText,
      translatedText,
      songTitle: songTitle || 'Unknown',
      artistName: artistName || 'Unknown',
      culturalNotes: culturalNotes || [],
      timestamp: new Date().toISOString()
    };

    const transactionId = await blockchainService.storeTranslation(translationData);

    res.json({
      success: true,
      transactionId,
      message: 'Translation stored on blockchain',
      data: translationData
    });

  } catch (error) {
    console.error('Blockchain storage error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to store translation on blockchain',
      details: error.message
    });
  }
});

// Create bounty on blockchain
router.post('/create-bounty', async (req, res) => {
  try {
    const { 
      songTitle, 
      artistName, 
      description, 
      reward, 
      deadline 
    } = req.body;

    if (!songTitle || !description) {
      return res.status(400).json({
        success: false,
        error: 'Song title and description are required'
      });
    }

    const bountyData = {
      songTitle,
      artistName: artistName || 'Unknown',
      description,
      reward: reward || 0,
      deadline: deadline || null,
      createdBy: 'user_wallet_address',
      timestamp: new Date().toISOString()
    };

    const transactionId = await blockchainService.createBounty(bountyData);

    res.json({
      success: true,
      transactionId,
      message: 'Bounty created on blockchain',
      data: bountyData
    });

  } catch (error) {
    console.error('Bounty creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create bounty on blockchain',
      details: error.message
    });
  }
});

// Query blockchain for translations
router.get('/translations', async (req, res) => {
  try {
    const translations = await blockchainService.queryTranslations();
    
    res.json({
      success: true,
      count: translations.length,
      translations
    });

  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to query blockchain',
      details: error.message
    });
  }
});

// Get specific transaction data
router.get('/transaction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await blockchainService.getTransactionData(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      transactionId: id,
      data
    });

  } catch (error) {
    console.error('Transaction fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction data',
      details: error.message
    });
  }
});

module.exports = router;