import React, { useState } from 'react';
import type { ProduceListing, CropDetail } from '../types';
import { CROP_DETAILS_DATA } from '../constants';
import { t } from '../lib/i18n';
import { ArrowLeftIcon, PlusIcon, MinusIcon, ShoppingCartIcon } from './icons';

interface CropDetailsProps {
  listing: ProduceListing;
  onBack: () => void;
  onAddToCart: (listing: ProduceListing, quantity: number) => void;
}

const CropDetails: React.FC<CropDetailsProps> = ({ listing, onBack, onAddToCart }) => {
  const cropId = listing.crop.toLowerCase();
  const details: CropDetail | undefined = CROP_DETAILS_DATA[cropId];
  const [quantity, setQuantity] = useState(1);
  
  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };
  
  const handleAddToCartClick = () => {
    onAddToCart(listing, quantity);
  }

  const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-bold text-brand-green mb-3">{title}</h3>
      <div className="text-gray-700 space-y-2">{children}</div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-brand-green font-semibold mb-6 hover:underline"
      >
        <ArrowLeftIcon />
        <span>{t('cropDetails.backButton')}</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:h-full md:w-64" src={listing.imageUrl} alt={listing.crop} />
          </div>
          <div className="p-8 flex flex-col justify-between">
            <div>
                <div className="uppercase tracking-wide text-sm text-brand-green font-semibold">{t('cropDetails.title')}</div>
                <h1 className="block mt-1 text-3xl leading-tight font-bold text-black">{listing.crop}</h1>
                <p className="mt-2 text-gray-500">{t('cropDetails.listedBy', { name: listing.farmerName })}</p>
                <p className="mt-4 text-2xl font-bold text-gray-800">
                  KES {listing.priceValue.toLocaleString()} {listing.priceUnit}
                </p>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => handleQuantityChange(-1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"><MinusIcon /></button>
                  <input type="text" value={quantity} readOnly className="w-12 text-center font-bold border-x focus:outline-none bg-white" />
                  <button onClick={() => handleQuantityChange(1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"><PlusIcon /></button>
              </div>
              <button
                onClick={handleAddToCartClick}
                className="flex-1 bg-brand-brown text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2"
              >
                  <ShoppingCartIcon />
                  <span>{t('dashboard.card.addToCart')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {details ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailSection title={t('cropDetails.history')}>
            <p className="text-sm leading-relaxed">{details.history}</p>
          </DetailSection>
          <DetailSection title={t('cropDetails.optimalConditions')}>
            <p className="text-sm leading-relaxed">{details.optimalConditions}</p>
          </DetailSection>
           {details.varieties && (
             <DetailSection title={t('cropDetails.varieties')}>
                <ul className="list-disc list-inside text-sm">
                    {details.varieties.map((v, i) => <li key={i}>{v}</li>)}
                </ul>
             </DetailSection>
           )}
           {details.marketInfo && (
             <DetailSection title={t('cropDetails.marketInfo')}>
                <p className="text-sm leading-relaxed">{details.marketInfo}</p>
             </DetailSection>
           )}
           {details.harvestingTips && (
             <DetailSection title={t('cropDetails.harvestingTips')}>
                <p className="text-sm leading-relaxed">{details.harvestingTips}</p>
             </DetailSection>
           )}
          <DetailSection title={t('cropDetails.commonPests')}>
            <ul className="list-disc list-inside text-sm">
              {details.commonPests.map((pest, index) => <li key={index}>{pest}</li>)}
            </ul>
          </DetailSection>
          {details.nutritionalValue && (
            <DetailSection title={t('cropDetails.nutritionalValue')}>
                <p className="text-sm leading-relaxed">{details.nutritionalValue}</p>
            </DetailSection>
          )}
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">{t('cropDetails.noDetails')}</p>
        </div>
      )}

    </div>
  );
};

export default CropDetails;