/* eslint-disable @typescript-eslint/ban-types */
import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

interface AuthData {
  token: string;
  user: object;
}
interface Credentials {
  email: string;
  password: string;
}
interface AuthContextDTO {
  user: object;
  signIn(credentials: Credentials): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextDTO>({} as AuthContextDTO);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthData>({} as AuthData);

  useEffect(() => {
    async function loadInfoStorage(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        'Gobarber:token',
        'Gobarber:user',
      ]);

      if (token[1] && user[1]) {
        const userJs = JSON.parse(user[1]);
        setData({ token: token[1], user: userJs });
      }
    }
    loadInfoStorage();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['Gobarber:token', token],
      ['Gobarber:user', JSON.stringify(user)],
    ]);
    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['Gobarber:user', 'Gobarber:token']);
    setData({} as AuthData);
  }, []);
  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextDTO => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
