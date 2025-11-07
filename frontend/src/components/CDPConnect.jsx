import React, { useState, useEffect } from 'react';
import { useCDP, useAccount, useConnect, useDisconnect } from '@coinbase/cdp-react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Check, Wallet, User } from 'lucide-react';

const ConnectContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 50px;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  color: white;
`;

const ConnectTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 16px;
`;

const ConnectDescription = styled.p`
  opacity: 0.9;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const ConnectButton = styled(motion.button)`
  background: linear-gradient(45deg, #0052FF, #0052FF);
  border: none;
  border-radius: 50px;
  padding: 18px 40px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 auto 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 300px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 82, 255, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 30px 0;
  text-align: left;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
`;

const Steps = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 50px;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const StepText = styled.span`
  font-size: 0.9rem;
  opacity: 0.8;
  text-align: center;
`;

const StatusMessage = styled.div`
  padding: 15px;
  border-radius: 10px;
  margin: 20px 0;
  background: ${props => props.success ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.success ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
`;

const UserInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  margin: 20px 0;
`;

function CDPConnect({ onConnect }) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  // CDP React hooks
  const { isInitialized } = useCDP();
  const { account, isConnected } = useAccount();
  const { connect, isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && account) {
      setStatus('Successfully connected with CDP!');
      onConnect(account.address);
    }
  }, [isConnected, account, onConnect]);

  const handleCDPConnect = async () => {
    setIsLoading(true);
    setStatus('Opening CDP sign-in...');

    try {
      // This will open the CDP email sign-in flow
      await connect();
      
      setStatus('Check your email to complete sign-in!');
      
    } catch (error) {
      console.error('CDP connection failed:', error);
      setStatus(`Connection failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setStatus('Disconnected from CDP');
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };

  // Show loading while CDP initializes
  if (!isInitialized) {
    return (
      <ConnectContainer>
        <ConnectTitle>Initializing...</ConnectTitle>
        <ConnectDescription>
          Setting up Coinbase CDP for your wallet.
        </ConnectDescription>
        <div className="animate-spin" style={{width: '40px', height: '40px', border: '4px solid transparent', borderTop: '4px solid white', borderRadius: '50%', margin: '20px auto'}} />
      </ConnectContainer>
    );
  }

  // If already connected, show connected state
  if (isConnected && account) {
    return (
      <ConnectContainer
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ConnectTitle>Welcome! 🎉</ConnectTitle>
        <ConnectDescription>
          You're successfully signed in and ready to translate Dancehall lyrics.
        </ConnectDescription>

        <UserInfo>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <User size={24} />
            <strong>CDP Wallet</strong>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-all' }}>
            {account.address}
          </div>
        </UserInfo>

        <FeaturesList>
          <FeatureItem>
            <Check size={18} color="#00D632" />
            <div>
              <strong>Email Verified</strong>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Secure sign-in complete</div>
            </div>
          </FeatureItem>
          
          <FeatureItem>
            <Check size={18} color="#00D632" />
            <div>
              <strong>USDC Wallet Ready</strong>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Payments enabled</div>
            </div>
          </FeatureItem>
          
          <FeatureItem>
            <Check size={18} color="#00D632" />
            <div>
              <strong>No Gas Fees</strong>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Sponsored transactions</div>
            </div>
          </FeatureItem>
        </FeaturesList>

        <ConnectButton
          onClick={handleDisconnect}
          style={{ background: 'rgba(255, 255, 255, 0.2)' }}
        >
          <Wallet size={20} />
          Disconnect Wallet
        </ConnectButton>
      </ConnectContainer>
    );
  }

  return (
    <ConnectContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ConnectTitle>Sign in with Coinbase</ConnectTitle>
      <ConnectDescription>
        Use Coinbase CDP to create a wallet instantly with just your email. 
        No downloads or extensions required!
      </ConnectDescription>

      {status && (
        <StatusMessage success={status.includes('Successfully') || status.includes('Check your email')}>
          {status}
        </StatusMessage>
      )}

      <ConnectButton
        whileHover={!isLoading ? { scale: 1.05 } : {}}
        whileTap={!isLoading ? { scale: 0.95 } : {}}
        onClick={handleCDPConnect}
        disabled={isLoading || isConnecting}
      >
        {(isLoading || isConnecting) ? (
          <>
            <div className="animate-spin" style={{width: '20px', height: '20px', border: '2px solid transparent', borderTop: '2px solid white', borderRadius: '50%'}} />
            Connecting...
          </>
        ) : (
          <>
            <Mail size={20} />
            Sign in with Email
            <ArrowRight size={20} />
          </>
        )}
      </ConnectButton>

      <FeaturesList>
        <FeatureItem>
          <Check size={18} color="#00D632" />
          <div>
            <strong>No Installation Required</strong>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Just sign in with your email</div>
          </div>
        </FeatureItem>
        
        <FeatureItem>
          <Check size={18} color="#00D632" />
          <div>
            <strong>Built-in USDC Wallet</strong>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Ready for instant payments</div>
          </div>
        </FeatureItem>
        
        <FeatureItem>
          <Check size={18} color="#00D632" />
          <div>
            <strong>Sponsored Transactions</strong>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>No gas fees for you</div>
          </div>
        </FeatureItem>
        
        <FeatureItem>
          <Check size={18} color="#00D632" />
          <div>
            <strong>Enterprise Security</strong>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Powered by Coinbase</div>
          </div>
        </FeatureItem>
      </FeaturesList>

      <Steps>
        <Step>
          <StepNumber>1</StepNumber>
          <StepText>Sign in with Email</StepText>
        </Step>
        <Step>
          <StepNumber>2</StepNumber>
          <StepText>Request Translation</StepText>
        </Step>
        <Step>
          <StepNumber>3</StepNumber>
          <StepText>Pay with USDC</StepText>
        </Step>
        <Step>
          <StepNumber>4</StepNumber>
          <StepText>Receive Translation</StepText>
        </Step>
      </Steps>
    </ConnectContainer>
  );
}

export default CDPConnect;
