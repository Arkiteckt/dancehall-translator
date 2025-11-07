import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: #0a0b0d;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #2a2b2f;
`;

const Layout = ({ children, currentView, onViewChange, userAddress, onDisconnect }) => {
  return (
    <Container>
      <Header>
        <h1 style={{ color: 'white', margin: 0 }}>Dancehall Translator</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {userAddress && (
            <span style={{ color: '#00d4aa' }}>
              {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </span>
          )}
          <button 
            onClick={onDisconnect}
            style={{
              background: 'transparent',
              color: '#888',
              border: '1px solid #333',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Disconnect
          </button>
        </div>
      </Header>
      {children}
    </Container>
  );
};

export default Layout;
