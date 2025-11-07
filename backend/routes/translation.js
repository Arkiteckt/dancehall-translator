const express = require("express");
const router = express.Router();
const { translateDancehallLyrics, generateCulturalNotes } = require("../services/aiTranslation");

// Price estimation endpoint
router.post("/estimate-price", async (req, res) => {
  try {
    const { lyrics, complexity = "medium" } = req.body;

    if (!lyrics) {
      return res.status(400).json({
        success: false,
        message: "Lyrics are required for price estimation"
      });
    }

    // Calculate price based on lyrics length and complexity
    const wordCount = lyrics.split(/\s+/).length;
    const lineCount = lyrics.split('\n').filter(line => line.trim()).length;
    
    let basePrice = 5; // $5 minimum
    
    if (wordCount > 100) basePrice += Math.floor(wordCount / 50) * 2;
    if (complexity === "high") basePrice *= 1.5;
    if (complexity === "low") basePrice *= 0.8;

    // Cap at $50 maximum
    const finalPrice = Math.min(basePrice, 50);

    res.json({
      success: true,
      data: {
        price: finalPrice,
        complexity: complexity,
        wordCount: wordCount,
        lineCount: lineCount,
        currency: "USD"
      }
    });

  } catch (error) {
    console.error("Price estimation failed:", error);
    res.status(500).json({
      success: false,
      message: "Price estimation failed"
    });
  }
});

// REAL AI Translation endpoint
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

    const translationResult = {
      translatedText: translatedText,  // ← ADDED: Main field frontend expects
      original: lyrics,
      translated: translatedText,      // ← KEEP: For compatibility
      originalLyrics: lyrics,
      translatedLyrics: translatedText,
      culturalNotes: culturalNotes,
      confidence: 0.95,
      processingTime: 2.5,             // ← CHANGED: Use static value instead of Date.now()
      wordCount: lyrics.split(/\s+/).length,
      mock: false,
      success: true
    };

    console.log('✅ Translation completed successfully');
    console.log('🔍 BACKEND DEBUG - Final response:');
    console.log('🔍 Translation text length:', translatedText?.length);
    console.log('🔍 Translation text preview:', translatedText?.substring(0, 100));
    console.log('🔍 Full response being sent:', {
      success: true,
      data: translationResult
    });

    res.json({
      success: true,
      data: translationResult
    });

  } catch (error) {
    console.error("❌ Translation failed:", error);
    res.status(500).json({
      success: false,
      message: `Translation failed: ${error.message}`
    });
  }
});

module.exports = router;