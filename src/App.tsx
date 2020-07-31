import React from 'react';

import GlobalStyle from './styles/global';
import SignIn from './pages/SignIn';
import AppProvider from './hooks';

// import { Container } from './styles';

const App: React.FC = () => (
  // A linha <AuthContext.Provider fornece os dados de autenticação ao componente <SignIn>
  <>
    <AppProvider>
      <SignIn />
    </AppProvider>

    <GlobalStyle />
  </>
);

export default App;
