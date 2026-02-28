import React from 'react';
import { AuthProvider } from './AuthContext';
import { ProfileProvider } from './ProfileContext';
import { DraftsProvider } from './DraftsContext';
import { QuizProvider } from './QuizContext';

interface AppStoreProviderProps {
  children: React.ReactNode;
}

export const AppStoreProvider: React.FC<AppStoreProviderProps> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <DraftsProvider>
          <QuizProvider>
            {children}
          </QuizProvider>
        </DraftsProvider>
      </ProfileProvider>
    </AuthProvider>
  );
};

export default AppStoreProvider;

