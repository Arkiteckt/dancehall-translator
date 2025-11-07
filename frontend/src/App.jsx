import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Import new layout components
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

function App() {
  // FORCE REFRESH DETECTION
  console.log('🔄 APP.JSX RELOADED - Version: ', Date.now());
  
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

  // ADD THIS DEBUG EFFECT
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

  // Safe price extraction helper
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

  // PROPER PAYMENT FLOW - FIXED VERSION
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

  // REAL AI TRANSLATION - UPDATED VERSION
  const handlePaymentComplete = async () => {
    console.log('💰 Payment completed, starting REAL AI translation...');
    console.log('💰 translationRequest:', translationRequest);
    
    if (!translationRequest) {
      console.error('❌ translationRequest is null or undefined!');
      alert('Translation request data is missing. Please start over.');
      setIsLoading(false);
      return;
    }

    // Create a safe request object with fallbacks
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
      
      // CALL REAL BACKEND API
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
      console.log('🟢 Navigation to result view with REAL AI translation');
      
    } catch (error) {
      console.error('🔴 REAL Translation failed:', error);
      
      // FALLBACK: Show error but still display original lyrics
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

  // FINAL CHECK LOG - Only log when we're about to render result view
  if (currentView === 'result' && translationResult) {
    console.log('🎵 FINAL CHECK - About to render TranslationResult:');
    console.log('🎵 translationResult:', translationResult);
    console.log('🎵 translationRequest:', translationRequest);
  }

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        {/* TEMPORARY DEBUG - This should definitely show */}
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: 'lime',
          color: 'black',
          padding: '10px',
          zIndex: 9999,
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          🟢 APP LOADED: {new Date().toLocaleTimeString()}
        </div>
        
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
                onStartTranslation={() => setCurrentView('request')}
                userAddress={userAddress}
              />
            )}
            
            {currentView === 'request' && (
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
                {/* ENHANCED DEBUG PANEL - FIXED */}
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
                  <div><strong>🎵 REAL AI TRANSLATION DEBUG:</strong></div>
                  <div>Has Result: {translationResult ? 'YES' : 'NO'}</div>
                  <div>Original: {translationResult.original ? `${translationResult.original.length} chars` : 'NO'}</div>
                  <div>Translated: {translationResult.translatedText ? `${translationResult.translatedText.length} chars` : 'NO'}</div>
                  <div>All Keys: {translationResult ? Object.keys(translationResult).join(', ') : 'NONE'}</div>
                  <div>View: {currentView}</div>
                </div>

                {/* TEMPORARY: Render lyrics directly in App.jsx to test - FIXED */}
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
                  <div><strong>🔵 DIRECT RENDER TEST:</strong></div>
                  <div style={{background: 'green', margin: '5px', padding: '5px'}}>
                    <div><strong>ORIGINAL:</strong></div>
                    <div style={{fontSize: '10px', maxHeight: '100px', overflow: 'auto'}}>
                      {translationResult.original || 'NO ORIGINAL'}
                    </div>
                  </div>
                  <div style={{background: 'purple', margin: '5px', padding: '5px'}}>
                    <div><strong>TRANSLATED:</strong></div>
                    <div style={{fontSize: '10px', maxHeight: '100px', overflow: 'auto'}}>
                      {translationResult.translatedText || 'NO TRANSLATED'}
                    </div>
                  </div>
                </div>
                
                <TranslationResult 
                  key="result"
                  request={translationRequest}
                  result={translationResult}
                  onNewTranslation={startNewTranslation}
                  onRequestHumanVerification={handleRequestHumanReview}
                  onBack={() => setCurrentView('dashboard')}
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

export default App;