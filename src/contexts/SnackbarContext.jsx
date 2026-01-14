import React, { createContext, useContext, useState } from 'react';

const SnackbarContext = createContext(null);

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    message: '',
    type: 'info',
    visible: false
  });

  const showSnackbar = (message, type = 'info', duration = 4000) => {
    setSnackbar({
      message,
      type,
      visible: true,
      duration
    });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      visible: false
    }));
  };

  const showSuccess = (message, duration) => showSnackbar(message, 'success', duration);
  const showError = (message, duration) => showSnackbar(message, 'error', duration);
  const showWarning = (message, duration) => showSnackbar(message, 'warning', duration);
  const showInfo = (message, duration) => showSnackbar(message, 'info', duration);

  // Make snackbar functions available globally for AuthContext
  React.useEffect(() => {
    window.snackbarContext = {
      showSuccess,
      showError,
      showWarning,
      showInfo
    };
  }, [showSuccess, showError, showWarning, showInfo]);

  return (
    <SnackbarContext.Provider value={{
      snackbar,
      showSnackbar,
      hideSnackbar,
      showSuccess,
      showError,
      showWarning,
      showInfo
    }}>
      {children}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
