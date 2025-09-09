
import React from 'react';
import { Ad } from '../types';
import AdCard from './AdCard';
import { FavoritesIcon } from './icons';

interface FavoritesScreenProps {
  ads: Ad[];
  toggleFavorite: (adId: string) => void;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ ads, toggleFavorite }) => {
  if (ads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary p-8">
        <FavoritesIcon className="w-16 h-16 mb-4" />
        <h2 className="text-xl font-bold text-text-primary">No Favorites</h2>
        <p className="mt-2 max-w-xs">Click the star icon on an ad in your history to save it here.</p>
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

export default FavoritesScreen;
