const express = require('express');
const router = express.Router();
const Bounty = require('../models/Bounty');

// Create a new bounty
router.post('/create', async (req, res) => {
  try {
    const { songId, songTitle, originalLyrics, aiTranslation, flaggedLines, bountyAmount, currency } = req.body;

    const bounty = await Bounty.create({
      songId,
      songTitle,
      originalLyrics,
      aiTranslation,
      flaggedLines,
      bountyAmount,
      currency,
      status: 'open'
    });

    console.log('Bounty created:', bounty._id);
    
    res.status(201).json({
      success: true,
      data: bounty
    });
    
  } catch (error) {
    console.error('Error creating bounty:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Get all bounties
router.get('/', async (req, res) => {
  try {
    const bounties = await Bounty.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: bounties
    });
  } catch (error) {
    console.error('Error fetching bounties:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Update a bounty
router.put('/:id', async (req, res) => {
  try {
    const { humanTranslation, culturalNotes, status } = req.body;
    
    const bounty = await Bounty.findByIdAndUpdate(
      req.params.id,
      { 
        humanTranslation, 
        culturalNotes, 
        status,
        ...(status === 'completed' && { completedAt: new Date() })
      },
      { new: true }
    );

    if (!bounty) {
      return res.status(404).json({
        success: false,
        message: 'Bounty not found'
      });
    }

    res.json({
      success: true,
      data: bounty
    });
  } catch (error) {
    console.error('Error updating bounty:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

module.exports = router;