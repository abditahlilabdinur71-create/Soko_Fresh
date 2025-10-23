import React, { useState, useEffect, useMemo } from 'react';
import Dashboard from './components/Dashboard';
import MarketPrices from './components/MarketPrices';
import ListProduceForm from './components/ListProduceForm';
import TransactionsHistory from './components/TransactionsHistory';
import MarketAssistant from './components/MarketAssistant';
import Settings from './components/Settings';
import Profile from './components/Profile';
import CropDetails from './components/CropDetails';
import ShareModal from './components/ShareModal';
import Cart from './components/Cart';
import Toast from './components/Toast';
import { HomeIcon, ChartBarIcon, PlusCircleIcon, CollectionIcon, SparklesIcon, MenuIcon, XIcon, CogIcon, SmsIcon, UserIcon, LogoIcon, LogoutIcon, ShareIcon, ShoppingCartIcon } from './components/icons';
import type { User, ProduceListing, CartItem } from './types';
import { t, setLanguage, getLanguage, subscribe, Language } from './lib/i18n';
import { updateUser as updateAuthUser } from './services/authService';

type NavView = 'dashboard' | 'prices' | 'list' | 'history' | 'assistant' | 'settings' | 'profile' | 'cart';

interface NavButtonProps {
  id: NavView;
  label: string;
  icon: React.ReactNode;
  currentView: NavView;
  onClick: (id: NavView) => void;
}

