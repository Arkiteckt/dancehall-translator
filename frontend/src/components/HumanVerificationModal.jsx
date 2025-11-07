import React, { useState } from 'react';
import './HumanVerificationModal.css';

const HumanVerificationModal = ({ isOpen, onClose, song, currentTranslation, onBountyCreated }) => {
  const [selectedLines, setSelectedLines] = useState([]);
  const [bountyAmount, setBountyAmount] = useState(5);
  const [currency, setCurrency] = useState('USDC');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lines = currentTranslation ? currentTranslation.split('\n').filter(line => line.trim()) : [];

  const toggleLineSelection = (index, line) => {
    const lineIndex = selectedLines.findIndex(sl => sl.index === index);
    if (lineIndex > -1) {
      setSelectedLines(selectedLines.filter(sl => sl.index !== index));
    } else {
      setSelectedLines([...selectedLines, { 
        index, 
        originalText: line, 
        aiTranslation: line,
        confidenceScore: 0.5
      }]);
    }
  };

  const submitBounty = async () => {
    if (selectedLines.length === 0) {
      alert('Please select at least one line to verify');
      return;
    }

    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_URL}/bounties/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          songId: song?.id || 'current-song',
          songTitle: song?.title || 'Current Song',
          originalLyrics: song?.originalLyrics || '',
          aiTranslation: currentTranslation,
          flaggedLines: selectedLines,
          bountyAmount,
          currency
        })
      });

      if (response.ok) {
        const result = await response.json();
        onBountyCreated(result.data);
        onClose();
        alert('Bounty created successfully! A human translator will review this.');
      } else {
        throw new Error('Failed to create bounty');
      }
    } catch (error) {
      console.error('Error creating bounty:', error);
      alert('Error creating bounty. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Request Human Verification</h2>
        <p>Select lines that need expert review. A bounty will be paid to community translators.</p>
        
        <div className="bounty-config">
          <label>
            Bounty Amount:
            <input 
              type="number" 
              value={bountyAmount}
              onChange={(e) => setBountyAmount(parseFloat(e.target.value))}
              min="1"
              max="100"
            />
          </label>
          <label>
            Currency:
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="USDC">USDC</option>
              <option value="SOL">SOL</option>
              <option value="ETH">ETH</option>
            </select>
          </label>
        </div>

        <div className="lines-selection">
          <h4>Select lines to verify:</h4>
          <div className="lines-list">
            {lines.map((line, index) => (
              <div 
                key={index}
                className={`line-item ${selectedLines.some(sl => sl.index === index) ? 'selected' : ''}`}
                onClick={() => toggleLineSelection(index, line)}
              >
                <span className="line-number">{index + 1}</span>
                <span className="line-text">{line}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose} disabled={isSubmitting}>Cancel</button>
          <button 
            onClick={submitBounty} 
            disabled={isSubmitting || selectedLines.length === 0}
            className="primary"
          >
            {isSubmitting ? 'Creating Bounty...' : `Create $${bountyAmount} ${currency} Bounty`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HumanVerificationModal;
