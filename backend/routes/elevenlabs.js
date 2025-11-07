const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/generate-audio', async (req, res) => {
  try {
    const { text, voiceId, stability, similarityBoost } = req.body;

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: stability || 0.5,
          similarity_boost: similarityBoost || 0.8
        }
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    // Convert to base64 for safe transmission
    const audioBase64 = Buffer.from(response.data).toString('base64');
    
    res.json({
      success: true,
      audioData: `data:audio/mpeg;base64,${audioBase64}`
    });

  } catch (error) {
    console.error('Eleven Labs API error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate audio'
    });
  }
});

module.exports = router;