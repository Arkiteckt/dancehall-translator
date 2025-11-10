import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { CheckCircle, Music, RotateCcw, Download, Users, ArrowLeft } from 'lucide-react';

const ResultContainer = styled(motion.div)`
  background: #0f0f0f;
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid #2a2a2a;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const SuccessHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const SuccessIcon = styled.div`
  width: 60px;
  height: 60px;
  background: #00d4aa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: #000;
`;

const SuccessTitle = styled.h2`
  color: #ffffff;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const SuccessSubtitle = styled.p`
  color: #888;
  font-size: 1rem;
`;

const ContentSection = styled.div`
  margin: 1.5rem 0;
`;

const SectionTitle = styled.h3`
  color: #ffffff;
  border-bottom: 2px solid #00d4aa;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
`;

const LyricsBox = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 1.5rem;
  white-space: pre-wrap;
  line-height: 1.6;
  font-family: 'Inter', sans-serif;
  max-height: 300px;
  overflow-y: auto;
  color: #ffffff;
  border: 1px solid #2a2a2a;
  font-size: 0.95rem;
  min-height: 100px;
`;

const NotesList = styled.ul`
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 1.5rem;
  list-style: none;
`;

const NoteItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #2a2a2a;
  color: #ffffff;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
`;

const NewTranslationButton = styled(Button)`
  background: #00d4aa;
  color: #000;
  
  &:hover {
    background: #00b894;
  }
`;

const DownloadButton = styled(Button)`
  background: #1a1a1a;
  color: #ffffff;
  border: 1px solid #2a2a2a;
  
  &:hover {
    background: #2a2a2a;
  }
`;

const HumanReviewButton = styled(Button)`
  background: #ff6b35;
  color: white;
  
  &:hover {
    background: #e55a2b;
  }
`;

const BackButton = styled(Button)`
  background: #1a1a1a;
  color: #888;
  border: 1px solid #2a2a2a;
  
  &:hover {
    background: #2a2a2a;
    color: #ffffff;
  }
`;

// ULTIMATE DEBUG COMPONENT
const DebugInfo = styled.div`
  background: #ff4444;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 2px solid #ff0000;
  font-family: monospace;
  font-size: 0.8rem;
`;

function TranslationResult({ 
  request, 
  result, 
  onNewTranslation, 
  onRequestHumanReview,  // FIXED PROP NAME
  onBack
}) {
  // ULTIMATE DEBUGGING

  const downloadTranslation = () => {
    // FIXED: Use the correct data structure
    const originalLyrics = request?.lyrics || 'No lyrics available';
    const translatedLyrics = result?.translatedText || result?.translated || result?.translation || 'No translation available';
    
    const content = `
Dancehall Translator - Translation
===================================

Artist: ${request?.artist || 'Unknown Artist'}
Song: ${request?.song || 'Unknown Song'}
${request?.year ? `Year: ${request.year}` : ''}

ORIGINAL LYRICS (PATIOS):
${originalLyrics}

TRANSLATION (BRAZILIAN PORTUGUESE):
${translatedLyrics}

${result?.culturalNotes && result.culturalNotes.length > 0 ? 
`CULTURAL NOTES:
${result.culturalNotes.map(note => `• ${note}`).join('\n')}` : ''}

Translated by Dancehall Translator
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation-${request?.artist || 'unknown'}-${request?.song || 'unknown'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // FIXED: Use the actual API response structure
  const originalLyrics = request?.lyrics || 'Original lyrics not available';
  const translatedLyrics = result?.translatedText || result?.translated || result?.translation || 'Translation not available';


  return (
    <ResultContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* ULTIMATE DEBUG INFO */}
      <DebugInfo>
        <div><strong>🎵 ULTIMATE DEBUG TranslationResult ��</strong></div>
        <div>Has Result: {result ? 'YES' : 'NO'}</div>
        <div>Original: {originalLyrics.length} chars</div>
        <div>Translated: {translatedLyrics.length} chars</div>
        <div>Result Keys: {result ? Object.keys(result).join(', ') : 'NONE'}</div>
        <div>Original Preview: "{originalLyrics.substring(0, 50)}..."</div>
        <div>Translated Preview: "{translatedLyrics.substring(0, 50)}..."</div>
        <div>Has translatedText: {result?.translatedText ? 'YES' : 'NO'}</div>
        <div>Has onRequestHumanReview: {onRequestHumanReview ? 'YES' : 'NO'}</div>
      </DebugInfo>

      <SuccessHeader>
        <SuccessIcon>
          <CheckCircle size={24} />
        </SuccessIcon>
        <SuccessTitle>Translation Complete!</SuccessTitle>
        <SuccessSubtitle>
          Your translation of <strong>{request?.artist || 'Unknown Artist'} - {request?.song || 'Unknown Song'}</strong> is ready
        </SuccessSubtitle>
      </SuccessHeader>

      {/* ORIGINAL LYRICS - WITH FORCED VISIBILITY */}
      <ContentSection>
        <SectionTitle>
          <Music size={18} />
          Original Lyrics (Patois)
        </SectionTitle>
        <LyricsBox style={{ 
          border: '3px solid #00ff00',
          background: originalLyrics.includes('not available') ? '#ff0000' : '#1a1a1a'
        }}>
          {originalLyrics}
        </LyricsBox>
      </ContentSection>

      {/* TRANSLATED LYRICS - WITH FORCED VISIBILITY */}
      <ContentSection>
        <SectionTitle>Translation to Brazilian Portuguese</SectionTitle>
        <LyricsBox style={{ 
          border: '3px solid #00ff00',
          background: translatedLyrics.includes('not available') ? '#ff0000' : '#1a1a1a'
        }}>
          {translatedLyrics}
        </LyricsBox>
      </ContentSection>

      {/* CULTURAL NOTES */}
      {result?.culturalNotes && result.culturalNotes.length > 0 && (
        <ContentSection>
          <SectionTitle>Cultural Notes</SectionTitle>
          <NotesList>
            {result.culturalNotes.map((note, index) => (
              <NoteItem key={index}>• {note}</NoteItem>
            ))}
          </NotesList>
        </ContentSection>
      )}

      <ActionButtons>
        <DownloadButton
          onClick={downloadTranslation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download size={16} />
          Download Translation
        </DownloadButton>

        <BackButton
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </BackButton>
        
        <HumanReviewButton
          onClick={() => onRequestHumanReview(result?.translatedText)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Users size={16} />
          Request Human Review
        </HumanReviewButton>
        
        <NewTranslationButton
          onClick={onNewTranslation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw size={16} />
          New Translation
        </NewTranslationButton>
      </ActionButtons>
    </ResultContainer>
  );
}

export default TranslationResult;
