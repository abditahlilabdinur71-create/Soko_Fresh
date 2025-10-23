import React from 'react';
import type { CartItem } from '../types';
import { t } from '../lib/i18n';
import { PlusIcon, MinusIcon, TrashIcon, ShoppingCartIcon } from './icons';

interface CartProps {
  cart: CartItem[];
  onUpdateQuantity: (listingId: number, newQuantity: number) => void;
  onRemoveItem: (listingId: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, onUpdateQuantity, onRemoveItem, onCheckout }) => {
    
    const subtotal = cart.reduce((sum, item) => sum + (item.listing.priceValue * item.quantity), 0);

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('cart.title')}</h2>

            {cart.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center">
                    <ShoppingCartIcon />
                    <p className="mt-4 text-xl text-gray-500">{t('cart.empty')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 space-y-4">
                        {cart.map(item => (
                            <div key={item.listing.id} className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                    <img src={item.listing.imageUrl} alt={item.listing.crop} className="w-20 h-20 rounded-lg object-cover" />
                                    <div>
                                        <p className="font-bold text-lg text-gray-800">{item.listing.crop}</p>
                                        <p className="text-sm text-gray-500">KES {item.listing.priceValue.toLocaleString()} {item.listing.priceUnit}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button onClick={() => onUpdateQuantity(item.listing.id, item.quantity - 1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"><MinusIcon /></button>
                                        <input type="text" value={item.quantity} readOnly className="w-12 text-center font-bold border-x focus:outline-none bg-white" />
                                        <button onClick={() => onUpdateQuantity(item.listing.id, item.quantity + 1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"><PlusIcon /></button>
                                    </div>
                                    <p className="font-bold text-gray-800 w-24 text-right">
                                        KES {(item.listing.priceValue * item.quantity).toLocaleString()}
                                    </p>
                                    <button onClick={() => onRemoveItem(item.listing.id)} className="text-red-500 hover:text-red-700 p-2">
                                        <TrashIcon />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-3">{t('cart.orderSummary')}</h3>
                            <div className="space-y-3 mt-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>{t('cart.subtotal')}</span>
                                    <span>KES {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>{t('cart.shipping')}</span>
                                    <span>{t('cart.shippingValue')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 border-b pb-3">
                                    <span>{t('cart.tax')}</span>
                                    <span>{t('cart.taxValue')}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>{t('cart.total')}</span>
                                    <span>KES {subtotal.toLocaleString()}</span>
                                </div>
                            </div>
                            <button 
                                onClick={onCheckout}
                                className="w-full mt-6 bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors shadow-md"
                            >
                                {t('cart.checkoutButton')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
