const express = require("express");
const router = express.Router();
const { translateDancehallLyrics, generateCulturalNotes } = require("../services/aiTranslation");
const blockchainOrchestrator = require("../services/blockchainOrchestrator");

console.log('✅ Translation routes loading...');

// Price estimation endpoint (keep existing)
router.post("/estimate-price", async (req, res) => {
  // ... keep your existing price estimation code
});

// REAL AI Translation endpoint - UPDATED FOR DUAL BLOCKCHAIN
router.post("/", async (req, res) => {
  try {
    const { lyrics, artist, song } = req.body;

    if (!lyrics) {
      return res.status(400).json({
        success: false,
        message: "Lyrics are required"
      });
    }

    console.log(`🎵 Received translation request: ${artist || 'Unknown Artist'} - ${song || 'Unknown Song'}`);

    // Use real AI translation
    const translatedText = await translateDancehallLyrics(lyrics, artist, song);
    const culturalNotes = generateCulturalNotes(lyrics, translatedText);

    // 🆕 DUAL BLOCKCHAIN STORAGE
    let blockchainResult = null;
    try {
      console.log('🌐 Storing on dual blockchains...');
      
      const blockchainData = {
        originalText: lyrics,
        translatedText: translatedText,
        artist: artist || 'Unknown Artist',
        song: song || 'Unknown Song',
        timestamp: new Date().toISOString(),
        language: 'portuguese',
        wordCount: lyrics.split(/\s+/).length
      };
      
      blockchainResult = await blockchainOrchestrator.storeTranslation(blockchainData);
      console.log('✅ Dual blockchain storage successful');
      
    } catch (blockchainError) {
      console.warn('⚠️ Blockchain storage failed, but translation completed:', blockchainError.message);
      blockchainResult = {
        error: blockchainError.message,
        status: 'failed'
      };
    }

    // Return translation data directly
    const response = {
      success: true,
      original: lyrics,
      translatedText: translatedText,
      translated: translatedText,
      culturalNotes: culturalNotes,
      confidence: 0.95,
      processingTime: 2.5,
      wordCount: lyrics.split(/\s+/).length,
      artist: artist,
      song: song,
      blockchain: blockchainResult, // 🆕 Now contains both Arweave and Arc data
      timestamp: new Date().toISOString()
    };

    console.log('✅ Translation completed successfully');
    console.log('�� Blockchain results:', blockchainResult);

    res.json(response);

  } catch (error) {
    console.error("❌ Translation failed:", error);
    res.status(500).json({
      success: false,
      message: `Translation failed: ${error.message}`
    });
  }
});

// 🆕 ADD BLOCKCHAIN STATUS ENDPOINT
router.get("/blockchain-status", async (req, res) => {
  try {
    const status = await blockchainOrchestrator.getStatus();
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Translation service is running",
    timestamp: new Date().toISOString()
  });
});

console.log('✅ Translation routes loaded successfully');

module.exports = router;
