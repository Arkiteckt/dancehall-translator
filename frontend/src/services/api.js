// services/api.js
const API_BASE_URL = '/api';

export const translationAPI = {
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Backend health check successful:', result);
        return result;
      }
      throw new Error(`Health check failed: ${response.status}`);
    } catch (error) {
      console.warn('Health check failed:', error.message);
      return { status: 'ok', mock: true };
    }
  },

  async estimatePrice(request) {
    try {
      console.log('💰 Estimating price with real backend...', {
        lyricsLength: request.lyrics?.length,
        artist: request.artist,
        song: request.song
      });

      const response = await fetch(`${API_BASE_URL}/estimate-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lyrics: request.lyrics,
          artist: request.artist,
          song: request.song,
          complexity: request.complexity || 'medium'
        }),
      });
      
      console.log('📊 Price estimation response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Real price estimate result:', data);
        return data.data || data;
      }
      
      const errorText = await response.text();
      console.error('❌ Price estimation failed:', response.status, errorText);
      throw new Error(`Price estimation failed: ${response.status}`);
    } catch (error) {
      console.warn('Real API failed, using mock estimate:', error.message);
      return this.createMockPriceEstimate(request);
    }
  },

  async requestTranslation(request) {
    console.log('🚀 [API] Calling REAL backend translation...');
    console.log('🚀 [API] Full request object:', JSON.stringify(request, null, 2));
    
    try {
      const backendRequest = {
        lyrics: request.lyrics || '',
        artist: request.artist || 'Unknown Artist',
        song: request.song || 'Unknown Song'
      };
      
      console.log('📡 [API] Final backend request being sent:', JSON.stringify(backendRequest, null, 2));
      
      const response = await fetch(`${API_BASE_URL}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendRequest),
      });
      
      console.log('📡 [API] Translation response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [API] Translation failed:', response.status, errorText);
        throw new Error(`Translation failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('🟢 [API] REAL backend translation success - Full response:', result);
      
      return {
        translatedText: result.translatedText,
        original: result.original || request.lyrics || '',
        culturalNotes: result.culturalNotes || [],
        confidence: result.confidence || 0.9,
        processingTime: result.processingTime || 2.5,
        artist: result.artist || request.artist,
        song: result.song || request.song,
        wordCount: result.wordCount
      };
      
    } catch (error) {
      console.error('🔴 [API] REAL translation API failed:', error.message);
      throw new Error(`Translation service unavailable: ${error.message}`);
    }
  },

  createMockPriceEstimate(request) {
    const wordCount = request.lyrics ? request.lyrics.split(/\s+/).length : 50;
    const basePrice = 5;
    const wordPrice = Math.ceil(wordCount / 100) * 2;
    const totalPrice = Math.min(basePrice + wordPrice, 25);
    
    return {
      data: {
        price: totalPrice,
        complexity: wordCount > 200 ? 'high' : wordCount > 100 ? 'medium' : 'low',
        wordCount: wordCount,
        lineCount: request.lyrics ? request.lyrics.split('\n').length : 10,
        currency: 'USD'
      },
      success: true,
      mock: true
    };
  }
};
