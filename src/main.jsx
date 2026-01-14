import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from './login/AuthContext.jsx';
import { SnackbarProvider } from './contexts/SnackbarContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <SnackbarProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SnackbarProvider>
    </HelmetProvider>
  </StrictMode>,
)
