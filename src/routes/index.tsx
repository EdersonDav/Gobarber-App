import React from 'react';
import { useAuth } from '../hooks/Auth';

import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';

const Routes: React.FC = () => {
  const { user } = useAuth();
  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
