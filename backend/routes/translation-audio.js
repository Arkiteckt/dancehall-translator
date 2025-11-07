require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

console.log('🎵 Audio route loaded');
console.log('🔑 Eleven Labs API Key available:', !!process.env.ELEVEN_LABS_API_KEY);

// Generate audio using Eleven Labs
router.post('/generate-audio', async (req, res) => {
  try {
    console.log('🔍 Audio request received');
    console.log('   ELEVEN_LABS_API_KEY exists:', !!process.env.ELEVEN_LABS_API_KEY);
    
    // Check if Eleven Labs API key is configured
    if (!process.env.ELEVEN_LABS_API_KEY) {
      console.log('❌ ERROR: No API key found in audio route');
      return res.status(500).json({
        success: false,
        message: 'Eleven Labs not configured - missing API key',
        debug: {
          keyExists: !!process.env.ELEVEN_LABS_API_KEY,
          nodeEnv: process.env.NODE_ENV
        }
      });
    }

    const { text, voiceId, stability, similarityBoost } = req.body;

    // Validate required fields
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }

    console.log('🎵 Making Eleven Labs API call...');

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || 'pNInz6obpgDQGcFmaJgB'}`,
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

    const audioBase64 = Buffer.from(response.data).toString('base64');
    
    console.log('✅ Audio generated successfully!');
    
    res.json({
      success: true,
      audioData: `data:audio/mpeg;base64,${audioBase64}`,
      voiceId: voiceId || 'pNInz6obpgDQGcFmaJgB'
    });

  } catch (error) {
    console.error('❌ Eleven Labs API error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate audio',
      details: error.response?.data || error.message
    });
  }
});

// Generate bilingual audio (both Patois and Portuguese)
router.post('/generate-bilingual', async (req, res) => {
  try {
    console.log('🔍 Bilingual audio request received');
    console.log('   ELEVEN_LABS_API_KEY exists:', !!process.env.ELEVEN_LABS_API_KEY);

    if (!process.env.ELEVEN_LABS_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Eleven Labs not configured'
      });
    }

    const { originalPatois, translatedPortuguese } = req.body;

    if (!originalPatois || !translatedPortuguese) {
      return res.status(400).json({
        success: false,
        error: 'Both originalPatois and translatedPortuguese are required'
      });
    }

    console.log('🎵 Making bilingual Eleven Labs API calls...');

    const [patoisResponse, portugueseResponse] = await Promise.all([
      // Patois audio with deeper voice
      axios.post(
        'https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB',
        {
          text: originalPatois,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.7
          }
        },
        {
          headers: {
            'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      ),
      // Portuguese audio with different voice
      axios.post(
        'https://api.elevenlabs.io/v1/text-to-speech/ThT5KcBeYPX3keUQqHPh',
        {
          text: translatedPortuguese,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8
          }
        },
        {
          headers: {
            'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      )
    ]);

    const patoisAudio = Buffer.from(patoisResponse.data).toString('base64');
    const portugueseAudio = Buffer.from(portugueseResponse.data).toString('base64');

    console.log('✅ Bilingual audio generated successfully!');

    res.json({
      success: true,
      patoisAudio: `data:audio/mpeg;base64,${patoisAudio}`,
      portugueseAudio: `data:audio/mpeg;base64,${portugueseAudio}`,
      combinedText: `${originalPatois}\n\n[TRANSLATION]\n\n${translatedPortuguese}`
    });

  } catch (error) {
    console.error('❌ Bilingual audio generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate bilingual audio',
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;
