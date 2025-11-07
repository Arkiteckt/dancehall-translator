import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Zap, Shield, CheckCircle } from 'lucide-react';

const PaymentContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 40px;
  max-width: 500px;
  margin: 0 auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 12px 20px;
  color: #666;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  transition: all 0.3s ease;

  &:hover {
    background: #e9ecef;
    color: #333;
    transform: translateX(-2px);
  }
`;

const Title = styled.h2`
  color: #333;
  font-size: 2rem;
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 40px;
  font-size: 1.1rem;
`;

const SongInfo = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
`;

const SongTitle = styled.h3`
  color: #333;
  font-size: 1.3rem;
  margin-bottom: 5px;
`;

const SongArtist = styled.p`
  color: #666;
  font-size: 1rem;
`;

const PaymentCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  color: white;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
`;

const Amount = styled.div`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Currency = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  opacity: 0.9;
`;

const InvoiceId = styled.div`
  text-align: center;
  opacity: 0.8;
  font-size: 0.9rem;
  margin-bottom: 20px;
  font-family: 'Monaco', 'Courier New', monospace;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 40px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #333;
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  flex-shrink: 0;
`;

const FeatureText = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
`;

const FeatureDescription = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const PayButton = styled(motion.button)`
  background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
  border: none;
  border-radius: 20px;
  padding: 25px;
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 210, 255, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0, 210, 255, 0.6);
  }

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const SecurityNotice = styled.div`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

function NewPayment({ request, payment, onComplete, onBack, userAddress }) {
  const handlePayment = async () => {
    try {
      await onComplete();
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const shortenAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <PaymentContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <BackButton onClick={onBack}>
        <ArrowLeft size={20} />
        Back to Request
      </BackButton>

      <Title>Complete Payment</Title>
      <Subtitle>Review and pay for your translation</Subtitle>

      <SongInfo>
        <SongTitle>{request?.song || 'Unknown Song'}</SongTitle>
        <SongArtist>by {request?.artist || 'Unknown Artist'}</SongArtist>
      </SongInfo>

      <PaymentCard>
        <Amount>
          ${payment?.amount || '0'}<Currency> USD</Currency>
        </Amount>
        <InvoiceId>Invoice: {payment?.invoiceId}</InvoiceId>
      </PaymentCard>

      <FeaturesList>
        <FeatureItem>
          <FeatureIcon>
            <Zap size={20} />
          </FeatureIcon>
          <FeatureText>
            <FeatureTitle>AI-Powered Translation</FeatureTitle>
            <FeatureDescription>Advanced neural network translation with cultural context preservation</FeatureDescription>
          </FeatureText>
        </FeatureItem>

        <FeatureItem>
          <FeatureIcon>
            <Shield size={20} />
          </FeatureIcon>
          <FeatureText>
            <FeatureTitle>Blockchain Verified</FeatureTitle>
            <FeatureDescription>Translation permanently stored on blockchain with proof of authenticity</FeatureDescription>
          </FeatureText>
        </FeatureItem>

        <FeatureItem>
          <FeatureIcon>
            <CheckCircle size={20} />
          </FeatureIcon>
          <FeatureText>
            <FeatureTitle>Instant Delivery</FeatureTitle>
            <FeatureDescription>Receive your translation immediately after payment confirmation</FeatureDescription>
          </FeatureText>
        </FeatureItem>
      </FeaturesList>

      <PayButton
        onClick={handlePayment}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <CreditCard size={24} />
        PAY ${payment?.amount || '0'} USD
      </PayButton>

      <SecurityNotice>
        <Shield size={16} />
        Secure payment processed via blockchain
      </SecurityNotice>
    </PaymentContainer>
  );
}

export default NewPayment;
