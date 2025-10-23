export type Language = 'en' | 'sw';

let translations: Record<Language, Record<string, any>> | null = null;

// --- State Management ---

const getInitialLanguage = (): Language => {
  // Guard against running in a non-browser environment (e.g., during a server-side build)
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || typeof localStorage === 'undefined') {
    return 'en'; // Default language for server/build environment
  }

  // Check for language preference in localStorage first
  const storedLang = localStorage.getItem('sokoFreshLang');
  if (storedLang === 'en' || storedLang === 'sw') {
    return storedLang;
  }
  // Fallback to browser language
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'sw' ? 'sw' : 'en';
};


let currentLanguage: Language = getInitialLanguage();
const listeners: Set<() => void> = new Set();

export const setLanguage = (lang: Language) => {
  if (currentLanguage !== lang) {
    currentLanguage = lang;
    localStorage.setItem('sokoFreshLang', lang); // Persist selection
    listeners.forEach(listener => listener());
  }
};

export const getLanguage = (): Language => {
  return currentLanguage;
};

// Allows React components to subscribe to language changes
export const subscribe = (listener: () => void) => {
    listeners.add(listener);
    // Return an unsubscribe function
    return () => {
        listeners.delete(listener);
    };
};
// --- End State Management ---

let initPromise: Promise<void> | null = null;

/**
 * Initializes the i18n system by fetching translation files.
 * This function is idempotent and can be called multiple times.
 */
export const initI18n = () => {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        const [enResponse, swResponse] = await Promise.all([
          fetch('./locales/en.json'),
          fetch('./locales/sw.json'),
        ]);

        if (!enResponse.ok || !swResponse.ok) {
          throw new Error(`Failed to load translation files: ${enResponse.statusText}, ${swResponse.statusText}`);
        }

        const enData = await enResponse.json();
        const swData = await swResponse.json();
        
        translations = {
          en: enData,
          sw: swData,
        };
      } catch (error) {
        console.error("Failed to initialize i18n:", error);
        // Prevent app from getting stuck in loading state on error.
        // It will render keys instead of text, but it won't crash.
        translations = { en: {}, sw: {} }; 
      }
    })();
  }
  return initPromise;
};

const getNestedValue = (obj: any, path: string[]): string | undefined => {
  return path.reduce((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return current[key];
    }
    return undefined;
  }, obj);
};

/**
 * A simple translation function that retrieves strings from the JSON files.
 * It uses the currently selected language and falls back to English if a key is missing.
 * @param key The key of the translation string (e.g., 'dashboard.title').
 * @param replacements An object of placeholders to replace (e.g., { name: 'John' }).
 * @returns The translated string or the key if not found.
 */
export const t = (key: string, replacements?: { [key: string]: string | number }): string => {
  if (!translations) {
    console.warn(`i18n not initialized yet. Called t for key: ${key}`);
    return key;
  }
  
  const keys = key.split('.');
  
  let translated = getNestedValue(translations[currentLanguage], keys);

  if (translated === undefined) {
    console.warn(`Translation key '${key}' not found in '${currentLanguage}'. Falling back to 'en'.`);
    translated = getNestedValue(translations['en'], keys);
  }

  if (translated === undefined || typeof translated !== 'string') {
    if (translated !== undefined) {
      console.warn(`Translation key '${key}' did not resolve to a string.`);
    } else {
      console.warn(`Translation key '${key}' not found in any language.`);
    }
    return key;
  }

  let result = translated;
  if (replacements) {
    for (const placeholder of Object.keys(replacements)) {
      const regex = new RegExp(`{{${placeholder}}}`, 'g');
      result = result.replace(regex, String(replacements[placeholder]));
    }
  }

  return result;
};
