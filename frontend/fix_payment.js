const handlePaymentComplete = async () => {
  console.log('🔵 handlePaymentComplete started');
  console.log('🔵 translationRequest:', translationRequest);
  
  if (!translationRequest) {
    console.error('❌ translationRequest is null or undefined!');
    alert('Translation request data is missing. Please start over.');
    setIsLoading(false);
    return;
  }

  // Create a safe request object with fallbacks
  const safeRequest = {
    artist: translationRequest.artist || 'Unknown Artist',
    song: translationRequest.song || 'Unknown Song',
    year: translationRequest.year || '',
    lyrics: translationRequest.lyrics || ''
  };

  console.log('🟡 Using safe request:', safeRequest);
  setIsLoading(true);
  
  try {
    console.log('🔵 Calling translationAPI.requestTranslation...');
    const apiResult = await translationAPI.requestTranslation(safeRequest);
    console.log('🟢 Translation API returned:', apiResult);
    
    // IMPROVED: Handle different API response structures
    let translatedText = '';
    
    if (typeof apiResult === 'string') {
      translatedText = apiResult;
    } else if (apiResult.translatedText) {
      translatedText = apiResult.translatedText;
    } else if (apiResult.translation) {
      translatedText = apiResult.translation;
    } else if (apiResult.translated) {
      translatedText = apiResult.translated;
    } else {
      console.warn('Unexpected API response structure:', apiResult);
      translatedText = JSON.stringify(apiResult);
    }
    
    const formattedResult = {
      original: safeRequest.lyrics || "Original lyrics not available",
      translated: translatedText || "Translation not available",
      culturalNotes: apiResult?.culturalNotes || [
        "Translation provided by AI",
        "Cultural context may vary",
        "Some expressions may have multiple interpretations"
      ]
    };
    
    console.log('🟢 Setting formatted translation result:', formattedResult);
    setTranslationResult(formattedResult);
    
    setCurrentSongData({
      id: `song_${Date.now()}`,
      title: safeRequest.song,
      artist: safeRequest.artist,
      originalLyrics: safeRequest.lyrics,
      translation: formattedResult.translated
    });
    
    setCurrentView('result');
    console.log('🟢 Navigation to result view');
  } catch (error) {
    console.error('🔴 Translation failed:', error);
    
    console.log('🟡 Using enhanced fallback mock data');
    const mockResult = {
      original: safeRequest.lyrics || `Gal a mad ova mi, gal a mad ova mi\nMi nah go change fi nuh gyal`,
      translated: `A garota está louca por mim, a garota está louca por mim\nEu não vou mudar por nenhuma garota`,
      culturalNotes: [
        "Gal a mad ova mi - A garota está louca por mim",
        "Mi nah go change - Eu não vou mudar",
        "Translation provided as fallback - API call failed"
      ]
    };
    
    setTranslationResult(mockResult);
    setCurrentView('result');
  } finally {
    setIsLoading(false);
  }
};
