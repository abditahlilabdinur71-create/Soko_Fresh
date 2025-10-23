export interface ProduceListing {
  id: number;
  farmerName: string;
  farmerContact: string;
  farmerEmail: string;
  farmerAverageRating: number;
  crop: string;
  quantity: string;
  priceValue: number;
  priceUnit: string;
  location: string;
  imageUrl: string;
  availabilityDate: string;
  buyerCompanyName?: string;
}

export interface CartItem {
  listing: ProduceListing;
  quantity: number;
}

export interface Transaction {
  id: string;
  crop: string;
  buyer: {
    name: string;
    contact: string;
    company?: string;
    location: string;
  };
  farmerEmail: string;
  price: number;
  quantity: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  paymentMethod: string;
  rating?: number;
}

export interface PriceData {
    name: string; // Month e.g., 'Jan'
    [county: string]: number | string; // All other keys are county names with number values
}

export interface MarketAssistantMessage {
  id: number;
  sender: 'user' | 'bot';
  type: 'text' | 'video_loading' | 'video';
  text: string;
  videoUrl?: string;
  groundingChunks?: any[];
}

export interface User {
  name: string;
  county: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  ratingSum: number;
  ratingCount: number;
}

export interface CropDetail {
  id: string; // lowercase crop name e.g. 'maize'
  name: string;
  history: string;
  commonPests: string[];
  optimalConditions: string;
  nutritionalValue?: string;
  marketInfo?: string;
  harvestingTips?: string;
  varieties?: string[];
}


// FIX: To resolve a TypeScript error about subsequent property declarations, the `AIStudio` interface
// is defined directly within the `declare global` block. This ensures a single, globally-scoped definition
// that prevents type conflicts when augmenting the `window` object.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}