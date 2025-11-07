import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import styled, { createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Import new layout components
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import WalletConnect from './components/WalletConnect';
import TranslationRequest from './components/TranslationRequest';
import Payment from './components/Payment.jsx'; // ✅ CHANGED: Using Payment instead of NewPayment
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

  // Check backend health
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await translationAPI.healthCheck();
        setBackendStatus('connected');
      } catch (error) {
        setBackendStatus('disconnected');
      }
    };
    checkBackend();
  }, []);

  // ADD THIS DEBUG EFFECT
  useEffect(() => {
    console.log('🔍 APP STATE UPDATE:');
    console.log('🔍 currentView:', currentView);
    console.log('🔍 translationRequest:', translationRequest);
  }, [currentView, translationRequest]);

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

  const handlePaymentComplete = async () => {
    console.log('🔵 handlePaymentComplete started');
    console.log('🔵 translationRequest:', translationRequest);
    
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
      lyrics: translationRequest.lyrics || ''
    };

    console.log('🟡 Using safe request:', safeRequest);
    setIsLoading(true);
    
    try {
      console.log('🔵 Calling translationAPI.requestTranslation...');
      const apiResult = await translationAPI.requestTranslation(safeRequest);
      console.log('🟢 Translation API returned:', apiResult);
      
      // IMPROVED: Handle different API response structures
      let translatedText = '';
      
      if (typeof apiResult === 'string') {
        // If API returns just a string
        translatedText = apiResult;
      } else if (apiResult.translatedText) {
        // If API returns { translatedText: "..." }
        translatedText = apiResult.translatedText;
      } else if (apiResult.translation) {
        // If API returns { translation: "..." }
        translatedText = apiResult.translation;
      } else if (apiResult.translated) {
        // If API returns { translated: "..." }
        translatedText = apiResult.translated;
      } else {
        // Fallback if structure is unexpected
        console.warn('Unexpected API response structure:', apiResult);
        translatedText = JSON.stringify(apiResult);
      }
      
      const formattedResult = {
        original: safeRequest.lyrics || "Original lyrics not available",
        translated: translatedText || "Translation not available",
        culturalNotes: apiResult?.culturalNotes || [
          "Translation provided by AI",
          "Cultural context may vary",
          "Some expressions may have multiple interpretations"
        ]
      };
      
      console.log('🟢 Setting formatted translation result:', formattedResult);
      setTranslationResult(formattedResult);
      
      setCurrentSongData({
        id: `song_${Date.now()}`,
        title: safeRequest.song,
        artist: safeRequest.artist,
        originalLyrics: safeRequest.lyrics,
        translation: formattedResult.translated
      });
      
      setCurrentView('result');
      console.log('🟢 Navigation to result view');
    } catch (error) {
      console.error('🔴 Translation failed:', error);
      
      // ENHANCED FALLBACK: Use more complete mock data
      console.log('🟡 Using enhanced fallback mock data');
      const mockResult = {
        original: safeRequest.lyrics || `Gal a mad ova mi, gal a mad ova mi
Mi nah go change fi nuh gyal, mi nah go change fi nuh gyal
Mi seh mi love di way yuh wine, yuh body inna mi mind
And yuh neva leave mi behind, yuh neva leave mi behind`,
        
        translated: `A garota está louca por mim, a garota está louca por mim
Eu não vou mudar por nenhuma garota, eu não vou mudar por nenhuma garota
Eu digo que amo o jeito que você dança, seu corpo em minha mente
E você nunca me deixou para trás, você nunca me deixou para trás`,
        
        culturalNotes: [
          "Gal a mad ova mi - A garota está louca por mim",
          "Mi nah go change - Eu não vou mudar",
          "Wine - Dança característica da cultura dancehall",
          "Translation provided as fallback - API call failed"
        ]
      };
      
      setTranslationResult(mockResult);
      setCurrentView('result');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBountyCreated = (bounty) => {
    console.log('Bounty created successfully:', bounty);
  };

  const startNewTranslation = () => {
    setTranslationRequest(null);
    setPaymentDetails(null);
    setTranslationResult(null);
    setCurrentSongData(null);
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
            
            {/* ✅ CHANGED: Using Payment instead of NewPayment */}
            {currentView === 'payment' && (
              <Payment 
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
                onRequestHumanVerification={() => setIsVerificationModalOpen(true)}
                onBack={() => setCurrentView('dashboard')}
              />
            )}
          </AnimatePresence>

          <HumanVerificationModal
            isOpen={isVerificationModalOpen}
            onClose={() => setIsVerificationModalOpen(false)}
            song={currentSongData}
            currentTranslation={translationResult?.translated || ''}
            onBountyCreated={handleBountyCreated}
          />
        </Layout>
      </AppContainer>
    </>
  );
}

export default App;