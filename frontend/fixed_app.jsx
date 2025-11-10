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
      🎵 DEBUG: Rendering TranslationResult
    </div>
    
    {/* SECOND DEBUG PANEL */}
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
