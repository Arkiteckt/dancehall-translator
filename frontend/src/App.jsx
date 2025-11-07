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

  // Debug effects for development
  useEffect(() => {
    console.log('🔍 APP STATE UPDATE:');
    console.log('🔍 currentView:', currentView);
    console.log('🔍 translationRequest:', translationRequest);
    console.log('🔍 translationResult:', translationResult);
  }, [currentView, translationRequest, translationResult]);

  // Add this useEffect to debug the translationRequest state
  useEffect(() => {
    console.log('🔍 translationRequest STATE UPDATED:', translationRequest);
    console.log('🔍 Artist in state:', translationRequest?.artist);
    console.log('🔍 Song in state:', translationRequest?.song);
    console.log('�� Lyrics in state:', translationRequest?.lyrics);
    console.log('🔍 Lyrics length:', translationRequest?.lyrics?.length);
  }, [translationRequest]);

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

  // PROPER PAYMENT FLOW - FIXED VERSION WITH DEBUG LOGGING
  const handleTranslationRequest = async (request) => {
    console.log('🎵🎵🎵 handleTranslationRequest CALLED 🎵🎵🎵');
    console.log('🎵 Full request object from form:', JSON.stringify(request, null, 2));
    console.log('🎵 Artist value:', request.artist);
    console.log('🎵 Song value:', request.song);
    console.log('🎵 Year value:', request.year);
    console.log('🎵 Lyrics value:', request.lyrics);
    console.log('🎵 Lyrics length:', request.lyrics?.length);
    
    if (backendStatus !== 'connected') {
      alert('Backend server is not available.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('💰 Calling estimatePrice API...');
      const priceData = await translationAPI.estimatePrice(request);
      console.log('💰 Price estimate received:', priceData);
      
      const safePrice = getSafePrice(priceData);
      
      // DEBUG: Log what we're saving to state
      console.log('💾 Saving to translationRequest state:', {
        artist: request.artist,
        song: request.song,
        year: request.year,
        lyrics: request.lyrics,
        lyricsLength: request.lyrics?.length
      });
      
      setTranslationRequest({
        artist: request.artist,
        song: request.song,
        year: request.year,
        lyrics: request.lyrics,
        id: request.id || `req_${Date.now()}`
      });
      
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

  // REAL AI TRANSLATION - UPDATED VERSION WITH DEBUG LOGGING
  const handlePaymentComplete = async () => {
    console.log('💰 Payment completed, starting REAL AI translation...');
    console.log('💰 translationRequest:', translationRequest);
    console.log('💰 translationRequest lyrics:', translationRequest?.lyrics);
    console.log('💰 translationRequest lyrics length:', translationRequest?.lyrics?.length);
    
    if (!translationRequest) {
      console.error('❌ translationRequest is null or undefined!');
      alert('Translation request data is missing. Please start over.');
      setIsLoading(false);
      return;
    }

    // DEBUG: Check if we have lyrics
    if (!translationRequest.lyrics) {
      console.error('❌ NO LYRICS FOUND in translationRequest!');
      console.error('❌ Full translationRequest object:', translationRequest);
      alert('No lyrics found. Please go back and enter lyrics.');
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

    console.log('🟡 FINAL REQUEST being sent to backend:', safeRequest);
    console.log('🟡 Artist being sent:', safeRequest.artist);
    console.log('🟡 Song being sent:', safeRequest.song);
    console.log('🟡 Lyrics being sent (first 100 chars):', safeRequest.lyrics.substring(0, 100));
    console.log('🟡 Full lyrics length:', safeRequest.lyrics.length);
    
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
              <TranslationResult 
                key="result"
                request={translationRequest}
                result={translationResult}
                onNewTranslation={startNewTranslation}
                onRequestHumanVerification={handleRequestHumanReview}
                onBack={() => setCurrentView('dashboard')}
              />
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
