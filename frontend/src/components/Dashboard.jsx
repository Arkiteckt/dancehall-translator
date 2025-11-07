import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  color: white;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Title = styled.h1`
  font-size: 3rem;
  background: linear-gradient(135deg, #00d4aa 0%, #0099ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #888;
  font-size: 1.2rem;
  margin-bottom: 3rem;
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, #00d4aa 0%, #0099ff 100%);
  color: black;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.1rem;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Dashboard = ({ onStartTranslation, userAddress }) => {
  return (
    <Container>
      <Title>Dancehall Translator</Title>
      <Subtitle>
        AI-powered translations for your favorite dancehall songs
      </Subtitle>
      
      <Button
        onClick={onStartTranslation}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start New Translation
      </Button>

      {userAddress && (
        <div style={{ marginTop: '3rem', color: '#666' }}>
          <p>Connected: {userAddress.slice(0, 10)}...{userAddress.slice(-8)}</p>
        </div>
      )}
    </Container>
  );
};

export default Dashboard;
