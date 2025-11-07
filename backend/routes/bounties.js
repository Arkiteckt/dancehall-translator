const express = require('express');
const router = express.Router();

// Create a new bounty
router.post('/create', async (req, res) => {
  try {
    const { songId, songTitle, originalLyrics, aiTranslation, flaggedLines, bountyAmount, currency } = req.body;

    // Mock bounty creation
    const bounty = {
      id: `bounty_${Date.now()}`,
      songId: songId || 'unknown',
      songTitle: songTitle || 'Unknown Song',
      originalLyrics: originalLyrics || '',
      aiTranslation: aiTranslation || '',
      flaggedLines: flaggedLines || [],
      bountyAmount: bountyAmount || 5,
      currency: currency || 'USDC',
      status: 'open',
      createdAt: new Date().toISOString(),
      createdBy: req.body.userAddress || 'anonymous'
    };

    console.log('✅ Bounty created:', bounty.id);
    
    res.status(201).json({
      success: true,
      data: bounty
    });
    
  } catch (error) {
    console.error('Error creating bounty:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create bounty'
    });
  }
});

// Get all bounties
router.get('/', async (req, res) => {
  try {
    // Mock bounties
    const bounties = [
      {
        id: 'bounty_1',
        songTitle: 'Sample Dancehall Song',
        bountyAmount: 10,
        currency: 'USDC',
        status: 'open',
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: bounties
    });
  } catch (error) {
    console.error('Error fetching bounties:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch bounties' 
    });
  }
});

// Get specific bounty
router.get('/:id', async (req, res) => {
  try {
    const bounty = {
      id: req.params.id,
      songTitle: 'Sample Song',
      bountyAmount: 10,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: bounty
    });
  } catch (error) {
    console.error('Error fetching bounty:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch bounty' 
    });
  }
});

module.exports = router;
