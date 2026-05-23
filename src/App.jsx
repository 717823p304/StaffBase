import React from 'react';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <AppProvider>
      <div className="bg-blob-1"></div>
      <div className="bg-blob-2"></div>
      <div className="bg-blob-3"></div>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
