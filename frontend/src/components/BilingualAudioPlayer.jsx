import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';

const BilingualAudioPlayer = ({ originalPatois, translatedPortuguese, onGenerateAudio }) => {
  const [patoisAudio, setPatoisAudio] = useState(null);
  const [portugueseAudio, setPortugueseAudio] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBilingualAudio = async () => {
    if (!originalPatois || !translatedPortuguese) {
      alert('Both original and translated text are required');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:3001/api/audio/generate-bilingual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalPatois,
          translatedPortuguese
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPatoisAudio(data.patoisAudio);
        setPortugueseAudio(data.portugueseAudio);
        if (onGenerateAudio) {
          onGenerateAudio(data);
        }
      } else {
        alert('Failed to generate audio: ' + data.error);
      }
    } catch (error) {
      console.error('Audio generation error:', error);
      alert('Failed to generate audio');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bilingual-audio" style={{ margin: '20px 0' }}>
      <h4>🎵 Audio Translation</h4>
      
      {(!patoisAudio || !portugueseAudio) && (
        <button 
          onClick={generateBilingualAudio}
          disabled={isGenerating}
          style={{
            padding: '10px 20px',
            backgroundColor: isGenerating ? '#ccc' : '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            marginBottom: '15px'
          }}
        >
          {isGenerating ? '🔄 Generating Audio...' : '🎵 Generate Audio Translation'}
        </button>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        <div>
          <h5>🇯🇲 Original Patois</h5>
          <AudioPlayer 
            audioData={patoisAudio} 
            label="Listen to Patois" 
          />
        </div>
        
        <div>
          <h5>🇧🇷 Portuguese Translation</h5>
          <AudioPlayer 
            audioData={portugueseAudio} 
            label="Listen to Portuguese" 
          />
        </div>
      </div>
    </div>
  );
};

export default BilingualAudioPlayer;
