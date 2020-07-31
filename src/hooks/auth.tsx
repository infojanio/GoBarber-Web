import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface SignInCredentials {
  email: string;
  password: string;
}
interface AuthState {
  token: string;
  user: object;
}
interface AuthContextData {
  user: object; // object    não consegui definir como object
  signIn(credentials: SignInCredentials): Promise<void>; // quando transformamos o método em async - await, obrigatoriamente declaramos a Promisse
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
// Criação da hook useAuth
function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'userAuth não foi configurado no container como AuthProvider',
    );
  }
  return context;
}

const AuthProvider: React.FC = ({ children }) => {
  // cria um state para o context, com isso só será executado quando o usuário atualizar a página
  const [authData, setAuthData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Barber:token');
    const user = localStorage.getItem('@Barber:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }
    return {} as AuthState;
  });

  // login pelo Contexto
  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;
    localStorage.setItem('@Barber:token', token);
    localStorage.setItem('@Barber:user', JSON.stringify(user));

    setAuthData({ token, user });
  }, []);

  // Criação do logout da aplicação
  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setAuthData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: authData.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
