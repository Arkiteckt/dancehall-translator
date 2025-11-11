import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Import contexts
import { LanguageProvider } from './contexts/LanguageContext';

// Import components
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import WalletConnect from './components/WalletConnect';
import TranslationRequest from './components/TranslationRequest';
import NewPayment from './components/NewPayment.jsx';
import TranslationResult from './components/TranslationResult';
import HumanVerificationModal from './components/HumanVerificationModal';
import { translationAPI } from './services/api';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0a0b0d;
    color: #ffffff;
    min-height: 100vh;
  }

  #root {
    min-height: 100vh;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: #0a0b0d;
`;

function AppContent() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [currentView, setCurrentView] = useState('dashboard');
  const [translationRequest, setTranslationRequest] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [translationResult, setTranslationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [currentSongData, setCurrentSongData] = useState(null);
  const [humanReviewTranslation, setHumanReviewTranslation] = useState('');

  // Check backend health
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await translationAPI.healthCheck();
        setBackendStatus('connected');
        console.log('✅ Backend connection successful');
      } catch (error) {
        setBackendStatus('disconnected');
        console.error('❌ Backend connection failed:', error);
      }
    };
    checkBackend();
  }, []);

  // Debug effect
  useEffect(() => {
    console.log('🔍 APP STATE UPDATE:');
    console.log('🔍 currentView:', currentView);
    console.log('🔍 translationRequest:', translationRequest);
    console.log('🔍 translationResult:', translationResult);
  }, [currentView, translationRequest, translationResult]);

  const connectWallet = (address) => {
    setUserAddress(address);
    setWalletConnected(true);
    setCurrentView('dashboard');
  };

  const getSafePrice = (priceData) => {
    if (!priceData) {
      console.error('Price data is completely undefined or null');
      return '0';
    }
    
    if (typeof priceData.price === 'undefined' || priceData.price === null) {
      console.warn('Price property is missing or null:', priceData);
      return '0';
    }
    
    return priceData.price.toString();
  };

  const handleTranslationRequest = async (request) => {
    console.log('🎵🎵🎵 handleTranslationRequest CALLED 🎵🎵🎵');
    console.log('🎵 Received request data:', request);
    
    if (backendStatus !== 'connected') {
      alert('Backend server is not available.');
      return;
    }

    setIsLoading(true);
    try {
      const priceData = await translationAPI.estimatePrice(request);
      const safePrice = getSafePrice(priceData);
      
      setTranslationRequest(request);
      setPaymentDetails({
        amount: safePrice,
        amountWei: ethers.parseUnits(safePrice, 6).toString(),
        invoiceId: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        recipient: '0x742d35Cc6634C0532925a3b8D...',
        complexity: priceData?.complexity || 'medium'
      });
      
      setCurrentView('payment');
    } catch (error) {
      console.error('Price estimation failed:', error);
      alert('Failed to get price estimate. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = async () => {
    console.log('💰 translationRequest:', translationRequest);
    
    if (!translationRequest) {
      console.error('❌ translationRequest is null or undefined!');
      alert('Translation request data is missing. Please start over.');
      setIsLoading(false);
      return;
    }

    const safeRequest = {
      artist: translationRequest.artist || 'Unknown Artist',
      song: translationRequest.song || 'Unknown Song',
      year: translationRequest.year || '',
      lyrics: translationRequest.lyrics || '',
      id: translationRequest.id || `req_${Date.now()}`
    };

    console.log('🟡 Calling REAL backend API with:', safeRequest);
    setIsLoading(true);
    
    try {
      console.log('🔵 Calling REAL translationAPI.requestTranslation...');
      const apiResult = await translationAPI.requestTranslation(safeRequest);
      console.log('🟢 REAL Backend API returned:', apiResult);
      
      setTranslationResult(apiResult);
      
      setCurrentSongData({
        id: `song_${Date.now()}`,
        title: safeRequest.song,
        artist: safeRequest.artist,
        originalLyrics: safeRequest.lyrics,
        translation: apiResult.translatedText || apiResult.translated
      });
      
      setCurrentView('result');
      
    } catch (error) {
      console.error('🔴 REAL Translation failed:', error);
      
      const fallbackResult = {
        original: safeRequest.lyrics,
        translatedText: `❌ TRANSLATION ERROR: ${error.message}\n\nOriginal lyrics:\n${safeRequest.lyrics}`,
        translated: `❌ TRANSLATION ERROR: ${error.message}\n\nOriginal lyrics:\n${safeRequest.lyrics}`,
        culturalNotes: [
          "Translation service temporarily unavailable",
          "Please check your backend server and OpenAI API key",
          "Original lyrics displayed for reference"
        ]
      };
      
      console.log('🟡 Using error fallback data');
      setTranslationResult(fallbackResult);
      setCurrentView('result');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBountyCreated = (bounty) => {
    console.log('Bounty created successfully:', bounty);
  };

  const handleRequestHumanReview = (translation) => {
    console.log('🔍 Human review requested with translation:', translation);
    setHumanReviewTranslation(translation);
    setIsVerificationModalOpen(true);
  };

  const startNewTranslation = () => {
    setTranslationRequest(null);
    setPaymentDetails(null);
    setTranslationResult(null);
    setCurrentSongData(null);
    setHumanReviewTranslation('');
    setCurrentView('dashboard');
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setUserAddress('');
    setCurrentView('connect');
  };

  if (!walletConnected) {
    return (
      <>
        <GlobalStyle />
        <AppContainer>
          <WalletConnect onConnect={connectWallet} />
        </AppContainer>
      </>
    );
  }

  if (currentView === 'result' && translationResult) {
    console.log('🎵 FINAL CHECK - About to render TranslationResult:');
    console.log('🎵 translationResult:', translationResult);
    console.log('🎵 translationRequest:', translationRequest);
  }

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Layout 
          currentView={currentView}
          onViewChange={setCurrentView}
          userAddress={userAddress}
          onDisconnect={disconnectWallet}
        >
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <Dashboard 
                key="dashboard"
                onStartTranslation={() => setCurrentView('translation')}
                userAddress={userAddress}
              />
            )}
            
            {currentView === 'translation' && (
              <TranslationRequest 
                key="request"
                onSubmit={handleTranslationRequest}
                backendStatus={backendStatus}
                userAddress={userAddress}
                onBack={() => setCurrentView('dashboard')}
              />
            )}
            
            {currentView === 'payment' && (
              <NewPayment 
                key="payment"
                request={translationRequest}
                payment={paymentDetails}
                onComplete={handlePaymentComplete}
                onBack={() => setCurrentView('request')}
                userAddress={userAddress}
              />
            )}
            
            {currentView === 'result' && translationResult && (
              <>
                <div style={{
                  position: 'fixed',
                  top: '50px',
                  left: '10px',
                  background: 'red',
                  color: 'white',
                  padding: '10px',
                  zIndex: 9999,
                  fontSize: '12px',
                  maxWidth: '400px',
                  border: '2px solid yellow'
                }}>
                  🎵 DEBUG: Rendering TranslationResult
                </div>
                
                <div style={{
                  position: 'fixed',
                  top: '200px',
                  left: '10px',
                  background: 'blue',
                  color: 'white',
                  padding: '10px',
                  zIndex: 9999,
                  fontSize: '12px',
                  maxWidth: '400px',
                  border: '2px solid cyan'
                }}>
                  Translation Data Loaded
                </div>

                <TranslationResult 
                  key="result"
                  request={translationRequest}
                  result={translationResult}
                  onNewTranslation={startNewTranslation}
                  onRequestHumanReview={handleRequestHumanReview}
                  isLoading={isLoading}
                />
              </>
            )}
          </AnimatePresence>

          <HumanVerificationModal
            isOpen={isVerificationModalOpen}
            onClose={() => {
              setIsVerificationModalOpen(false);
              setHumanReviewTranslation('');
            }}
            song={currentSongData}
            currentTranslation={humanReviewTranslation || translationResult?.translatedText || translationResult?.translated || ''}
            onBountyCreated={handleBountyCreated}
          />
        </Layout>
      </AppContainer>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
