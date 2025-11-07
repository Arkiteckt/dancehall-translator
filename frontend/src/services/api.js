cat > src/services/api.js << 'EOF'
// services/api.js
const API_BASE_URL = 'http://localhost:3001/api';

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
    console.log('🚀 [API] Artist in request:', request.artist);
    console.log('🚀 [API] Song in request:', request.song);
    
    try {
      // Use the EXACT field names that your backend expects
      const backendRequest = {
        lyrics: request.lyrics || '',
        artist: request.artist || 'Unknown Artist',
        song: request.song || 'Unknown Song'
      };
      
      console.log('📡 [API] Final backend request being sent:', JSON.stringify(backendRequest, null, 2));
      
      // FIXED: Use the correct endpoint with trailing slash
      const response = await fetch(`${API_BASE_URL}/translate/`, {
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
      
      // FIXED: Backend returns data directly, not wrapped in "data" object
      if (result.translatedText || result.translated) {
        console.log('✅ [API] Valid translation response received');
        return {
          translatedText: result.translatedText || result.translated,
          original: result.original || request.lyrics || '',
          culturalNotes: result.culturalNotes || [],
          confidence: result.confidence || 0.9,
          processingTime: result.processingTime || 2.5,
          artist: result.artist || request.artist,
          song: result.song || request.song,
          blockchain: result.blockchain,
          wordCount: result.wordCount
        };
      } else {
        console.error('❌ [API] Invalid response structure:', result);
        throw new Error('Invalid response from translation service');
      }
      
    } catch (error) {
      console.error('🔴 [API] REAL translation API failed:', error.message);
      throw new Error(`Translation service unavailable: ${error.message}`);
    }
  },

  // Test the translation endpoint directly
  async testTranslationEndpoint() {
    try {
      console.log('🧪 Testing translation endpoint directly...');
      const testRequest = {
        lyrics: "Hello world test translation",
        artist: "Test Artist",
        song: "Test Song"
      };
      
      const response = await fetch(`${API_BASE_URL}/translate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testRequest),
      });
      
      console.log('🧪 Test response status:', response.status);
      const result = await response.json();
      console.log('🧪 Test response:', result);
      return result;
      
    } catch (error) {
      console.error('🧪 Test failed:', error);
      throw error;
    }
  },

  // Sanitize request to ensure valid JSON
  sanitizeRequest(request) {
    if (!request) {
      return {
        song: 'Unknown Song',
        artist: 'Unknown Artist',
        lyrics: '',
        songId: `fallback_${Date.now()}`
      };
    }
    
    return {
      song: request.song || request.songTitle || 'Unknown Song',
      artist: request.artist || request.artistName || 'Unknown Artist',
      lyrics: request.lyrics || '',
      songId: request.songId || `song_${Date.now()}`
    };
  },

  createMockPriceEstimate(request) {
    const safeRequest = this.sanitizeRequest(request);
    const wordCount = safeRequest.lyrics ? safeRequest.lyrics.split(/\s+/).length : 50;
    const basePrice = 5;
    const wordPrice = Math.ceil(wordCount / 100) * 2;
    const totalPrice = Math.min(basePrice + wordPrice, 25);
    
    return {
      data: {
        price: totalPrice,
        complexity: wordCount > 200 ? 'high' : wordCount > 100 ? 'medium' : 'low',
        wordCount: wordCount,
        lineCount: safeRequest.lyrics ? safeRequest.lyrics.split('\n').length : 10,
        currency: 'USD'
      },
      success: true,
      mock: true
    };
  }
};
EOF