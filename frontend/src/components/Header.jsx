import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Wallet, LogOut, User } from 'lucide-react';

const HeaderContainer = styled.header`
  background: #1a1d23;
  border-bottom: 1px solid #2a2f3a;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const WalletAddress = styled(motion.div)`
  background: #2a2f3a;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  color: #8f9bb3;
`;

const DisconnectButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b6b, #ee5a52);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #2a2f3a;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #8f9bb3;
`;

function Header({ userAddress, onDisconnect }) {
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <HeaderContainer>
      <div></div> {/* Spacer for flex layout */}
      
      <UserInfo>
        <UserProfile>
          <User size={16} />
          <span>User</span>
        </UserProfile>
        
        <WalletAddress
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Wallet size={16} />
          {formatAddress(userAddress)}
        </WalletAddress>
        
        <DisconnectButton
          onClick={onDisconnect}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut size={16} />
          Disconnect
        </DisconnectButton>
      </UserInfo>
    </HeaderContainer>
  );
}

export default Header;