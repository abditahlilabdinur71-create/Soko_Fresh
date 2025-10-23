import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCE_LISTINGS, KENYAN_LOCATIONS } from '../constants';
import type { ProduceListing } from '../types';
import { LocationMarkerIcon, CalendarIcon, PhoneIcon, ChatBubbleIcon, ShoppingCartIcon } from './icons';
import StarRating from './StarRating';
import { t } from '../lib/i18n';
import MessageModal from './MessageModal';

interface ProduceCardProps {
  listing: ProduceListing;
  onMessageClick: (e: React.MouseEvent) => void;
  onCardClick: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
}

const ProduceCard: React.FC<ProduceCardProps> = ({ listing, onMessageClick, onCardClick, onAddToCart }) => (
  <div 
    className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 group flex flex-col"
    onClick={onCardClick}
  >
    <div className="overflow-hidden h-48 cursor-pointer">
      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={listing.imageUrl} alt={listing.crop} />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-xl font-bold text-brand-green">{listing.crop}</h3>
      <p className="text-gray-700 font-semibold">KES {listing.priceValue.toLocaleString()} {listing.priceUnit}</p>
      <p className="text-sm text-gray-500">{listing.quantity} {t('dashboard.card.availableSuffix')}</p>
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <LocationMarkerIcon />
          <span className="ml-2">{listing.location}</span>
        </div>
        <div className="flex items-center">
          <CalendarIcon />
          <span className="ml-2">{t('dashboard.card.availableFrom')} {listing.availabilityDate}</span>
        </div>
      </div>
       <div className="mt-4 border-t pt-4 flex-grow flex flex-col justify-end">
         <div className="flex items-center justify-between mb-4">
            <div>
                <p className="text-sm font-medium text-gray-800">{listing.farmerName}</p>
                <div className="mt-1">
                  <StarRating rating={listing.farmerAverageRating} interactive={false} />
                </div>
            </div>
             <div className="flex items-center space-x-2">
                <button 
                    onClick={onMessageClick}
                    className="bg-brand-green text-white p-2 rounded-full hover:bg-brand-green-light transition-colors"
                    aria-label={t('dashboard.card.messageFarmer')}
                >
                    <ChatBubbleIcon />
                </button>
                <a 
                    href={`tel:${listing.farmerContact}`}
                    onClick={(e) => e.stopPropagation()} 
                    className="bg-brand-green-light text-white p-2 rounded-full hover:bg-brand-green transition-colors"
                    aria-label={t('dashboard.card.callFarmer', { name: listing.farmerName })}
                >
                  <PhoneIcon />
                </a>
            </div>
         </div>
         <button
            onClick={onAddToCart}
            className="w-full bg-brand-brown text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2"
        >
            <ShoppingCartIcon />
            <span>{t('dashboard.card.addToCart')}</span>
         </button>
       </div>
    </div>
  </div>
);

interface DashboardProps {
  onSelectListing: (listing: ProduceListing) => void;
  onAddToCart: (listing: ProduceListing) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectListing, onAddToCart }) => {
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [availableTowns, setAvailableTowns] = useState<string[]>([]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [listingForMessage, setListingForMessage] = useState<ProduceListing | null>(null);

  const handleOpenMessageModal = (listing: ProduceListing) => {
    setListingForMessage(listing);
    setIsMessageModalOpen(true);
  };

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
    setListingForMessage(null);
  };

  useEffect(() => {
    if (selectedCounty) {
      setAvailableTowns(KENYAN_LOCATIONS[selectedCounty] || []);
    } else {
      setAvailableTowns([]);
    }
    setSelectedTown(''); // Reset town when county changes
  }, [selectedCounty]);

  const filteredListings = useMemo(() => {
    return PRODUCE_LISTINGS.filter(listing => {
      // Assuming location is "Town, County"
      const parts = listing.location.split(',').map(s => s.trim());
      const town = parts[0];
      const county = parts[1];

      const countyMatch = !selectedCounty || county === selectedCounty;
      const townMatch = !selectedTown || town === selectedTown;

      return countyMatch && townMatch;
    });
  }, [selectedCounty, selectedTown]);


  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 flex-shrink-0">{t('dashboard.title')}</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* County Filter */}
          <div className="w-full">
            <label htmlFor="county-filter" className="sr-only">{t('dashboard.filterByCounty')}</label>
            <select 
              id="county-filter" 
              value={selectedCounty} 
              onChange={(e) => setSelectedCounty(e.target.value)} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green bg-white"
            >
              <option value="">{t('dashboard.allCounties')}</option>
              {Object.keys(KENYAN_LOCATIONS).sort().map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
          </div>
          
          {/* Town Filter */}
          <div className="w-full">
            <label htmlFor="town-filter" className="sr-only">{t('dashboard.filterByTown')}</label>
            <select 
              id="town-filter"
              value={selectedTown} 
              onChange={(e) => setSelectedTown(e.target.value)} 
              disabled={!selectedCounty}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green bg-white disabled:bg-gray-100"
            >
              <option value="">{t('dashboard.allTowns')}</option>
              {availableTowns.sort().map(town => (
                <option key={town} value={town}>{town}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <ProduceCard 
              key={listing.id} 
              listing={listing} 
              onCardClick={() => onSelectListing(listing)}
              onMessageClick={(e) => { e.stopPropagation(); handleOpenMessageModal(listing); }}
              onAddToCart={(e) => { e.stopPropagation(); onAddToCart(listing); }}
            />
          ))
        ) : (
           <div className="col-span-full text-center py-12">
             <p className="text-gray-500 text-lg">{t('dashboard.noListings')}</p>
           </div>
        )}
      </div>

      {isMessageModalOpen && listingForMessage && (
        <MessageModal
          listing={listingForMessage}
          onClose={handleCloseMessageModal}
        />
      )}
    </div>
  );
};

export default Dashboard;