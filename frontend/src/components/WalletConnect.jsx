import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Wallet, Mail, Smartphone, QrCode, ArrowRight, Check, Sparkles } from 'lucide-react';

const ConnectContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 50px;
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 16px;
  color: #333;
  font-weight: 700;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 40px;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const WalletOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
`;

const WalletButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px 24px;
  border: 2px solid #e1e5e9;
  border-radius: 16px;
  background: white;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;

  &:hover {
    border-color: #0052FF;
    background: #f8faff;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 82, 255, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ButtonIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => 
    props.primary ? 'linear-gradient(45deg, #0052FF, #0052FF)' : 
    props.secondary ? '#f8f9fa' : '#f0f2f5'};
  color: ${props => props.primary ? 'white' : '#333'};
`;

const ButtonText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

const ButtonTitle = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
`;

const ButtonDescription = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-weight: 400;
`;

const ArrowIcon = styled.div`
  color: #666;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 0;
  color: #999;
  font-size: 0.9rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e1e5e9;
  }

  &::before {
    margin-right: 16px;
  }

  &::after {
    margin-left: 16px;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #f0f2f5;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
  font-size: 0.9rem;
`;

const FeatureIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f0f9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0052FF;
`;

const StatusMessage = styled(motion.div)`
  padding: 16px;
  border-radius: 12px;
  margin: 20px 0;
  background: ${props => 
    props.type === 'success' ? '#f0f9ff' : 
    props.type === 'error' ? '#fef2f2' : '#fff3cd'};
  color: ${props => 
    props.type === 'success' ? '#0369a1' : 
    props.type === 'error' ? '#dc2626' : '#854d0e'};
  border: 1px solid ${props => 
    props.type === 'success' ? '#bae6fd' : 
    props.type === 'error' ? '#fecaca' : '#fef3c7'};
`;

function WalletConnect({ onConnect }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [status, setStatus] = useState('');

  const handleEmailLogin = async () => {
    setIsLoading(true);
    setStatus('Redirecting to email login...');
    
    try {
      // Simulate CDP email login flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll simulate a successful login
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setStatus('✅ Successfully signed in with email!');
      
      setTimeout(() => {
        onConnect(mockAddress);
      }, 1000);
      
    } catch (error) {
      setStatus('❌ Email login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoinbaseWallet = async () => {
    setIsLoading(true);
    setStatus('Opening Coinbase Wallet...');
    
    try {
      // Simulate Coinbase Wallet connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setStatus('✅ Connected with Coinbase Wallet!');
        onConnect(address);
      } else {
        setStatus('❌ Coinbase Wallet not detected. Please install the extension.');
      }
    } catch (error) {
      setStatus('❌ Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaMask = async () => {
    setIsLoading(true);
    setStatus('Connecting to MetaMask...');
    
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setStatus('✅ Connected with MetaMask!');
        onConnect(address);
      } else {
        setStatus('❌ MetaMask not detected. Please install MetaMask.');
        window.open('https://metamask.io/download/', '_blank');
      }
    } catch (error) {
      setStatus('❌ Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    setIsLoading(true);
    setStatus('Opening WalletConnect...');
    
    try {
      // Simulate WalletConnect flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus('📱 Scan the QR code with your mobile wallet');
      
      // In a real implementation, you'd show a QR code here
      setTimeout(() => {
        setStatus('✅ Connected via WalletConnect!');
        const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
        onConnect(mockAddress);
      }, 3000);
      
    } catch (error) {
      setStatus('❌ WalletConnect failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const walletOptions = [
    {
      id: 'email',
      title: 'Sign in with Email',
      description: 'No wallet required',
      icon: <Mail size={24} />,
      onClick: handleEmailLogin,
      primary: true
    },
    {
      id: 'coinbase-wallet',
      title: 'Coinbase Wallet',
      description: 'Connect your Coinbase wallet',
      icon: <Smartphone size={24} />,
      onClick: handleCoinbaseWallet,
      secondary: true
    },
    {
      id: 'metamask',
      title: 'MetaMask',
      description: 'Connect your MetaMask wallet',
      icon: <Wallet size={24} />,
      onClick: handleMetaMask
    },
    {
      id: 'walletconnect',
      title: 'WalletConnect',
      description: 'Scan QR code with any wallet',
      icon: <QrCode size={24} />,
      onClick: handleWalletConnect
    }
  ];

  return (
    <ConnectContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Logo>
        <Sparkles size={32} color="#0052FF" />
        Dancehall Translator
      </Logo>

      <Title>Connect your wallet</Title>
      <Subtitle>
        Choose how you want to connect. We support popular wallets and email login.
      </Subtitle>

      {status && (
        <StatusMessage
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          type={
            status.includes('✅') ? 'success' : 
            status.includes('❌') ? 'error' : 'default'
          }
        >
          {status}
        </StatusMessage>
      )}

      <WalletOptions>
        {walletOptions.map((option) => (
          <WalletButton
            key={option.id}
            onClick={option.onClick}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ButtonContent>
              <ButtonIcon primary={option.primary} secondary={option.secondary}>
                {option.icon}
              </ButtonIcon>
              <ButtonText>
                <ButtonTitle>{option.title}</ButtonTitle>
                <ButtonDescription>{option.description}</ButtonDescription>
              </ButtonText>
            </ButtonContent>
            <ArrowIcon>
              <ArrowRight size={20} />
            </ArrowIcon>
          </WalletButton>
        ))}
      </WalletOptions>

      <Divider>or continue with</Divider>

      <WalletButton
        onClick={handleEmailLogin}
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{ borderStyle: 'dashed' }}
      >
        <ButtonContent>
          <ButtonIcon>
            <Mail size={24} />
          </ButtonIcon>
          <ButtonText>
            <ButtonTitle>Continue as guest</ButtonTitle>
            <ButtonDescription>Try without connecting a wallet</ButtonDescription>
          </ButtonText>
        </ButtonContent>
      </WalletButton>

      <Features>
        <Feature>
          <FeatureIcon>
            <Check size={16} />
          </FeatureIcon>
          <span>No gas fees</span>
        </Feature>
        <Feature>
          <FeatureIcon>
            <Check size={16} />
          </FeatureIcon>
          <span>Secure & simple</span>
        </Feature>
        <Feature>
          <FeatureIcon>
            <Check size={16} />
          </FeatureIcon>
          <span>Multi-chain</span>
        </Feature>
        <Feature>
          <FeatureIcon>
            <Check size={16} />
          </FeatureIcon>
          <span>Email recovery</span>
        </Feature>
      </Features>
    </ConnectContainer>
  );
}

export default WalletConnect;
