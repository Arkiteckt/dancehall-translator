const express = require("express");
const router = express.Router();

// Price estimation endpoint at /api/estimate-price
router.post("/", async (req, res) => {
  try {
    console.log("📊 Price estimation request received:", JSON.stringify(req.body, null, 2));
    
    let lyrics = req.body.lyrics;
    let complexity = req.body.complexity || "medium";

    // If lyrics is not at the top level, check if it's nested in translation data
    if (!lyrics && req.body.translationData) {
      lyrics = req.body.translationData.lyrics;
      complexity = req.body.translationData.complexity || complexity;
    }

    // If still no lyrics, check the entire body as fallback
    if (!lyrics) {
      // Try to find any string field that might contain lyrics
      for (let key in req.body) {
        if (typeof req.body[key] === 'string' && req.body[key].length > 0) {
          lyrics = req.body[key];
          console.log(`🔍 Found lyrics in field: ${key}`);
          break;
        }
      }
    }

    console.log("📝 Extracted data:", { lyrics, complexity });

    if (!lyrics) {
      console.log("❌ No lyrics found in request. Available fields:", Object.keys(req.body));
      return res.status(400).json({
        success: false,
        message: "Lyrics are required for price estimation. Please provide a 'lyrics' field.",
        receivedFields: Object.keys(req.body)
      });
    }

    // Calculate price based on lyrics length and complexity
    const wordCount = lyrics.split(/\s+/).length;
    const lineCount = lyrics.split('\n').filter(line => line.trim()).length;
    
    let basePrice = 2; // $2 minimum
    
    if (wordCount > 100) basePrice += Math.floor(wordCount / 50) * 2;
    if (complexity === "high") basePrice *= 1.5;
    if (complexity === "low") basePrice *= 0.8;

    // Cap at $50 maximum
    const finalPrice = Math.min(basePrice, 50);

    console.log(`💰 Price calculated: $${finalPrice} for ${wordCount} words, ${lineCount} lines`);

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
    console.error("❌ Price estimation failed:", error);
    res.status(500).json({
      success: false,
      message: "Price estimation failed: " + error.message
    });
  }
});

module.exports = router;
