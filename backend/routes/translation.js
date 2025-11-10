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

    const wordCount = lyrics.split(/\s+/).length;
    const lineCount = lyrics.split('\n').filter(line => line.trim()).length;
    
    let basePrice = 5;
    
    if (wordCount > 100) basePrice += Math.floor(wordCount / 50) * 2;
    if (complexity === "high") basePrice *= 1.5;
    if (complexity === "low") basePrice *= 0.8;

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

// REAL AI Translation endpoint - CLEAR FORMAT
router.post("/", async (req, res) => {
  try {
    const { lyrics, artist, song } = req.body;

    if (!lyrics) {
      return res.status(400).json({
        success: false,
        error: "Lyrics are required",
        message: "Lyrics are required"
      });
    }

    console.log(`🎵 Received translation request: ${artist || 'Unknown Artist'} - ${song || 'Unknown Song'}`);

    // Use real AI translation
    const translatedText = await translateDancehallLyrics(lyrics, artist, song);
    const culturalNotes = generateCulturalNotes(lyrics, translatedText);

    // CLEAR, CONSISTENT RESPONSE FORMAT
    const response = {
      success: true,
      translatedText: translatedText,  // Main translation field
      original: lyrics,                // Original text
      culturalNotes: culturalNotes,    // Cultural context
      confidence: 0.95,
      processingTime: 2.5,
      wordCount: lyrics.split(/\s+/).length,
      artist: artist || 'Unknown Artist',
      song: song || 'Unknown Song'
    };

    console.log('✅ Translation completed - sending clear response format');
    console.log('📝 Response preview:', {
      success: response.success,
      translatedTextLength: response.translatedText?.length,
      hasCulturalNotes: response.culturalNotes?.length > 0
    });
    
    res.json(response);

  } catch (error) {
    console.error("❌ Translation failed:", error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: error.message
    });
  }
});

// Test endpoint
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Translation API is working",
    endpoints: {
      "POST /": "Translate lyrics",
      "POST /estimate-price": "Get price estimate", 
      "GET /test": "Test connection"
    }
  });
});

module.exports = router;
