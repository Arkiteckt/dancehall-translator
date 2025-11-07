import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ 
  textToSpeak, 
  audioData, 
  label = "Audio", 
  onAudioGenerated,
  voiceId = "21m00Tcm4TlvDq8ikWAM", // Default voice - adjust as needed
  language = "pt" // or "en" for English
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Reset playing state when audioData changes
  useEffect(() => {
    setIsPlaying(false);
  }, [audioData]);

  const generateAudioWithElevenLabs = async (text) => {
    try {
      // Call your backend API that integrates with ElevenLabs
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voiceId: voiceId,
          language: language,
          // Add any other ElevenLabs parameters you need
          stability: 0.5,
          similarity_boost: 0.5
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Audio generation failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;

    } catch (error) {
      console.error('ElevenLabs API error:', error);
      throw error;
    }
  };

  const handlePlay = async () => {
    setError(null);
    
    if (!audioData) {
      if (!textToSpeak) {
        setError('No text provided for audio generation');
        return;
      }
      
      setIsLoading(true);
      try {
        // REAL ELEVENLABS IMPLEMENTATION
        const audioUrl = await generateAudioWithElevenLabs(textToSpeak);
        
        // Notify parent component about the generated audio
        if (onAudioGenerated) {
          onAudioGenerated(audioUrl);
        }
      } catch (error) {
        setError(error.message || 'Failed to generate audio');
        console.error('Audio generation error:', error);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Play existing audio
    try {
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      setError('Failed to play audio');
      console.error('Audio play error:', error);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const handleAudioError = () => {
    setError('Audio playback failed');
    setIsPlaying(false);
  };

  return (
    <div className="audio-player" style={{ margin: '10px 0', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={handlePlay}
          disabled={isLoading || (!audioData && !textToSpeak)}
          style={{
            padding: '8px 16px',
            backgroundColor: isLoading ? '#ccc' : error ? '#ff6b6b' : isPlaying ? '#ff4757' : '#2ed573',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (isLoading || (!audioData && !textToSpeak)) ? 'not-allowed' : 'pointer',
            minWidth: '120px'
          }}
        >
          {isLoading ? '🔄' : isPlaying ? '⏸️' : '▶️'} {label}
        </button>
        
        {audioData && (
          <audio
            ref={audioRef}
            src={audioData}
            onEnded={handleAudioEnd}
            onPause={handleAudioEnd}
            onError={handleAudioError}
            style={{ display: 'none' }}
          />
        )}
        
        <span style={{ 
          fontSize: '14px', 
          color: error ? '#ff6b6b' : '#666',
          minWidth: '150px'
        }}>
          {error 
            ? error 
            : isLoading 
              ? 'Generating audio with ElevenLabs...' 
              : audioData 
                ? (isPlaying ? 'Playing...' : 'Ready to play') 
                : textToSpeak 
                  ? 'Click to generate audio' 
                  : 'No text available'
          }
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;