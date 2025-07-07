// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importação simples do App
import './index.css';
import { FinanceiroProvider } from './context/FinanceiroContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FinanceiroProvider>
      <App />
    </FinanceiroProvider>
  </React.StrictMode>
);