import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Music, Home, Users, History, Settings } from 'lucide-react';

const SidebarContainer = styled(motion.div)`
  width: 280px;
  background: #1a1d23;
  border-right: 1px solid #2a2f3a;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  padding: 2rem 0;
  z-index: 100;
`;

const Logo = styled.div`
  padding: 0 2rem 2rem;
  border-bottom: 1px solid #2a2f3a;
  margin-bottom: 2rem;
`;

const LogoText = styled.h1`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
`;

const NavItem = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: ${props => props.active ? '#2a2f3a' : 'transparent'};
  border: none;
  border-radius: 12px;
  color: ${props => props.active ? '#ffffff' : '#8f9bb3'};
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 0.95rem;
  font-weight: 500;

  &:hover {
    background: #2a2f3a;
    color: #ffffff;
    transform: translateX(5px);
  }
`;

const NavIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'request', label: 'New Translation', icon: Music },
  { id: 'history', label: 'Translation History', icon: History },
  { id: 'bounties', label: 'Bounties', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function Sidebar({ currentView, onViewChange }) {
  return (
    <SidebarContainer
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Logo>
        <LogoText>Dancehall Translator</LogoText>
      </Logo>
      
      <Nav>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavItem
              key={item.id}
              active={currentView === item.id}
              onClick={() => onViewChange(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <NavIcon>
                <IconComponent size={18} />
              </NavIcon>
              {item.label}
            </NavItem>
          );
        })}
      </Nav>
    </SidebarContainer>
  );
}

export default Sidebar;
