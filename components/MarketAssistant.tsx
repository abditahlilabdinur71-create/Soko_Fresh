import React, { useState, useRef, useEffect, useMemo } from 'react';
// FIX: The global `window.aistudio` type is now defined in `types.ts` to avoid declaration conflicts.
// The `AIStudio` type import is no longer needed here.
import type { MarketAssistantMessage } from '../types';
import { getMarketAdvice, generateVideo } from '../services/geminiService';
import { SparklesIcon, PaperAirplaneIcon, VideoCameraIcon, SmallLocationMarkerIcon } from './icons';
import { t, getLanguage, subscribe, Language } from '../lib/i18n';

const MarketAssistant: React.FC = () => {
  const [lang, setLang] = useState<Language>(getLanguage());
  const [conversation, setConversation] = useState<MarketAssistantMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkApiKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        setHasApiKey(await window.aistudio.hasSelectedApiKey());
      }
    };
    checkApiKey();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          console.warn(`Geolocation error: ${error.message}`);
          setLocationError(t('marketAssistant.geolocation.error'));
        }
      );
    } else {
      setLocationError(t('marketAssistant.geolocation.notSupported'));
    }

    const unsubscribe = subscribe(() => setLang(getLanguage()));
    return unsubscribe;
  }, [lang]);

  const initialMessage = useMemo<MarketAssistantMessage>(() => ({
    id: 0,
    sender: 'bot',
    type: 'text',
    text: t('marketAssistant.initialMessage'),
  }), [lang]);

  const messages = useMemo(() => [initialMessage, ...conversation], [initialMessage, conversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSelectApiKey = async () => {
    if (window.aistudio?.openSelectKey) {
        await window.aistudio.openSelectKey();
        // Optimistically update the UI, assuming the user selected a key.
        // A failed API call will reset this if the key is invalid.
        setHasApiKey(true);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || isLoading) return;

    const userMessage: MarketAssistantMessage = { 
      id: Date.now(), 
      sender: 'user', 
      type: 'text', 
      text: input 
    };
    setConversation((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    const botMessageId = Date.now() + 1;

    if (isVideoMode) {
      const loadingMessage: MarketAssistantMessage = {
        id: botMessageId,
        sender: 'bot',
        type: 'video_loading',
        text: t('marketAssistant.video.generating', { prompt: currentInput })
      };
      setConversation(prev => [...prev, loadingMessage]);

      try {
        const videoUrl = await generateVideo(currentInput);
        const videoMessage: MarketAssistantMessage = {
          id: botMessageId, // Use same ID to replace
          sender: 'bot',
          type: 'video',
          text: t('marketAssistant.video.generated', { prompt: currentInput }),
          videoUrl
        };
        setConversation(prev => prev.map(m => m.id === botMessageId ? videoMessage : m));
      } catch (error) {
        if (error instanceof Error && error.message === 'API_KEY_INVALID') {
            setHasApiKey(false); // Reset API key status
            setIsVideoMode(false); // Revert to text mode
        }
        const errorMessage: MarketAssistantMessage = {
          id: botMessageId, // Use same ID to replace
          sender: 'bot',
          type: 'text',
          text: error instanceof Error ? error.message : t('marketAssistant.gemini.genericError'),
        };
        setConversation(prev => prev.map(m => m.id === botMessageId ? errorMessage : m));
      }
    } else {
      try {
        const botResponse = await getMarketAdvice(currentInput, userLocation ?? undefined);
        const botMessage: MarketAssistantMessage = { 
          id: botMessageId, 
          sender: 'bot', 
          type: 'text', 
          text: botResponse.text,
          groundingChunks: botResponse.groundingChunks,
        };
        setConversation((prev) => [...prev, botMessage]);
      } catch (error) {
        const errorMessage: MarketAssistantMessage = { 
          id: botMessageId,
          sender: 'bot', 
          type: 'text', 
          text: t('marketAssistant.errorMessage') 
        };
        setConversation((prev) => [...prev, errorMessage]);
      }
    }
    
    setIsLoading(false);
  };

  const isSendDisabled = isLoading || input.trim() === '' || (isVideoMode && !hasApiKey);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <SparklesIcon />
        <h2 className="text-3xl font-bold text-gray-800">{t('marketAssistant.title')}</h2>
        <p className="text-gray-500">{t('marketAssistant.tagline')}</p>
      </div>

      {!hasApiKey && isVideoMode && (
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg mb-4 animate-fade-in">
              <p className="font-bold">{t('marketAssistant.apiKey.title')}</p>
              <p className="text-sm mt-1">{t('marketAssistant.apiKey.description')}</p>
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-1 block">{t('marketAssistant.apiKey.learnMore')}</a>
              <button onClick={handleSelectApiKey} className="mt-2 bg-brand-green text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-green-light transition-colors">
                  {t('marketAssistant.apiKey.selectKeyButton')}
              </button>
          </div>
      )}
      
      <div className="flex-1 bg-white rounded-xl shadow-lg p-4 flex flex-col overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white flex-shrink-0"><SparklesIcon/></div>}
              <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-green text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                 {msg.type === 'text' && (
                  <div>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                      <div className="mt-3 border-t pt-2">
                        <h4 className="text-xs font-bold text-gray-600 uppercase mb-1">{t('marketAssistant.sourcesTitle')}</h4>
                        <ul className="space-y-1">
                          {msg.groundingChunks.map((chunk, index) => {
                            if (chunk.maps) {
                              return (
                                <li key={`map-chunk-${index}`}>
                                  <a href={chunk.maps.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1.5">
                                    <SmallLocationMarkerIcon />
                                    <span>{chunk.maps.title}</span>
                                  </a>
                                </li>
                              );
                            }
                            return null;
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                 )}
                 {msg.type === 'video_loading' && (
                   <div className="text-sm">
                     <p className="font-semibold">{msg.text}</p>
                     <div className="flex items-center space-x-1 mt-2">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                     </div>
                     <p className="text-xs text-gray-500 mt-2">{t('marketAssistant.video.pleaseWait')}</p>
                   </div>
                 )}
                 {msg.type === 'video' && msg.videoUrl && (
                   <div className="text-sm">
                     <p>{msg.text}</p>
                     <video src={msg.videoUrl} controls className="mt-2 rounded-lg w-full max-w-sm" preload="metadata">
                       {t('marketAssistant.video.browserNotSupported')}
                     </video>
                   </div>
                 )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="mt-4">
        {locationError && (
          <p className="text-xs text-center text-red-600 mb-2">{locationError}</p>
        )}
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isVideoMode ? t('marketAssistant.video.inputPlaceholder') : t('marketAssistant.inputPlaceholder')}
            disabled={isLoading || (isVideoMode && !hasApiKey)}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full shadow-sm focus:ring-brand-green focus:border-brand-green"
          />
          <button
            type="button"
            onClick={() => setIsVideoMode(prev => !prev)}
            className={`absolute inset-y-0 left-0 flex items-center justify-center w-12 h-12 rounded-full transition-colors ${isVideoMode ? 'text-brand-green' : 'text-gray-400 hover:text-gray-600'}`}
            aria-label={t('marketAssistant.video.toggleVideo')}
          >
            <VideoCameraIcon />
          </button>
          <button
            type="submit"
            disabled={isSendDisabled}
            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-12 text-white bg-brand-green rounded-full transform scale-90 hover:bg-brand-green-light disabled:bg-gray-300 transition-colors"
          >
            <PaperAirplaneIcon />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MarketAssistant;