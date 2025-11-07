import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PaymentConfirmModal = ({ request, payment, onComplete, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // NEW DEBUG LOGS - DIFFERENT FROM OLD VERSION
  console.log('🎵 DANCEHALL TRANSLATOR PAYMENT 🎵');
  console.log('Artist:', request?.artist);
  console.log('Song:', request?.song);
  console.log('Amount:', payment?.amount);

  const handleConfirm = async () => {
    console.log('CONFIRM PAYMENT CLICKED');
    setIsProcessing(true);
    
    if (onComplete && typeof onComplete === 'function') {
      setTimeout(() => {
        onComplete();
        setIsProcessing(false);
      }, 2000);
    }
  };

  // DARK THEME STYLES THAT MATCH YOUR APP
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const contentStyle = {
    background: '#0a0a0a',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '380px',
    border: '1px solid #2a2a2a',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
  };

  const titleStyle = {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '20px',
    fontWeight: '600'
  };

  const songCardStyle = {
    background: '#151515',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #2a2a2a'
  };

  const priceSectionStyle = {
    background: '#151515',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    border: '1px solid #2a2a2a'
  };

  const priceStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#00d4aa'
  };

  const confirmButtonStyle = {
    width: '100%',
    padding: '14px',
    background: '#00d4aa',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'background 0.2s ease'
  };

  const cancelButtonStyle = {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    color: '#888',
    border: '1px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s ease'
  };

  return (
    <motion.div
      style={overlayStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={contentStyle}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h2 style={titleStyle}>Confirm Translation</h2>

        {/* Song Info */}
        {request && (
          <div style={songCardStyle}>
            <div style={{ color: '#ffffff', marginBottom: '8px' }}>
              <span style={{ color: '#666' }}>Artist: </span>
              {request.artist || request.artistName}
            </div>
            <div style={{ color: '#ffffff' }}>
              <span style={{ color: '#666' }}>Song: </span>
              {request.song || request.songTitle}
            </div>
          </div>
        )}

        {/* Price */}
        <div style={priceSectionStyle}>
          <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
            Translation Cost
          </div>
          <div style={priceStyle}>${payment?.amount || '0.00'}</div>
        </div>

        {/* Confirm Button - NO TEST TEXT */}
        <button 
          style={confirmButtonStyle}
          onClick={handleConfirm} 
          disabled={isProcessing}
          onMouseOver={(e) => !isProcessing && (e.target.style.background = '#00b894')}
          onMouseOut={(e) => !isProcessing && (e.target.style.background = '#00d4aa')}
        >
          {isProcessing ? 'Processing...' : 'Confirm Payment'}
        </button>

        {/* Cancel Button */}
        {onBack && (
          <button 
            style={cancelButtonStyle}
            onClick={onBack}
            onMouseOver={(e) => {
              e.target.style.background = '#1a1a1a';
              e.target.style.borderColor = '#444';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderColor = '#333';
            }}
          >
            Cancel
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PaymentConfirmModal;
