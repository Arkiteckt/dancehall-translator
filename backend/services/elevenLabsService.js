const axios = require('axios');

class ElevenLabsService {
  constructor() {
    this.apiKey = process.env.ELEVEN_LABS_API_KEY;
    this.baseURL = 'https://api.elevenlabs.io/v1';
    this.client = null;
    this.initialized = false;
  }

  initialize() {
    if (!this.apiKey) {
      console.warn('⚠️ Eleven Labs API key not configured');
      return;
    }

    try {
      this.client = axios.create({
        baseURL: this.baseURL,
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        }
      });
      this.initialized = true;
      console.log('✅ Eleven Labs service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Eleven Labs:', error);
    }
  }

  // Generate audio for translated lyrics
  async generateTranslationAudio(text, voiceId = '21m00Tcm4TlvDq8ikWAM', stability = 0.5, similarityBoost = 0.8) {
    if (!this.initialized) this.initialize();
    if (!this.client) {
      throw new Error('Eleven Labs not configured - missing API key');
    }

    try {
      console.log(`🎵 Generating audio for: "${text.substring(0, 50)}..."`);
      
      // REAL API CALL - no more mock data!
      const response = await this.client.post(`/text-to-speech/${voiceId}`, {
        text: text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: stability,
          similarity_boost: similarityBoost
        }
      }, {
        responseType: 'arraybuffer'
      });
      
      console.log('✅ Audio generated successfully!');
      return response.data;

    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    }
  }

  // Generate audio for original Patois lyrics
  async generatePatoisAudio(text) {
    // Use a deeper voice for Patois
    return this.generateTranslationAudio(text, 'pNInz6obpgDQGcFmaJgB', 0.6, 0.7);
  }

  // Generate side-by-side comparison audio
  async generateBilingualAudio(originalPatois, translatedPortuguese) {
    if (!this.initialized) this.initialize();

    try {
      const [patoisAudio, portugueseAudio] = await Promise.all([
        this.generatePatoisAudio(originalPatois),
        this.generateTranslationAudio(translatedPortuguese, 'ThT5KcBeYPX3keUQqHPh') // Different voice for Portuguese
      ]);

      return {
        patoisAudio,
        portugueseAudio,
        combinedText: `${originalPatois}\n\n[TRANSLATION]\n\n${translatedPortuguese}`
      };
    } catch (error) {
      console.error('Error generating bilingual audio:', error);
      throw error;
    }
  }

  // Generate cultural explanation audio
  async generateCulturalNotesAudio(culturalNotes) {
    if (!this.initialized) this.initialize();

    const notesText = culturalNotes.map(note => `• ${note}`).join('\n');
    const fullText = `Cultural Notes:\n\n${notesText}`;
    
    return this.generateTranslationAudio(fullText, 'AZnzlk1XvdvUeBnXmlld', 0.7, 0.8);
  }

  // Get available voices
  async getAvailableVoices() {
    if (!this.initialized) this.initialize();
    if (!this.client) return [];

    try {
      // REAL API CALL to get voices
      const response = await this.client.get('/voices');
      return response.data.voices;
    } catch (error) {
      console.error('Error fetching voices:', error);
      // Fallback to mock voices if API fails
      return [
        {
          id: '21m00Tcm4TlvDq8ikWAM',
          name: 'Rachel',
          category: 'premade',
          description: 'Clear and professional female voice'
        },
        {
          id: 'pNInz6obpgDQGcFmaJgB', 
          name: 'Adam',
          category: 'premade',
          description: 'Deep male voice - good for Patois'
        },
        {
          id: 'ThT5KcBeYPX3keUQqHPh',
          name: 'Lia',
          category: 'premade', 
          description: 'Warm female voice - good for Portuguese'
        }
      ];
    }
  }

  // Check if service is configured
  isConfigured() {
    return !!this.apiKey && this.initialized;
  }
}

module.exports = new ElevenLabsService();