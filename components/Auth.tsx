import React, { useState, useEffect } from 'react';
import { LogoIcon, GoogleIcon, UserIcon, EyeIcon, EyeOffIcon } from './icons';
import { t } from '../lib/i18n';
import type { User } from '../types';
import { login, register, loginWithGoogle, loginAsGuest } from '../services/authService';
import { KENYAN_LOCATIONS } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'register' | 'forgotPassword'>('login');
  const [error, setError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Login state
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginPasswordVisible, setIsLoginPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegisterPasswordVisible, setIsRegisterPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // Forgot Password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  useEffect(() => {
    const currentUrl = window.location.href;
    // Use a public QR code generator API
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`);
  }, []);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = login(identifier, loginPassword, rememberMe);
    if (result.success && result.user) {
      onLogin(result.user);
    } else {
      setError(t(result.message === 'Invalid credentials' ? 'auth.errorInvalidCredentials' : 'auth.errorGeneric'));
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (registerPassword !== confirmPassword) {
      setError(t('auth.errorPasswordsDoNotMatch'));
      return;
    }
    const result = register({ name, email, phone, county }, registerPassword);
    if (result.success && result.user) {
      onLogin(result.user);
    } else {
       setError(t(result.message === 'Email already in use' ? 'auth.errorEmailInUse' : result.message === 'Phone number already in use' ? 'auth.errorPhoneInUse' : 'auth.errorGeneric'));
    }
  };
  
  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Placeholder logic: In a real app, this would call a backend service.
    // We show a generic message for security reasons (to not reveal if an email is registered).
    setResetMessage(t('auth.resetPasswordConfirmation'));
    setResetEmail('');
  };

  const handleGoogleLogin = () => {
    setError('');
    const result = loginWithGoogle();
    if (result.success && result.user) {
      onLogin(result.user);
    } else {
      setError(t('auth.errorGeneric'));
    }
  };

  const handleGuestLogin = () => {
    setError('');
    const result = loginAsGuest();
    if (result.success && result.user) {
        onLogin(result.user);
    } else {
        // This path is unlikely for guest login but good practice to have
        setError(t('auth.errorGeneric'));
    }
  };

  const InputField = ({ label, id, type, value, onChange, placeholder, required = true, pattern, title }: { label: string, id: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, required?: boolean, pattern?: string, title?: string }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        title={title}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green"
      />
    </div>
  );

  const PasswordField = ({ label, id, value, onChange, isVisible, onToggleVisibility, placeholder, required = true }: { label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, isVisible: boolean, onToggleVisibility: () => void, placeholder: string, required?: boolean }) => (
      <div>
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <div className="relative">
              <input
                  type={isVisible ? 'text' : 'password'}
                  id={id}
                  name={id}
                  value={value}
                  onChange={onChange}
                  placeholder={placeholder}
                  required={required}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green"
              />
              <button
                  type="button"
                  onClick={onToggleVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  aria-label={isVisible ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                  {isVisible ? <EyeOffIcon /> : <EyeIcon />}
              </button>
          </div>
      </div>
  );

  const renderView = () => {
    if (view === 'forgotPassword') {
      return (
        <>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            {t('auth.resetPasswordTitle')}
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">{t('auth.resetPasswordInstruction')}</p>
          
          {resetMessage ? (
             <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 mb-4 rounded-r-lg" role="alert">
                <p>{resetMessage}</p>
             </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <InputField label={t('auth.emailLabel')} id="resetEmail" type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder={t('auth.emailPlaceholder')} />
              <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-light transition-colors shadow-md">
                  {t('auth.sendResetLinkButton')}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
                <button onClick={() => { setView('login'); setError(''); setResetMessage(''); }} className="text-sm text-brand-green hover:underline">
                    {t('auth.backToLogin')}
                </button>
            </div>
        </>
      );
    }

    return (
      <>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {view === 'login' ? t('auth.loginTitle') : t('auth.registerTitle')}
        </h2>

        {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-r-lg" role="alert">
                <p>{error}</p>
            </div>
        )}
        
        {view === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
                <InputField label={t('auth.emailOrPhoneLabel')} id="identifier" type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder={t('auth.emailOrPhonePlaceholder')} />
                <div>
                  <PasswordField 
                    label={t('auth.passwordLabel')} 
                    id="loginPassword" 
                    value={loginPassword} 
                    onChange={e => setLoginPassword(e.target.value)} 
                    placeholder="********"
                    isVisible={isLoginPasswordVisible}
                    onToggleVisibility={() => setIsLoginPasswordVisible(prev => !prev)}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <label htmlFor="rememberMe" className="flex items-center text-sm text-gray-600 cursor-pointer">
                      <input 
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                      />
                      <span className="ml-2">{t('auth.rememberMe')}</span>
                    </label>
                    <button type="button" onClick={() => { setView('forgotPassword'); setError(''); }} className="text-sm text-brand-green hover:underline font-medium">
                        {t('auth.forgotPasswordLink')}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-light transition-colors shadow-md">
                    {t('auth.loginButton')}
                </button>
            </form>
        ) : (
            <form onSubmit={handleRegister} className="space-y-4">
                <InputField label={t('profile.fullName')} id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('auth.namePlaceholder')} />
                <InputField label={t('auth.emailLabel')} id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('auth.emailPlaceholder')} />
                <InputField label={t('profile.phoneNumber')} id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0712345678" pattern="0[71]\d{8}" title="Please enter a valid Kenyan phone number (e.g., 07... or 01...)." />
                <div>
                    <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">{t('common.county')}</label>
                    <select id="county" name="county" value={county} onChange={e => setCounty(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green bg-white">
                        <option value="">{t('profile.selectCounty')}</option>
                        {Object.keys(KENYAN_LOCATIONS).sort().map(c => (<option key={c} value={c}>{c}</option>))}
                    </select>
                </div>
                <PasswordField 
                  label={t('auth.passwordLabel')} 
                  id="registerPassword" 
                  value={registerPassword} 
                  onChange={e => setRegisterPassword(e.target.value)} 
                  placeholder="********"
                  isVisible={isRegisterPasswordVisible}
                  onToggleVisibility={() => setIsRegisterPasswordVisible(prev => !prev)}
                />
                 <PasswordField 
                  label={t('auth.confirmPasswordLabel')} 
                  id="confirmPassword" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  placeholder="********"
                  isVisible={isConfirmPasswordVisible}
                  onToggleVisibility={() => setIsConfirmPasswordVisible(prev => !prev)}
                />
                <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-light transition-colors shadow-md">
                    {t('auth.registerButton')}
                </button>
            </form>
        )}

        <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">{t('auth.orContinueWith')}</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="space-y-3">
            <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
            >
                <GoogleIcon />
                <span className="ml-3">{t('auth.loginWithGoogle')}</span>
            </button>
            <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm bg-gray-600 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
                <UserIcon />
                <span className="ml-3">{t('auth.loginAsGuest')}</span>
            </button>
        </div>

        <div className="mt-6 text-center">
            <button onClick={() => { setView(view === 'login' ? 'register' : 'login'); setError(''); }} className="text-sm text-brand-green hover:underline">
                {view === 'login' ? t('auth.switchToRegister') : t('auth.switchToLogin')}
            </button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-brand-light flex flex-col justify-center items-center p-4 animate-fade-in">
      <div className="max-w-md w-full">
        <div className="flex justify-center items-center space-x-3 mb-8">
            <LogoIcon className="w-12 h-12" />
            <h1 className="text-4xl font-bold text-brand-green">{t('app.title')}</h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
            {renderView()}
        </div>
      </div>
      
      {qrCodeUrl && (
        <div className="mt-8 text-center bg-white p-6 rounded-xl shadow-lg max-w-md w-full animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('auth.testOnPhoneTitle')}</h3>
          <p className="text-sm text-gray-500 mb-4">{t('auth.testOnPhoneDescription')}</p>
          <div className="flex justify-center">
            <img src={qrCodeUrl} alt="QR Code to open on mobile" width="150" height="150" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
