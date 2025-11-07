import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #0a0b0d;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 280px; // Sidebar width
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

function Layout({ children, currentView, onViewChange, userAddress, onDisconnect }) {
  return (
    <LayoutContainer>
      <Sidebar 
        currentView={currentView}
        onViewChange={onViewChange}
      />
      <MainContent>
        <Header 
          userAddress={userAddress}
          onDisconnect={onDisconnect}
        />
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
}

export default Layout;