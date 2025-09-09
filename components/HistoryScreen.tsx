
import React from 'react';
import { Ad } from '../types';
import AdCard from './AdCard';
import { HistoryIcon } from './icons';

interface HistoryScreenProps {
  ads: Ad[];
  toggleFavorite: (adId: string) => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({ ads, toggleFavorite }) => {
  if (ads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary p-8">
        <HistoryIcon className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-bold text-text-primary">No Ads Yet</h2>
        <p className="mt-2 max-w-xs">Your generated ads will appear here. Go to the 'Generate' tab to create your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {ads.map(ad => (
        <AdCard key={ad.id} ad={ad} toggleFavorite={toggleFavorite} />
      ))}
    </div>
  );
};

export default HistoryScreen;
