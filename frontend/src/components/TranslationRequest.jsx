import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, Music, User, Calendar, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

const RequestContainer = styled(motion.div)`
  max-width: 600px;
  margin: 0 auto;
`;

const BackButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #2a2a2a;
  color: #888;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: #2a2a2a;
    color: #ffffff;
  }
`;

const FormCard = styled.div`
  background: #0f0f0f;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #2a2a2a;
`;

const FormTitle = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00d4aa;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 1rem;
  min-height: 200px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00d4aa;
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #00d4aa, #0099ff);
  border: none;
  color: #000;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function TranslationRequest({ onSubmit, backendStatus, userAddress, onBack }) {
  const [formData, setFormData] = useState({
    artist: '',
    song: '',
    year: '',
    lyrics: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.artist.trim() || !formData.song.trim() || !formData.lyrics.trim()) {
      alert(getTranslation('error', language) + ': ' + (language === 'pt' ? 'Preencha todos os campos obrigatórios' : 'Please fill in all required fields'));
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        id: `req_${Date.now()}`
      });
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <RequestContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BackButton
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={16} />
        {getTranslation('backToDashboard', language)}
      </BackButton>

      <FormCard>
        <FormTitle>
          <Music size={24} />
          {getTranslation('startTranslation', language)}
        </FormTitle>

        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>
              <User size={16} />
              {getTranslation('artistName', language)} *
            </Label>
            <Input
              type="text"
              value={formData.artist}
              onChange={(e) => handleInputChange('artist', e.target.value)}
              placeholder={language === 'pt' ? 'Ex: Vybz Kartel' : 'Ex: Vybz Kartel'}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>
              <Music size={16} />
              {getTranslation('songTitle', language)} *
            </Label>
            <Input
              type="text"
              value={formData.song}
              onChange={(e) => handleInputChange('song', e.target.value)}
              placeholder={language === 'pt' ? 'Ex: Fever' : 'Ex: Fever'}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>
              <Calendar size={16} />
              {getTranslation('releaseYear', language)}
            </Label>
            <Input
              type="number"
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              placeholder={language === 'pt' ? 'Ex: 2010' : 'Ex: 2010'}
              min="1900"
              max="2024"
            />
          </InputGroup>

          <InputGroup>
            <Label>
              <FileText size={16} />
              {getTranslation('pasteLyrics', language)} *
            </Label>
            <TextArea
              value={formData.lyrics}
              onChange={(e) => handleInputChange('lyrics', e.target.value)}
              placeholder={language === 'pt' ? 'Cole a letra original em Patois Jamaicano aqui...' : 'Paste the original lyrics in Jamaican Patois here...'}
              required
            />
          </InputGroup>

          <SubmitButton
            type="submit"
            disabled={isLoading || backendStatus !== 'connected'}
            whileHover={!isLoading && backendStatus === 'connected' ? { scale: 1.02 } : {}}
            whileTap={!isLoading && backendStatus === 'connected' ? { scale: 0.98 } : {}}
          >
            {isLoading ? getTranslation('estimatingPrice', language) : getTranslation('translate', language)}
          </SubmitButton>
        </form>
      </FormCard>
    </RequestContainer>
  );
}

export default TranslationRequest;
