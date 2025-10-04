import React from 'react';
import { Buffer } from 'buffer';
// Provide Buffer globally for web3.js and adapters
// @ts-ignore
window.Buffer = window.Buffer || Buffer;
import ReactDOM from 'react-dom/client';
import { WalletConnectionProvider } from './wallet/WalletConnectionProvider';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletConnectionProvider>
      <App />
    </WalletConnectionProvider>
  </React.StrictMode>
);
