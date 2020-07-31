import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
// Criação do AppProvider, funciona como um provider global, engloba todos os providers
const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthProvider>
);

export default AppProvider;
