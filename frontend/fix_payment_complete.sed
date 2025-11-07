/const handlePaymentComplete = async () => {/,/} finally {/ {
  /setIsLoading(true);/a\
    console.log("🔵 Starting translation process...");\
    console.log("🔵 Translation request:", translationRequest);
  
  /const result = await translationAPI.requestTranslation(translationRequest);/a\
      console.log("🟢 Translation completed:", result);
  
  /} catch (error) {/a\
    console.error("🔴 Translation failed with error:", error);\
    console.error("🔴 Error details:", {\
      message: error.message,\
      stack: error.stack,\
      name: error.name\
    });\
    \
    // Provide more helpful error message\
    const errorMessage = error.message.includes('Failed to fetch') \
      ? 'Cannot connect to translation server. Please check if the backend is running.' \
      : 'Translation failed. Please try again.';\
    alert(errorMessage);
}
