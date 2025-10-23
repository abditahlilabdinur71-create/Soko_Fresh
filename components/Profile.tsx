import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../types';
import { KENYAN_LOCATIONS } from '../constants';
import { t } from '../lib/i18n';
import StarRating from './StarRating';

interface ProfileProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset form data if the user prop changes (e.g., from parent)
    setFormData(user);
    setAvatarPreview(null); // Clear preview when user data changes
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        setFormData(prev => ({ ...prev, avatarUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const InfoField = ({ label, value }: { label: string, value: string }) => (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-lg text-gray-900">{value}</p>
    </div>
  );
  
  const averageRating = user.ratingCount > 0 ? user.ratingSum / user.ratingCount : 0;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('profile.title')}</h2>
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
        <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6 mb-8 text-center sm:text-left">
          <div className="relative mb-4 sm:mb-0">
            <img 
              className="h-28 w-28 rounded-full object-cover ring-4 ring-brand-green-light/50" 
              src={avatarPreview || formData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=228B22&color=fff&size=128`} 
              alt="Profile Avatar"
            />
            {isEditing && (
              <>
                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-brand-green text-white p-2 rounded-full hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-transform hover:scale-110"
                  aria-label={t('profile.changePhoto')}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                </button>
              </>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
            <p className="text-md text-gray-500">{user.county} {t('profile.countySuffix')}</p>
            <div className="mt-2 flex items-center justify-center sm:justify-start space-x-2">
                <StarRating rating={averageRating} />
                <span className="text-sm text-gray-500">
                    {user.ratingCount > 0 ? t('profile.ratingDetails', { count: user.ratingCount }) : t('profile.noRatingsYet')}
                </span>
            </div>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-6">
            <InfoField label={t('profile.fullName')} value={user.name} />
            <InfoField label={t('auth.emailLabel')} value={user.email} />
            <InfoField label={t('profile.phoneNumber')} value={user.phone} />
            <InfoField label={t('common.county')} value={user.county} />
            <button
              onClick={() => setIsEditing(true)}
              className="w-full mt-4 bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors shadow-md"
            >
              {t('profile.editButton')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('profile.fullName')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green"
              />
            </div>
             <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('auth.emailLabel')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green bg-gray-100 cursor-not-allowed"
                title="Email cannot be changed."
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{t('profile.phoneNumber')}</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green"
              />
            </div>
            <div>
              <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">{t('common.county')}</label>
              <select 
                id="county" 
                name="county" 
                value={formData.county} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green bg-white"
              >
                <option value="">{t('profile.selectCounty')}</option>
                {Object.keys(KENYAN_LOCATIONS).sort().map(county => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {t('profile.cancelButton')}
              </button>
              <button
                type="submit"
                className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors shadow-md"
              >
                {t('profile.saveButton')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;