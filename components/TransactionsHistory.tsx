import React, { useState, useMemo, useEffect } from 'react';
import { TRANSACTIONS } from '../constants';
import type { Transaction } from '../types';
import { SearchIcon, LocationMarkerIcon, ClearSearchIcon, ArrowUpIconSmall, ArrowDownIconSmall } from './icons';
import { t } from '../lib/i18n';
import StarRating from './StarRating';
import { rateUser } from '../services/authService';


const statusColors: { [key in Transaction['status']]: string } = {
  Completed: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-red-100 text-red-800',
};

type SortKey = 'price' | 'date' | 'status';

const TransactionsHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };
  
  const handleRateTransaction = (transactionId: string, rating: number) => {
    const txToUpdate = transactions.find(tx => tx.id === transactionId);
    if (!txToUpdate) return;
    
    // Call the service to update the farmer's overall rating
    const success = rateUser(txToUpdate.farmerEmail, rating);
    
    if (success) {
      // Update the local state to reflect the new rating for this transaction
      setTransactions(prevTransactions =>
        prevTransactions.map(tx =>
          tx.id === transactionId ? { ...tx, rating } : tx
        )
      );
    } else {
        alert("Failed to save rating. Please try again.");
    }
  };

  const sortedAndFilteredTransactions = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    
    const filtered = transactions.filter(tx =>
      tx.crop.toLowerCase().includes(lowercasedQuery) ||
      tx.buyer.name.toLowerCase().includes(lowercasedQuery)
    );

    if (!sortKey) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  }, [searchQuery, sortKey, sortOrder, transactions]);

  const SortableHeader: React.FC<{ label: string; columnKey: SortKey }> = ({ label, columnKey }) => (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <button onClick={() => handleSort(columnKey)} className="flex items-center space-x-1 focus:outline-none group">
        <span className="group-hover:text-gray-700">{label}</span>
        {sortKey === columnKey && (
          <span className="text-gray-700">
            {sortOrder === 'asc' ? <ArrowUpIconSmall /> : <ArrowDownIconSmall />}
          </span>
        )}
      </button>
    </th>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">{t('transactionsHistory.title')}</h2>
        <div className="relative w-full md:w-auto md:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder={t('transactionsHistory.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Clear search"
            >
              <ClearSearchIcon />
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('transactionsHistory.headers.transactionId')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('transactionsHistory.headers.crop')}</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('transactionsHistory.headers.buyer')}</th>
                <SortableHeader label={t('transactionsHistory.headers.amount')} columnKey="price" />
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('transactionsHistory.headers.paymentMethod')}</th>
                <SortableHeader label={t('transactionsHistory.headers.date')} columnKey="date" />
                <SortableHeader label={t('transactionsHistory.headers.status')} columnKey="status" />
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('transactionsHistory.headers.rating')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAndFilteredTransactions.length > 0 ? (
                sortedAndFilteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.crop} ({tx.quantity})</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium text-gray-900">{tx.buyer.name}</div>
                      {tx.buyer.company && <div className="text-gray-500 italic">{tx.buyer.company}</div>}
                      <div className="text-gray-500">{tx.buyer.contact}</div>
                      <div className="flex items-center text-gray-500 mt-1">
                        <LocationMarkerIcon />
                        <span className="ml-1.5">{tx.buyer.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">KES {tx.price.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[tx.status]}`}>
                        {tx.status}
                      </span>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tx.status === 'Completed' ? (
                            tx.rating ? (
                                <StarRating rating={tx.rating} interactive={false} />
                            ) : (
                                <StarRating rating={0} interactive={true} onRate={(rating) => handleRateTransaction(tx.id, rating)} />
                            )
                        ) : (
                            <span className="text-gray-400">-</span>
                        )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500 text-lg">
                    {t('transactionsHistory.noTransactions')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsHistory;