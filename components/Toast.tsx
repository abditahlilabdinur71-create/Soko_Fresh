import React from 'react';
import { CheckCircleIcon, XIcon } from './icons';
import { t } from '../lib/i18n';

interface ToastProps {
  toast: { message: string; type: 'success' } | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {

  if (!toast) {
    return null;
  }

  return (
    <div className="fixed top-6 right-6 bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg shadow-lg z-50 w-full max-w-sm animate-fade-in-down" role="alert">
      <div className="flex">
        <div className="py-1">
          <CheckCircleIcon />
        </div>
        <div className="ml-3 flex-1">
          <p className="font-bold">{t('alerts.settingsSaved')}</p>
          <p className="text-sm mt-1">{toast.message}</p>
        </div>
        <button onClick={onClose} className="ml-4 -mx-1.5 -my-1.5 bg-green-100 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex h-8 w-8" aria-label="Dismiss">
          <span className="sr-only">Dismiss</span>
          <XIcon />
        </button>
      </div>
    </div>
  );
};

export default Toast;
