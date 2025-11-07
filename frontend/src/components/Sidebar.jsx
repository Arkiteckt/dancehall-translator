import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  background: #1a1b1f;
  padding: 1rem;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <h3 style={{ color: 'white' }}>Menu</h3>
      {/* Sidebar content would go here */}
    </SidebarContainer>
  );
};

export default Sidebar;
