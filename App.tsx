
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import GenerateScreen from './components/GenerateScreen';
import HistoryScreen from './components/HistoryScreen';
import FavoritesScreen from './components/FavoritesScreen';
import ImageEditorScreen from './components/ImageEditorScreen';
import { Ad, Tab } from './types';
import { TABS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedAds = localStorage.getItem('generatedAds');
      if (storedAds) {
        setAds(JSON.parse(storedAds));
      }
      const storedFavorites = localStorage.getItem('favoriteAds');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    // Fix: Corrected a syntax error in the try...catch block.
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  const saveAds = (updatedAds: Ad[]) => {
    setAds(updatedAds);
    localStorage.setItem('generatedAds', JSON.stringify(updatedAds));
  };

  const saveFavorites = (updatedFavorites: string[]) => {
    setFavorites(updatedFavorites);
    localStorage.setItem('favoriteAds', JSON.stringify(updatedFavorites));
  };

  const handleAddAd = (newAd: Omit<Ad, 'id' | 'isFavorite'>) => {
    const adWithId: Ad = { ...newAd, id: Date.now().toString(), isFavorite: false };
    const updatedAds = [adWithId, ...ads];
    saveAds(updatedAds);
    setActiveTab(TABS[1]); // Switch to history tab after generation
  };

  const toggleFavorite = useCallback((adId: string) => {
    let updatedFavorites: string[];
    if (favorites.includes(adId)) {
      updatedFavorites = favorites.filter(id => id !== adId);
    } else {
      updatedFavorites = [...favorites, adId];
    }
    saveFavorites(updatedFavorites);

    const updatedAds = ads.map(ad => 
      ad.id === adId ? { ...ad, isFavorite: !ad.isFavorite } : ad
    );
    saveAds(updatedAds);
  }, [ads, favorites]);

  const renderScreen = () => {
    switch (activeTab.id) {
      case 'generate':
        return <GenerateScreen onAdGenerated={handleAddAd} />;
      case 'history':
        return <HistoryScreen ads={ads} toggleFavorite={toggleFavorite} />;
      case 'favorites':
        const favoriteAds = ads.filter(ad => favorites.includes(ad.id));
        return <FavoritesScreen ads={favoriteAds} toggleFavorite={toggleFavorite} />;
      case 'image-editor':
        return <ImageEditorScreen />;
      default:
        return <GenerateScreen onAdGenerated={handleAddAd} />;
    }
  };

  return (
    <div className="bg-brand-bg text-text-primary font-sans antialiased">
      <div className="relative mx-auto flex h-screen max-w-md flex-col overflow-hidden border-x border-secondary shadow-2xl">
        <Header title={activeTab.label} />
        <main className="flex-1 overflow-y-auto pb-20 pt-16">
          {renderScreen()}
        </main>
        <BottomNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default App;
