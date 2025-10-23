import React, { useState } from 'react';
import { t } from '../lib/i18n';
import { XIcon, FacebookIcon, TwitterIcon, WhatsAppIcon, LinkedInIcon, LinkIcon } from './icons';

interface ShareModalProps {
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
    const [isCopied, setIsCopied] = useState(false);

    const shareUrl = window.location.origin;
    const shareText = t('share.text');
    const shareTitle = t('app.title');

    const socialPlatforms = [
        {
            name: t('share.facebook'),
            icon: <FacebookIcon className="w-8 h-8 text-[#1877F2]" />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: t('share.twitter'),
            icon: <TwitterIcon className="w-8 h-8 text-black" />,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
        },
        {
            name: t('share.whatsapp'),
            icon: <WhatsAppIcon className="w-8 h-8 text-[#25D366]" />,
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}%20${encodeURIComponent(shareUrl)}`,
        },
        {
            name: t('share.linkedin'),
            icon: <LinkedInIcon className="w-8 h-8 text-[#0A66C2]" />,
            url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareText)}`,
        },
    ];

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy link.');
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 id="share-modal-title" className="text-xl font-bold text-brand-green">
                        {t('share.modalTitle')}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close">
                        <XIcon />
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        {socialPlatforms.map(platform => (
                            <a 
                                key={platform.name}
                                href={platform.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-gray-100 transition-colors group"
                            >
                                <div className="p-3 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                                    {platform.icon}
                                </div>
                                <span className="mt-2 text-xs text-gray-600 font-medium">{platform.name}</span>
                            </a>
                        ))}
                    </div>

                    <div className="mt-6">
                        <label htmlFor="share-link" className="text-sm font-medium text-gray-700 sr-only">Shareable Link</label>
                        <div className="flex items-center space-x-2">
                            <div className="flex-1 relative">
                                <input
                                    id="share-link"
                                    type="text"
                                    readOnly
                                    value={shareUrl}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LinkIcon />
                                </div>
                            </div>
                            <button
                                onClick={handleCopyLink}
                                className="px-4 py-2 bg-brand-green text-white font-semibold rounded-lg hover:bg-brand-green-light transition-colors text-sm w-28 text-center"
                            >
                                {isCopied ? t('share.copied') : t('share.copyLink')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;