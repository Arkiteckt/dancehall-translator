import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, Music, User, Calendar, AlertCircle, LogOut } from 'lucide-react';

const RequestContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f2f5;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #0052FF, #0052FF);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserAddress = styled.span`
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  color: #666;
`;

const DisconnectButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 8px 12px;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: #e9ecef;
    color: #333;
  }
`;

const Title = styled.h2`
  color: #333;
  font-size: 2.2rem;
  margin-bottom: 10px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #666;
  text-align: center;
  margin-bottom: 40px;
  font-size: 1.1rem;
`;

const WarningBanner = styled.div`
  background: #fef3cd;
  border: 1px solid #ffeaa7;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #856404;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 15px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 15px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 15px;
  padding: 18px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ExampleRequests = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 15px;
`;

const ExampleTitle = styled.h4`
  color: #333;
  margin-bottom: 15px;
`;

const ExampleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ExampleItem = styled(motion.button)`
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  padding: 12px 15px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    transform: translateX(5px);
  }
`;

function TranslationRequest({ onSubmit, backendStatus, userAddress, onDisconnect }) {
  const [formData, setFormData] = useState({
    artist: '',
    song: '',
    year: '',
    lyrics: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.artist && formData.song) {
      onSubmit(formData);
    }
  };

  const handleExampleClick = (example) => {
    setFormData(example);
  };

  const shortenAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const examples = [
    {
      artist: 'Vybz Kartel',
      song: 'Fever',
      year: '2011',
      lyrics: ''
    },
    {
      artist: 'Beenie Man',
      song: 'Who Am I',
      year: '1997',
      lyrics: ''
    },
    {
      artist: 'Spice',
      song: 'So Mi Like It',
      year: '2014',
      lyrics: ''
    }
  ];

  const isBackendConnected = backendStatus === 'connected';

  return (
    <RequestContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <UserHeader>
        <UserInfo>
          <UserAvatar>
            {userAddress?.slice(2, 4).toUpperCase()}
          </UserAvatar>
          <UserDetails>
            <div style={{ fontWeight: 600 }}>Connected</div>
            <UserAddress>{shortenAddress(userAddress)}</UserAddress>
          </UserDetails>
        </UserInfo>
        <DisconnectButton onClick={onDisconnect}>
          <LogOut size={16} />
          Disconnect
        </DisconnectButton>
      </UserHeader>

      <Title>Request Translation</Title>
      <Subtitle>Fill in the song details to translate</Subtitle>

      {!isBackendConnected && (
        <WarningBanner>
          <AlertCircle size={20} />
          <div>
            <strong>Backend not connected</strong>
            <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>
              Make sure the backend server is running on port 3001
            </div>
          </div>
        </WarningBanner>
      )}

      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>
            <User size={18} />
            Artist
          </Label>
          <Input
            type="text"
            placeholder="ex: Vybz Kartel"
            value={formData.artist}
            onChange={(e) => setFormData({...formData, artist: e.target.value})}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>
            <Music size={18} />
            Song Name
          </Label>
          <Input
            type="text"
            placeholder="ex: Fever"
            value={formData.song}
            onChange={(e) => setFormData({...formData, song: e.target.value})}
            required
          />
        </InputGroup>

        <InputGroup>
          <Label>
            <Calendar size={18} />
            Year (Optional)
          </Label>
          <Input
            type="number"
            placeholder="ex: 2011"
            min="1980"
            max={new Date().getFullYear()}
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
          />
        </InputGroup>

        <InputGroup>
          <Label>
            Lyrics (Optional)
          </Label>
          <TextArea
            placeholder="Paste the lyrics here if you already have them. If not, we'll find them for you!"
            value={formData.lyrics}
            onChange={(e) => setFormData({...formData, lyrics: e.target.value})}
          />
        </InputGroup>

        <SubmitButton
          type="submit"
          whileHover={isBackendConnected ? { scale: 1.02 } : {}}
          whileTap={isBackendConnected ? { scale: 0.98 } : {}}
          disabled={!isBackendConnected}
        >
          <Search size={20} />
          {isBackendConnected ? 'Search & Calculate Price' : 'Backend Offline'}
        </SubmitButton>
      </Form>

      <ExampleRequests>
        <ExampleTitle>Popular Examples:</ExampleTitle>
        <ExampleList>
          {examples.map((example, index) => (
            <ExampleItem
              key={index}
              type="button"
              onClick={() => handleExampleClick(example)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <strong>{example.artist}</strong> - {example.song} ({example.year})
            </ExampleItem>
          ))}
        </ExampleList>
      </ExampleRequests>
    </RequestContainer>
  );
}

export default TranslationRequest;
