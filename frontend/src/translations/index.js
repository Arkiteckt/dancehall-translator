export const translations = {
  en: {
    // Dashboard
    welcome: "Welcome to Dancehall Translator",
    tagline: "Translate Jamaican Patois to Brazilian Portuguese with AI",
    startTranslation: "Start New Translation",
    connectWallet: "Connect Wallet",
    dashboard: "Dashboard",
    myTranslations: "My Translations",
    
    // Translation Request
    artistName: "Artist Name",
    songTitle: "Song Title",
    releaseYear: "Release Year (Optional)",
    pasteLyrics: "Paste Lyrics (Patois)",
    translate: "Translate",
    estimatingPrice: "Estimating Price...",
    backToDashboard: "Back to Dashboard",
    
    // Payment
    payment: "Payment",
    payWithUSDC: "Pay with USDC",
    processing: "Processing...",
    completePayment: "Complete Payment",
    
    // Results
    translationComplete: "Translation Complete!",
    originalLyrics: "Original Lyrics (Patois)",
    translation: "Translation to Brazilian Portuguese",
    culturalNotes: "Cultural Notes",
    downloadTranslation: "Download Translation",
    requestHumanReview: "Request Human Review",
    newTranslation: "New Translation",
    
    // Human Verification
    humanReview: "Human Review",
    submitForReview: "Submit for Review",
    
    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success"
  },
  
  pt: {
    // Dashboard
    welcome: "Bem-vindo ao Dancehall Translator",
    tagline: "Traduza Patois Jamaicano para Português Brasileiro com IA",
    startTranslation: "Iniciar Nova Tradução",
    connectWallet: "Conectar Carteira",
    dashboard: "Painel",
    myTranslations: "Minhas Traduções",
    
    // Translation Request
    artistName: "Nome do Artista",
    songTitle: "Título da Música",
    releaseYear: "Ano de Lançamento (Opcional)",
    pasteLyrics: "Cole a Letra (Patois)",
    translate: "Traduzir",
    estimatingPrice: "Calculando Preço...",
    backToDashboard: "Voltar ao Painel",
    
    // Payment
    payment: "Pagamento",
    payWithUSDC: "Pagar com USDC",
    processing: "Processando...",
    completePayment: "Finalizar Pagamento",
    
    // Results
    translationComplete: "Tradução Concluída!",
    originalLyrics: "Letra Original (Patois)",
    translation: "Tradução para Português Brasileiro",
    culturalNotes: "Notas Culturais",
    downloadTranslation: "Baixar Tradução",
    requestHumanReview: "Solicitar Revisão Humana",
    newTranslation: "Nova Tradução",
    
    // Human Verification
    humanReview: "Revisão Humana",
    submitForReview: "Enviar para Revisão",
    
    // Common
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso"
  }
};

export const getTranslation = (key, language) => {
  return translations[language]?.[key] || key;
};
