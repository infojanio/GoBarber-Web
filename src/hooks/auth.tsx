import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User; // object    não consegui definir como object
  signIn(credentials: SignInCredentials): Promise<void>; // quando transformamos o método em async - await, obrigatoriamente declaramos a Promisse
  signOut(): void;
  updateUser(user: User): void;
}

/*
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
*/
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  // cria um state para o context, com isso só será executado quando o usuário atualizar a página
  const [authData, setAuthData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Barber:token');
    const user = localStorage.getItem('@Barber:user'); // '@GoBarber:user'

    if (token && user) {
      // aplica-se para todas as requisições que acontecerem - default, guardando o token
      api.defaults.headers.authorization = `Bearer ${token}`;

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

    // aplica-se para todas as requisições que acontecerem - default guardando o token
    api.defaults.headers.authorization = `Bearer ${token}`;

    setAuthData({ token, user });
  }, []);

  // Criação do logout da aplicação
  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setAuthData({} as AuthState);
  }, []);

  // Atualizar usuário com  avatar
  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@Barber:user', JSON.stringify(user));
      setAuthData({
        token: authData.token,
        user,
      });
    },
    [setAuthData, authData.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: authData.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado em AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
