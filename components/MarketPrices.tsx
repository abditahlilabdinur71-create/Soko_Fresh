import React, { useState, useMemo, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ALL_PRICE_DATA, KENYAN_LOCATIONS } from '../constants';
import { t } from '../lib/i18n';
import { SearchIcon, XIcon } from './icons';

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

const CountySelector: React.FC<{
    selectedCounties: string[];
    onSelectionChange: (counties: string[]) => void;
}> = ({ selectedCounties, onSelectionChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const allCounties = useMemo(() => Object.keys(KENYAN_LOCATIONS).sort(), []);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredCounties = useMemo(() => 
        allCounties.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase())),
        [allCounties, searchTerm]
    );

    const handleToggleCounty = (county: string) => {
        const newSelection = selectedCounties.includes(county)
            ? selectedCounties.filter(c => c !== county)
            : [...selectedCounties, county];
        onSelectionChange(newSelection);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full sm:w-auto text-left bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-between shadow-sm"
            >
                <span className="text-gray-700">{t('marketPrices.selectCounties')} ({selectedCounties.length})</span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                    <div className="p-2 border-b">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('marketPrices.searchCounty')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md focus:ring-brand-green focus:border-brand-green"
                            />
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                                <SearchIcon />
                            </div>
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-2">
                        {filteredCounties.map(county => (
                            <label key={county} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedCounties.includes(county)}
                                    onChange={() => handleToggleCounty(county)}
                                    className="h-4 w-4 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                                />
                                <span className="text-sm text-gray-700">{county}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const MarketPrices: React.FC = () => {
  const cropOptions = Object.keys(ALL_PRICE_DATA);
  const [selectedCrop, setSelectedCrop] = useState<string>(cropOptions[0]);
  const [selectedCounties, setSelectedCounties] = useState<string[]>(['Nairobi', 'Kisumu', 'Eldoret']);

  const { data, unit } = ALL_PRICE_DATA[selectedCrop];
  
  const formatCropName = (name: string) => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const cropName = formatCropName(selectedCrop);

  const averagePrices = useMemo(() => {
    if (selectedCounties.length === 0) return [];
    return selectedCounties.map(county => {
        const total = data.reduce((acc, cur) => acc + (Number(cur[county]) || 0), 0);
        const average = data.length > 0 ? Math.round(total / data.length) : 0;
        return { county, average };
    });
  }, [data, selectedCounties]);


  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">{t('marketPrices.title')}</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex-grow">
              <h3 className="text-xl font-bold text-brand-green">{t('marketPrices.priceTrends', { cropName, unit })}</h3>
              <p className="text-sm text-gray-500 mt-1">{t('marketPrices.showingCounties', { count: selectedCounties.length })}</p>
          </div>
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg flex-wrap">
            {cropOptions.map(crop => {
                 const name = formatCropName(crop);
                 return (
                    <button
                        key={crop}
                        onClick={() => setSelectedCrop(crop)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedCrop === crop ? 'bg-brand-green text-white shadow' : 'text-gray-600'}`}
                        >
                        {name}
                    </button>
                 )
            })}
          </div>
        </div>

        <CountySelector selectedCounties={selectedCounties} onSelectionChange={setSelectedCounties} />

        <div style={{ width: '100%', height: 400 }} className="mt-6">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={['dataMin - 100', 'dataMax + 100']} />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
              />
              <Legend />
              {selectedCounties.map(county => (
                <Line 
                    key={county} 
                    type="monotone" 
                    dataKey={county} 
                    stroke={stringToColor(county)} 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                    dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-gray-700 mb-4">{t('marketPrices.averageSummary')}</h4>
        {averagePrices.length > 0 ? (
             <div className="flex overflow-x-auto space-x-4 pb-4">
                {averagePrices.map(({ county, average }) => (
                    <div key={county} className="bg-white p-4 rounded-lg shadow flex-shrink-0 w-48 text-center">
                        <p className="text-sm text-gray-500 truncate">{t('marketPrices.averageFor', { county })}</p>
                        <p className="text-2xl font-bold" style={{ color: stringToColor(county) }}>KES {average.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center p-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">{t('marketPrices.noCountySelected')}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default MarketPrices;