const NavButton: React.FC<NavButtonProps> = ({ id, label, icon, currentView, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center space-x-3 p-3 rounded-lg w-full text-left transition-colors ${
      currentView === id
        ? 'bg-brand-green text-white shadow-md'
        : 'text-gray-600 hover:bg-brand-green-light/20 hover:text-brand-green'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

interface SokoFreshAppProps {
    user: User;
    onLogout: () => void;
}

const SokoFreshApp: React.FC<SokoFreshAppProps> = ({ user: initialUser, onLogout }) => {
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [selectedListing, setSelectedListing] = useState<ProduceListing | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [user, setUser] = useState<User>(initialUser);
  const [lang, setLang] = useState<Language>(getLanguage());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' } | null>(null);
  
  const totalItemsInCart = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
  };

  useEffect(() => {
    document.title = t('app.title');
  }, [lang]);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setLang(getLanguage());
      document.documentElement.lang = getLanguage();
    });
    document.documentElement.lang = getLanguage();
    return unsubscribe;
  }, []);

  const handleUpdateUser = (updatedUser: User) => {
    const success = updateAuthUser(updatedUser);
    if (success) {
      setUser(updatedUser);
      showToast(t('alerts.profileUpdated'));
    } else {
      // In a real app, handle this error more gracefully
      alert("Failed to update profile.");
    }
  };

  const handleSelectListing = (listing: ProduceListing) => {
    setSelectedListing(listing);
  };

  const handleBackToDashboard = () => {
    setSelectedListing(null);
  };
  
  const handleAddToCart = (listing: ProduceListing, quantity: number = 1) => {
    setCart(prevCart => {
        const existingItem = prevCart.find(item => item.listing.id === listing.id);
        if (existingItem) {
            return prevCart.map(item => 
                item.listing.id === listing.id 
                    ? { ...item, quantity: item.quantity + quantity } 
                    : item
            );
        }
        return [...prevCart, { listing, quantity }];
    });
    showToast(t('toasts.itemAddedToCart', { crop: listing.crop }));
  };

  const handleUpdateCartQuantity = (listingId: number, newQuantity: number) => {
    setCart(prevCart => {
      if (newQuantity <= 0) {
        return prevCart.filter(item => item.listing.id !== listingId);
      }
      return prevCart.map(item =>
        item.listing.id === listingId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const handleRemoveFromCart = (listingId: number) => {
    setCart(prevCart => prevCart.filter(item => item.listing.id !== listingId));
  };

  const handleCheckout = () => {
    setCart([]);
    showToast(t('cart.checkoutSuccess'));
    setCurrentView('dashboard');
  };


  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onSelectListing={handleSelectListing} onAddToCart={handleAddToCart} />;
      case 'prices':
        return <MarketPrices />;
      case 'list':
        return <ListProduceForm onFormSubmit={() => setCurrentView('dashboard')} />;
      case 'history':
        return <TransactionsHistory />;
      case 'assistant':
        return <MarketAssistant />;
      case 'settings':
        return <Settings smsEnabled={smsEnabled} setSmsEnabled={setSmsEnabled} />;
      case 'profile':
        return <Profile user={user} onUpdateUser={handleUpdateUser} />;
      case 'cart':
        return <Cart cart={cart} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} />;
      default:
        return <Dashboard onSelectListing={handleSelectListing} onAddToCart={handleAddToCart} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: t('navigation.home'), icon: <HomeIcon /> },
    { id: 'prices', label: t('navigation.marketPrices'), icon: <ChartBarIcon /> },
    { id: 'list', label: t('navigation.listProduce'), icon: <PlusCircleIcon /> },
    { id: 'history', label: t('navigation.history'), icon: <CollectionIcon /> },
    { id: 'assistant', label: t('navigation.assistant'), icon: <SparklesIcon /> },
  ];
  
  const secondaryNavItems = [
     { id: 'cart', label: t('navigation.cart'), icon: (
        <div className="relative">
            <ShoppingCartIcon />
            {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItemsInCart}
                </span>
            )}
        </div>
     )},
     { id: 'profile', label: t('navigation.myProfile'), icon: <UserIcon /> },
     { id: 'settings', label: t('navigation.settings'), icon: <CogIcon /> },
  ]

  const handleNavClick = (id: NavView) => {
    setCurrentView(id);
    setSelectedListing(null); // Clear detail view when navigating away
    setIsMenuOpen(false);
  };

  const UserAvatar: React.FC<{ user: User, size: string }> = ({ user, size }) => (
    <img
      className={`${size} rounded-full object-cover bg-gray-200`}
      src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=228B22&color=fff`}
      alt="User Avatar"
    />
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <header className="md:hidden bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <LogoIcon className="w-8 h-8" />
          <h1 className="text-xl font-bold text-brand-green">{t('app.title')}</h1>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
          {isMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </header>

      <aside
        className={`fixed inset-0 z-10 bg-white p-4 transform transition-transform md:relative md:translate-x-0 md:flex md:flex-col md:w-64 md:border-r md:shadow-lg ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="hidden md:flex items-center space-x-3 mb-8 p-2">
          <LogoIcon className="w-10 h-10" />
          <h1 className="text-2xl font-bold text-brand-green">{t('app.title')}</h1>
        </div>
        <nav className="flex-grow space-y-2 mt-16 md:mt-0">
          {navItems.map(item => (
            <NavButton
              key={item.id}
              id={item.id as NavView}
              label={item.label}
              icon={item.icon}
              currentView={currentView}
              onClick={handleNavClick}
            />
          ))}
          <div className="pt-4 mt-4 border-t">
            {secondaryNavItems.map(item => (
                 <NavButton
                    key={item.id}
                    id={item.id as NavView}
                    label={item.label}
                    icon={item.icon}
                    currentView={currentView}
                    onClick={handleNavClick}
                />
            ))}
          </div>
          <div className="pt-2 border-t space-y-2">
            <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center space-x-3 p-3 rounded-lg w-full text-left transition-colors text-gray-600 hover:bg-brand-green-light/20 hover:text-brand-green"
              >
                <ShareIcon />
                <span className="font-medium">{t('share.button')}</span>
            </button>
            <button
                onClick={onLogout}
                className="flex items-center space-x-3 p-3 rounded-lg w-full text-left transition-colors text-gray-600 hover:bg-red-100 hover:text-red-700"
              >
                <LogoutIcon />
                <span className="font-medium">{t('navigation.logout')}</span>
            </button>
          </div>
        </nav>
        <div className="mt-auto">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-center space-x-3">
              <UserAvatar user={user} size="h-12 w-12" />
              <div>
                <p className="text-sm text-green-800 font-semibold">{t('sidebar.welcome', { name: user.name.split(' ')[0] })}</p>
                <p className="text-xs text-green-600">{user.county} {t('sidebar.countySuffix')}</p>
              </div>
          </div>
          {smsEnabled && (
            <div className="mt-2 flex items-center justify-center space-x-2 p-2 bg-blue-100 rounded-lg border border-blue-200">
              <SmsIcon />
              <span className="text-xs font-medium text-blue-800">{t('sidebar.smsAlertsActive')}</span>
            </div>
          )}
           <div className="text-center mt-4">
            <a 
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-xs text-gray-400 hover:text-gray-600 hover:underline transition-colors"
            >
              {t('sidebar.developerSite')}
            </a>
          </div>
           <div className="mt-2 flex items-center justify-center p-2 bg-gray-100 rounded-lg space-x-1">
              <button 
                  onClick={() => setLanguage('en')}
                  className={`w-full px-4 py-1 text-sm font-bold rounded-md transition-colors ${lang === 'en' ? 'bg-brand-green text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                  EN
              </button>
              <button
                  onClick={() => setLanguage('sw')}
                  className={`w-full px-4 py-1 text-sm font-bold rounded-md transition-colors ${lang === 'sw' ? 'bg-brand-green text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                  SW
              </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-brand-light/50 overflow-y-auto">
        {selectedListing && currentView === 'dashboard' ? (
          <CropDetails listing={selectedListing} onBack={handleBackToDashboard} onAddToCart={handleAddToCart} />
        ) : (
          renderView()
        )}
      </main>

      {isShareModalOpen && <ShareModal onClose={() => setIsShareModalOpen(false)} />}
    </div>
  );
};

export default SokoFreshApp;