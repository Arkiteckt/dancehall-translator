const express = require('express');
const router = express.Router();
const blockchainService = require('../services/blockchainService');

// Test blockchain connection
router.get('/status', async (req, res) => {
    try {
        const status = await blockchainService.getStatus();
        res.json({
            success: true,
            blockchain: status,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get transaction by ID
router.get('/transaction/:id', async (req, res) => {
    try {
        res.json({
            success: true,
            transactionId: req.params.id,
            status: 'stored',
            url: `https://arweave.net/${req.params.id}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
