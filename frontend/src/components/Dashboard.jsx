import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Play, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTranslation } from '../translations';

const DashboardContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const HeroSection = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #00d4aa, #0099ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #888;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #00d4aa;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #888;
  font-size: 0.9rem;
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, #00d4aa, #0099ff);
  border: none;
  color: #000;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 212, 170, 0.3);
  }
`;

const LanguageInfo = styled.div`
  background: rgba(0, 157, 255, 0.1);
  border: 1px solid #0099ff;
  border-radius: 8px;
  padding: 1rem;
  margin: 2rem auto;
  max-width: 500px;
  color: #0099ff;
`;

function Dashboard({ onStartTranslation, userAddress }) {
  const { language, isPortuguese } = useLanguage();

  return (
    <DashboardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection>
        <Title>Dancehall Translator</Title>
        <Subtitle>
          {getTranslation('tagline', language)}
        </Subtitle>
        
        <LanguageInfo>
          <Globe size={20} style={{ marginBottom: '0.5rem' }} />
          <div>
            <strong>Current Language:</strong> {isPortuguese ? 'Português Brasileiro' : 'English'}
          </div>
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
            {isPortuguese 
              ? 'Clique no botão "EN/PT" no cabeçalho para mudar o idioma' 
              : 'Click the "EN/PT" button in the header to switch languages'
            }
          </div>
        </LanguageInfo>
      </HeroSection>

      <StatsGrid>
        <StatCard>
          <StatNumber>AI</StatNumber>
          <StatLabel>{getTranslation('translation', language)}</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>24/7</StatNumber>
          <StatLabel>{isPortuguese ? 'Disponível' : 'Available'}</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>USDC</StatNumber>
          <StatLabel>{isPortuguese ? 'Pagamento' : 'Payments'}</StatLabel>
        </StatCard>
      </StatsGrid>

      <CTAButton
        onClick={onStartTranslation}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Play size={20} />
        {getTranslation('startTranslation', language)}
      </CTAButton>
    </DashboardContainer>
  );
}

export default Dashboard;
