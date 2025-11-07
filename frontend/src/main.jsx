import React from 'react'
import ReactDOM from 'react-dom/client'
import { CDPReactProvider } from '@coinbase/cdp-react'
import App from './App.jsx'

// Replace with your actual project ID from CDP Portal
const CDP_PROJECT_ID = "d585e462-9744-471f-95fb-c30f3e100e30";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CDPReactProvider 
      config={{
        projectId: CDP_PROJECT_ID,
        ethereum: {
          createOnLogin: "eoa" // External Owned Account (standard wallet)
        },
        appName: "Dancehall Translator",
        appVersion: "1.0.0",
        appLogoUrl: "https://your-app.com/logo.png" // Optional
      }}
    >
      <App />
    </CDPReactProvider>
  </React.StrictMode>,
)
