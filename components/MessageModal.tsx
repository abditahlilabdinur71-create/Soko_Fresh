import React, { useState, useEffect, useRef } from 'react';
import type { ProduceListing } from '../types';
import { t } from '../lib/i18n';
import { XIcon, PaperAirplaneIcon } from './icons';

interface MessageModalProps {
  listing: ProduceListing;
  onClose: () => void;
}

interface Message {
    sender: 'user' | 'farmer';
    text: string;
}

const MessageModal: React.FC<MessageModalProps> = ({ listing, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [farmerStatus, setFarmerStatus] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        // Simulate farmer's online status when the modal opens
        const isOnline = Math.random() > 0.4; // 60% chance of being online
        if (isOnline) {
            setFarmerStatus(t('messageModal.statusOnline'));
        } else {
            const minutesAgo = Math.floor(Math.random() * 59) + 1;
            setFarmerStatus(t('messageModal.lastSeen', { time: `${minutesAgo}m ago` }));
        }

        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const userMessage: Message = { sender: 'user', text: input };
        const newMessages = [...messages, userMessage];
        
        setMessages(newMessages);
        setInput('');

        setTimeout(() => {
            const farmerResponse: Message = { 
                sender: 'farmer', 
                text: t('messageModal.initialResponse', { crop: listing.crop.toLowerCase() })
            };
            setMessages(prev => [...prev, farmerResponse]);
        }, 1000);
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col h-[80vh] max-h-[600px] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div>
                        <h3 className="text-xl font-bold text-brand-green">
                            {t('messageModal.title', { farmerName: listing.farmerName })}
                        </h3>
                        {farmerStatus && (
                            <div className="flex items-center space-x-1.5 mt-1">
                                {farmerStatus === t('messageModal.statusOnline') && (
                                    <span className="block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                )}
                                <p className={`text-xs ${farmerStatus === t('messageModal.statusOnline') ? 'text-green-600' : 'text-gray-500'}`}>
                                    {farmerStatus}
                                </p>
                            </div>
                        )}
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XIcon />
                    </button>
                </div>

                {/* Chat Body */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'farmer' && <img src={`https://picsum.photos/seed/${listing.farmerName}/40/40`} alt="Farmer" className="w-8 h-8 rounded-full flex-shrink-0" />}
                            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-green text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <div className="p-4 border-t bg-gray-50">
                    <form onSubmit={handleSendMessage} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t('messageModal.inputPlaceholder')}
                            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-brand-green focus:border-brand-green"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={input.trim() === ''}
                            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-12 text-white bg-brand-green rounded-full transform scale-90 hover:bg-brand-green-light disabled:bg-gray-300 transition-colors"
                            aria-label={t('messageModal.sendButton')}
                        >
                            <PaperAirplaneIcon />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;