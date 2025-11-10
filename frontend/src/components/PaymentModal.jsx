import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PaymentModal = ({ request, payment, onComplete, onBack, userAddress }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Debug logs - UPDATED TO MATCH NEW BUTTON TEXT

  const handlePay = async () => {
    setIsProcessing(true);
    
    if (onComplete && typeof onComplete === 'function') {
      setTimeout(() => {
        onComplete();
        setIsProcessing(false);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (onBack && typeof onBack === 'function') {
      onBack();
    }
  };

  // Inline styles
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const contentStyle = {
    background: '#0f0f0f',
    borderRadius: '16px',
    padding: '2rem',
    width: '90%',
    maxWidth: '400px',
    border: '1px solid #333'
  };

  const titleStyle = {
    color: 'white',
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    fontWeight: '600'
  };

  const songCardStyle = {
    background: '#1a1a1a',
    padding: '1.2rem',
    borderRadius: '10px',
    marginBottom: '1.2rem',
    border: '1px solid #333'
  };

  const priceDisplayStyle = {
    background: '#1a1a1a',
    padding: '1.5rem',
    borderRadius: '10px',
    marginBottom: '1.5rem',
    textAlign: 'center',
    border: '1px solid #333'
  };

  const priceStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#00d4aa'
  };

  const payButtonStyle = {
    width: '100%',
    padding: '1rem',
    background: isProcessing ? '#666' : '#00d4aa',
    color: 'black',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: isProcessing ? 'not-allowed' : 'pointer',
    marginBottom: '0.8rem',
    transition: 'all 0.2s ease'
  };

  const cancelButtonStyle = {
    width: '100%',
    padding: '0.8rem',
    background: 'transparent',
    color: '#888',
    border: '1px solid #444',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  return (
    <motion.div
      style={overlayStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget && onBack) {
          handleBack();
        }
      }}
    >
      <motion.div
        style={contentStyle}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h2 style={titleStyle}>Confirm Payment</h2>

        {/* Song Information */}
        {request && (
          <div style={songCardStyle}>
            <div style={{ color: 'white', marginBottom: '0.5rem' }}>
              <strong>Artist:</strong> {request.artist || request.artistName || 'Unknown Artist'}
            </div>
            <div style={{ color: 'white' }}>
              <strong>Song:</strong> {request.song || request.songTitle || 'Unknown Song'}
            </div>
          </div>
        )}

        {/* Price Display */}
        <div style={priceDisplayStyle}>
          <div style={{ color: '#888', marginBottom: '0.5rem' }}>Total Amount</div>
          <div style={priceStyle}>${payment?.amount || '0.00'}</div>
        </div>

        {/* PAYMENT CONFIRMATION BUTTON - UPDATED TEXT */}
        <button 
          style={payButtonStyle}
          onClick={handlePay} 
          disabled={isProcessing || !onComplete}
          onMouseOver={(e) => {
            if (!isProcessing) e.target.style.background = '#00b894';
          }}
          onMouseOut={(e) => {
            if (!isProcessing) e.target.style.background = '#00d4aa';
          }}
        >
          {isProcessing ? 'Processing...' : `Confirm Payment - $${payment?.amount || '0.00'}`}
        </button>

        {/* Cancel Button */}
        {onBack && (
          <button 
            style={cancelButtonStyle}
            onClick={handleBack}
            onMouseOver={(e) => {
              e.target.style.background = '#1a1a1a';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#888';
            }}
          >
            Cancel
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;