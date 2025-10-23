import React, { useState, useEffect } from 'react';
import { ALL_PRICE_DATA } from '../constants';
import { t } from '../lib/i18n';
import { CheckCircleIcon } from './icons';

interface SettingsProps {
  smsEnabled: boolean;
  setSmsEnabled: (enabled: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ smsEnabled, setSmsEnabled }) => {
  const [buyerInterestAlerts, setBuyerInterestAlerts] = useState(true);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const availableCrops = Object.keys(ALL_PRICE_DATA);

  useEffect(() => {
    let timer: number;
    if (feedbackMessage) {
      timer = window.setTimeout(() => {
        setFeedbackMessage('');
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [feedbackMessage]);

  const handleCropToggle = (crop: string) => {
    setSelectedCrops(prev =>
      prev.includes(crop)
        ? prev.filter(c => c !== crop)
        : [...prev, crop]
    );
  };

  const handleSaveSettings = () => {
    let messageBody = '';
    if (smsEnabled) {
        const enabledAlerts = [];
        if(buyerInterestAlerts) {
            enabledAlerts.push(t('alerts.buyerInterest'));
        }
        if (selectedCrops.length > 0) {
            const cropNames = selectedCrops.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ');
            enabledAlerts.push(t('alerts.priceChangesFor', { crops: cropNames }));
        }
        
        if (enabledAlerts.length > 0) {
            messageBody = `${t('alerts.smsEnabledFor')}\n- ${enabledAlerts.join('\n- ')}`;
        } else {
            messageBody = t('alerts.smsEnabledNoSelection');
        }
    } else {
        messageBody = t('alerts.smsDisabled');
    }
    
    setFeedbackMessage(messageBody);
  };
  
  const ToggleSwitch = ({ id, label, checked, onChange, disabled = false }: { id: string, label: string, checked: boolean, onChange: () => void, disabled?: boolean }) => (
     <div className={`flex items-center justify-between bg-gray-50 p-4 rounded-lg ${disabled ? 'opacity-50' : ''}`}>
        <span className="font-medium text-gray-700">{label}</span>
        <label htmlFor={id} className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <input type="checkbox" id={id} className="sr-only peer" checked={checked} onChange={onChange} disabled={disabled} />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-brand-green-light/30 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
        </label>
    </div>
  );

  return (
    <div>
      {feedbackMessage && (
        <div className="fixed top-24 right-6 bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg shadow-lg z-50 w-full max-w-sm animate-fade-in-down" role="alert">
            <div className="flex">
                <div className="py-1"><CheckCircleIcon /></div>
                <div className="ml-3">
                    <p className="font-bold">{t('alerts.settingsSaved')}</p>
                    <div className="text-sm mt-1 whitespace-pre-wrap">{feedbackMessage}</div>
                </div>
            </div>
        </div>
      )}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('settings.title')}</h2>
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto space-y-8">
        
        <div>
          <h3 className="text-xl font-bold text-brand-green mb-2">{t('settings.smsNotifications')}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {t('settings.smsDescription')}
          </p>
          <ToggleSwitch 
            id="sms-toggle"
            label={t('settings.enableSmsService')}
            checked={smsEnabled}
            onChange={() => setSmsEnabled(!smsEnabled)}
          />
        </div>

        <div className={`space-y-6 transition-opacity duration-300 ${!smsEnabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">{t('settings.buyerAlerts')}</h4>
                <ToggleSwitch
                    id="buyer-interest-toggle"
                    label={t('settings.notifyBuyerInterest')}
                    checked={buyerInterestAlerts}
                    onChange={() => setBuyerInterestAlerts(!buyerInterestAlerts)}
                    disabled={!smsEnabled}
                />
            </div>

            <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">{t('settings.priceAlerts')}</h4>
                <p className="text-sm text-gray-500 mb-4">{t('settings.priceAlertsDescription')}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {availableCrops.map(crop => {
                        const cropName = crop.charAt(0).toUpperCase() + crop.slice(1);
                        return (
                            <label key={crop} className={`flex items-center space-x-3 bg-white border p-3 rounded-lg transition-colors ${!smsEnabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-brand-green'}`}>
                                <input
                                    type="checkbox"
                                    checked={selectedCrops.includes(crop)}
                                    onChange={() => handleCropToggle(crop)}
                                    disabled={!smsEnabled}
                                    className="h-5 w-5 rounded border-gray-300 text-brand-green focus:ring-brand-green disabled:opacity-70"
                                />
                                <span className="text-sm font-medium text-gray-700">{cropName}</span>
                            </label>
                        )
                    })}
                </div>
            </div>
        </div>
        
        <button 
          onClick={handleSaveSettings}
          className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors shadow-md"
        >
          {t('settings.saveButton')}
        </button>

      </div>
    </div>
  );
};

export default Settings;