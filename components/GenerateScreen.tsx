
import React, { useState } from 'react';
import { generateAdCopy } from '../services/geminiService';
import { Ad } from '../types';
import { PLATFORMS } from '../constants';
import { LoadingIcon, SparklesIcon } from './icons';

interface GenerateScreenProps {
  onAdGenerated: (ad: Omit<Ad, 'id' | 'isFavorite'>) => void;
}

const GenerateScreen: React.FC<GenerateScreenProps> = ({ onAdGenerated }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !description || !audience) {
      setError('Please fill out all fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const adContent = await generateAdCopy(selectedPlatform, productName, description, audience);
      onAdGenerated({ ...adContent, platform: selectedPlatform });
      // Reset form on success
      setProductName('');
      setDescription('');
      setAudience('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col px-4 pt-4">
        {/* Secondary Navigation for platforms */}
        <div className="mb-6">
            <h2 className="mb-2 text-sm font-semibold text-text-secondary">SELECT PLATFORM</h2>
            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
                {PLATFORMS.map(platform => (
                    <button
                        key={platform}
                        onClick={() => setSelectedPlatform(platform)}
                        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            selectedPlatform === platform
                                ? 'bg-primary text-white'
                                : 'bg-secondary text-text-primary hover:bg-gray-700'
                        }`}
                    >
                        {platform}
                    </button>
                ))}
            </div>
        </div>
      
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label htmlFor="productName" className="block text-sm font-medium text-text-secondary mb-1">Product Name</label>
                <input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Eco-Friendly Water Bottle"
                    className="w-full rounded-lg border-2 border-secondary bg-surface p-3 text-text-primary focus:border-primary focus:outline-none"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Product Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your product and its key features."
                    rows={4}
                    className="w-full rounded-lg border-2 border-secondary bg-surface p-3 text-text-primary focus:border-primary focus:outline-none"
                />
            </div>
            <div>
                <label htmlFor="audience" className="block text-sm font-medium text-text-secondary mb-1">Target Audience</label>
                <input
                    id="audience"
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g., Young professionals, fitness enthusiasts"
                    className="w-full rounded-lg border-2 border-secondary bg-surface p-3 text-text-primary focus:border-primary focus:outline-none"
                />
            </div>
            
            {error && <p className="text-sm text-red-500">{error}</p>}
            
            <button
                type="submit"
                disabled={isLoading}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-bold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-opacity-50"
            >
                {isLoading ? (
                    <>
                        <LoadingIcon className="h-5 w-5 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <SparklesIcon className="h-5 w-5" />
                        Generate Ad
                    </>
                )}
            </button>
        </form>
    </div>
  );
};

export default GenerateScreen;
