import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { LogOut, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: #0a0b0d;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: rgba(15, 15, 15, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #2a2a2a;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #00d4aa, #0099ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #2a2a2a;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: #2a2a2a;
  }
`;

const LanguageButton = styled(motion.button)`
  background: ${props => props.$isPortuguese ? '#0099ff' : '#00d4aa'};
  color: #000;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$isPortuguese ? '#0077cc' : '#00b894'};
    transform: scale(1.05);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #888;
  font-size: 0.9rem;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
`;

function Layout({ children, currentView, onViewChange, userAddress, onDisconnect }) {
  const { language, toggleLanguage, isPortuguese } = useLanguage();

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <LayoutContainer>
      <Header>
        <Logo>Dancehall Translator</Logo>
        
        <Nav>
          <LanguageButton
            $isPortuguese={isPortuguese}
            onClick={toggleLanguage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Globe size={16} />
            {isPortuguese ? 'PT-BR' : 'EN'}
          </LanguageButton>

          <NavButton
            onClick={onDisconnect}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={16} />
            Disconnect
          </NavButton>
        </Nav>

        <UserInfo>
          {formatAddress(userAddress)}
        </UserInfo>
      </Header>

      <Main>
        {children}
      </Main>
    </LayoutContainer>
  );
}

export default Layout;
