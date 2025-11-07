import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ChevronRight, ExternalLink, Check, Shield, Zap } from 'lucide-react';

const ConnectContainer = styled(motion.div)`
  min-height: 100vh;
  background: #0a0b0d;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ConnectCard = styled(motion.div)`
  background: #1a1d23;
  border: 1px solid #2a2f3a;
  border-radius: 24px;
  padding: 3rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const Logo = styled.div`
  margin-bottom: 2rem;
`;

const LogoText = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
`;

const LogoSubtitle = styled.p`
  color: #8f9bb3;
  font-size: 1.1rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 2rem 0;
`;

const Feature = styled.div`
  background: #2a2f3a;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
`;

const FeatureIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  color: white;
`;

const FeatureText = styled.div`
  color: #8f9bb3;
  font-size: 0.8rem;
  font-weight: 500;
`;

const WalletOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
`;

const WalletButton = styled(motion.button)`
  background: #2a2f3a;
  border: 1px solid #2a2f3a;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;

  &:hover {
    border-color: #667eea;
    background: #2a2f3a;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const WalletInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WalletIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusMessage = styled(motion.div)`
  padding: 1rem;
  border-radius: 12px;
  background: #2a2f3a;
  color: #8f9bb3;
  font-size: 0.9rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const LoadingSpinner = styled(motion.div)`
  width: 16px;
  height: 16px;
  border: 2px solid #8f9bb3;
  border-top: 2px solid #667eea;
  border-radius: 50%;
`;

const walletProviders = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Connect using your MetaMask wallet',
    icon: Wallet,
    popular: true
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Connect using Coinbase Wallet',
    icon: Shield,
    popular: true
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Scan QR code with any wallet',
    icon: ExternalLink,
  },
  {
    id: 'phantom',
    name: 'Phantom',
    description: 'Connect using Phantom wallet',
    icon: Zap,
  },
];

function AdvancedWalletConnect({ onConnect }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleWalletConnect = async (providerId) => {
    setIsConnecting(true);
    setSelectedProvider(providerId);
    
    try {
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, generate a mock Ethereum address
      const mockAddress = `0x${Array.from({length: 40}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;
      
      console.log(`Connected with ${providerId}:`, mockAddress);
      onConnect(mockAddress);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setIsConnecting(false);
      setSelectedProvider(null);
    }
  };

  return (
    <ConnectContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ConnectCard
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Logo>
          <LogoText>Dancehall Translator</LogoText>
          <LogoSubtitle>Connect your wallet to start translating</LogoSubtitle>
        </Logo>

        <FeaturesGrid>
          <Feature>
            <FeatureIcon>
              <Zap size={16} />
            </FeatureIcon>
            <FeatureText>Fast AI Translations</FeatureText>
          </Feature>
          <Feature>
            <FeatureIcon>
              <Shield size={16} />
            </FeatureIcon>
            <FeatureText>Secure Payments</FeatureText>
          </Feature>
          <Feature>
            <FeatureIcon>
              <Wallet size={16} />
            </FeatureIcon>
            <FeatureText>Crypto Bounties</FeatureText>
          </Feature>
          <Feature>
            <FeatureIcon>
              <Check size={16} />
            </FeatureIcon>
            <FeatureText>Human Verification</FeatureText>
          </Feature>
        </FeaturesGrid>

        <WalletOptions>
          {walletProviders.map((provider, index) => {
            const IconComponent = provider.icon;
            const isPopular = provider.popular;
            
            return (
              <WalletButton
                key={provider.id}
                onClick={() => handleWalletConnect(provider.id)}
                disabled={isConnecting}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: isConnecting ? 1 : 1.02 }}
                whileTap={{ scale: isConnecting ? 1 : 0.98 }}
              >
                <WalletInfo>
                  <WalletIcon>
                    <IconComponent size={20} />
                  </WalletIcon>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ 
                      fontWeight: 600, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem' 
                    }}>
                      {provider.name}
                      {isPopular && (
                        <span style={{
                          background: '#667eea',
                          color: 'white',
                          fontSize: '0.7rem',
                          padding: '0.1rem 0.5rem',
                          borderRadius: '8px',
                          fontWeight: '500'
                        }}>
                          Popular
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#8f9bb3' }}>
                      {provider.description}
                    </div>
                  </div>
                </WalletInfo>
                
                {selectedProvider === provider.id ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {isConnecting ? (
                      <LoadingSpinner
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <Check size={20} color="#4caf50" />
                    )}
                  </motion.div>
                ) : (
                  <ChevronRight size={20} color="#8f9bb3" />
                )}
              </WalletButton>
            );
          })}
        </WalletOptions>

        <AnimatePresence>
          {isConnecting && (
            <StatusMessage
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Connecting to {walletProviders.find(p => p.id === selectedProvider)?.name}...
            </StatusMessage>
          )}
        </AnimatePresence>

        <motion.p
          style={{ 
            color: '#8f9bb3', 
            fontSize: '0.8rem', 
            marginTop: '2rem',
            lineHeight: '1.4'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy. 
          We never store your private keys.
        </motion.p>
      </ConnectCard>
    </ConnectContainer>
  );
}

export default AdvancedWalletConnect;
