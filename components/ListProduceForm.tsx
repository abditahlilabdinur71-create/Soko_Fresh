import React, { useState, useEffect } from 'react';
import { KENYAN_LOCATIONS } from '../constants';
import { t } from '../lib/i18n';

interface ListProduceFormProps {
  onFormSubmit: () => void;
}

const ListProduceForm: React.FC<ListProduceFormProps> = ({ onFormSubmit }) => {
  const [cropName, setCropName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [availableTowns, setAvailableTowns] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [buyerCompany, setBuyerCompany] = useState('');

  // Placeholder for the condition mentioned by the user.
  // This would be derived from props or state in a full implementation.
  const isEditingForSpecificBuyer = false;

  useEffect(() => {
    if (selectedCounty) {
      setAvailableTowns(KENYAN_LOCATIONS[selectedCounty] || []);
    } else {
      setAvailableTowns([]);
    }
    setSelectedTown(''); // Reset town selection when county changes
  }, [selectedCounty]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const location = `${selectedTown}, ${selectedCounty}`;
    // In a real app, this would submit to a backend.
    // Here we'll just log it and show a success message.
    console.log({
      cropName,
      quantity,
      price,
      location,
      imageName: image?.name,
      // FIX: Corrected a TypeError where a boolean could be spread into an object.
      // The expression `(isEditingForSpecificBuyer && { buyerCompany })` can evaluate to `false`, which is not a valid spread type.
      // The fix ensures that an empty object is spread when the condition is false.
      ...(isEditingForSpecificBuyer ? { buyerCompany } : {}),
    });
    alert(t('alerts.produceListed'));
    onFormSubmit();
  };

  const InputField = ({ label, id, type, value, onChange, placeholder, required = true }: { label: string, id: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, required?: boolean }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green"
      />
    </div>
  );

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('listProduceForm.title')}</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6 max-w-2xl mx-auto">
        <InputField label={t('listProduceForm.cropName')} id="cropName" type="text" value={cropName} onChange={(e) => setCropName(e.target.value)} placeholder={t('listProduceForm.cropNamePlaceholder')} />
        
        {isEditingForSpecificBuyer && (
          <InputField 
            label={t('listProduceForm.buyerCompany')} 
            id="buyerCompany" 
            type="text" 
            value={buyerCompany} 
            onChange={(e) => setBuyerCompany(e.target.value)} 
            placeholder={t('listProduceForm.buyerCompanyPlaceholder')} 
            required={false} 
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label={t('listProduceForm.quantity')} id="quantity" type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder={t('listProduceForm.quantityPlaceholder')} />
          <InputField label={t('listProduceForm.price')} id="price" type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder={t('listProduceForm.pricePlaceholder')} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">{t('listProduceForm.county')}</label>
            <select id="county" value={selectedCounty} onChange={(e) => setSelectedCounty(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green bg-white">
              <option value="">{t('listProduceForm.selectCounty')}</option>
              {Object.keys(KENYAN_LOCATIONS).sort().map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="town" className="block text-sm font-medium text-gray-700 mb-1">{t('listProduceForm.town')}</label>
            <select id="town" value={selectedTown} onChange={(e) => setSelectedTown(e.target.value)} required disabled={!selectedCounty} className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green bg-white disabled:bg-gray-100">
              <option value="">{t('listProduceForm.selectTown')}</option>
              {availableTowns.sort().map(town => (
                <option key={town} value={town}>{town}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('listProduceForm.uploadPhoto')}</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                  <img src={imagePreview} alt="Produce Preview" className="mx-auto h-24 w-auto rounded-md" />
              ) : (
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-green hover:text-brand-green-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-green">
                  <span>{t('listProduceForm.uploadFile')}</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                </label>
                <p className="pl-1">{t('listProduceForm.dragAndDrop')}</p>
              </div>
              <p className="text-xs text-gray-500">{t('listProduceForm.fileTypes')}</p>
            </div>
          </div>
        </div>
        <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors shadow-md">
          {t('listProduceForm.submitButton')}
        </button>
      </form>
    </div>
  );
};

export default ListProduceForm;