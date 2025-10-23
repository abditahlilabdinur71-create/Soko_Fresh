import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import SokoFreshApp from './SokoFreshApp';
import { getCurrentUser, subscribe as authSubscribe, logout } from './services/authService';
import type { User } from './types';
import { initI18n, subscribe as i18nSubscribe, getLanguage, Language } from './lib/i18n';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [isI18nReady, setIsI18nReady] = useState(false);
  const [, setLang] = useState<Language>(getLanguage());

  useEffect(() => {
    initI18n().then(() => {
      setIsI18nReady(true);
    });

    const i18nUnsubscribe = i18nSubscribe(() => {
        setLang(getLanguage());
    });

    const authUnsubscribe = authSubscribe((user) => {
        setCurrentUser(user);
    });

    return () => {
        i18nUnsubscribe();
        authUnsubscribe();
    };
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    logout();
  };

  if (!isI18nReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-light text-brand-green">
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 animate-spin text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg font-semibold">Loading SokoFresh...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentUser ? (
        <SokoFreshApp user={currentUser} onLogout={handleLogout} />
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;
