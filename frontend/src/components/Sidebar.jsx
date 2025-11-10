import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Home, Search, History, Award, Settings, User, LogOut } from 'lucide-react';

const SidebarContainer = styled(motion.div)`
  width: 280px;
  height: 100vh;
  background: #1a1a1a;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #2a2a2a;
`;

const Logo = styled.div`
  padding: 0 2rem 2rem;
  border-bottom: 1px solid #2a2a2a;
  margin-bottom: 2rem;
`;

const LogoText = styled.h1`
  color: #667eea;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  padding: 0;
`;

const Nav = styled.nav`
  flex: 1;
  padding: 0 1rem;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.active ? '#667eea' : '#888'};
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  border: ${props => props.active ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid transparent'};

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const NavText = styled.span`
  font-weight: ${props => props.active ? '600' : '400'};
`;

const UserSection = styled.div`
  padding: 1rem;
  border-top: 1px solid #2a2a2a;
  margin-top: auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
`;

const UserAddress = styled.div`
  color: #888;
  font-size: 0.8rem;
  font-family: 'Monaco', 'Courier New', monospace;
`;

const DisconnectButton = styled.button`
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #333;
  border-radius: 8px;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }
`;

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'translation', label: 'New Translation', icon: Search },
  { id: 'history', label: 'Translation History', icon: History },
  { id: 'bounties', label: 'Bounties', icon: Award },
  { id: 'settings', label: 'Settings', icon: Settings }
];

function Sidebar({ currentView, onViewChange, userAddress, onDisconnect }) {
  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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
            >
              <IconComponent size={20} />
              <NavText active={currentView === item.id}>{item.label}</NavText>
            </NavItem>
          );
        })}
      </Nav>

      <UserSection>
        <UserInfo>
          <UserAvatar>
            <User size={20} />
          </UserAvatar>
          <UserDetails>
            <UserName>User</UserName>
            <UserAddress>{shortenAddress(userAddress)}</UserAddress>
          </UserDetails>
        </UserInfo>
        
        <DisconnectButton onClick={onDisconnect}>
          <LogOut size={16} />
          Disconnect
        </DisconnectButton>
      </UserSection>
    </SidebarContainer>
  );
}

export default Sidebar;
