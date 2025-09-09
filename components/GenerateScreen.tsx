
import React, { useState } from 'react';
import { generateAdCopy, generateAdImage } from '../services/geminiService';
import { Ad, AdContent } from '../types';
import { PLATFORMS } from '../constants';
import { LoadingIcon, SparklesIcon, DownloadIcon, CopyIcon } from './icons';
import { useAppLoading, useToast } from '../contexts';

interface GenerateScreenProps {
  onAdGenerated: (ad: Omit<Ad, 'id' | 'isFavorite'>) => void;
}

interface GeneratedResult {
    adContent: AdContent;
    imageUrl: string;
}

const GenerateScreen: React.FC<GenerateScreenProps> = ({ onAdGenerated }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<GeneratedResult | null>(null);

  const { setIsAppLoading } = useAppLoading();
  const { showToast } = useToast();

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `adiva-ai-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Image downloaded!');
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${fieldName} copied to clipboard!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !description || !audience) {
      setError('Please fill out all fields.');
      return;
    }
    setIsLoading(true);
    setIsAppLoading(true);
    setError(null);
    setGeneratedResult(null);
    const startTime = Date.now();
    try {
      const [adContent, imageUrl] = await Promise.all([
        generateAdCopy(selectedPlatform, productName, description, audience),
        generateAdImage(productName, description, audience)
      ]);
      
      const newAd = { ...adContent, platform: selectedPlatform, imageUrl };
      onAdGenerated(newAd);
      setGeneratedResult({ adContent, imageUrl });

      // Do not reset form, user might want to tweak it
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`An error occurred during generation: ${message}`);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 1000; // 1 second
      const remainingTime = minLoadingTime - elapsedTime;

      setTimeout(() => {
        setIsLoading(false);
        setIsAppLoading(false);
      }, remainingTime > 0 ? remainingTime : 0);
    }
  };
  
  return (
    <div className="flex flex-col px-4 pt-4">
        <div className="mb-6">
            <h2 className="mb-2 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">SELECT PLATFORM</h2>
            <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
                {PLATFORMS.map(platform => (
                    <button
                        key={platform}
                        onClick={() => setSelectedPlatform(platform)}
                        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                            selectedPlatform === platform
                                ? 'bg-primary text-white'
                                : 'bg-secondary text-text-primary hover:bg-border-color dark:bg-dark-secondary dark:text-dark-text-primary dark:hover:bg-dark-border-color'
                        }`}
                    >
                        {platform}
                    </button>
                ))}
            </div>
        </div>
      
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label htmlFor="productName" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Product Name</label>
                <input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Eco-Friendly Water Bottle"
                    className="w-full rounded-lg border-2 border-border-color bg-surface p-3 text-text-primary focus:border-primary focus:outline-none dark:border-dark-border-color dark:bg-dark-surface dark:text-dark-text-primary"
                />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Product Description</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your product and its key features."
                    rows={4}
                    className="w-full rounded-lg border-2 border-border-color bg-surface p-3 text-text-primary focus:border-primary focus:outline-none dark:border-dark-border-color dark:bg-dark-surface dark:text-dark-text-primary"
                />
            </div>
            <div>
                <label htmlFor="audience" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-1">Target Audience</label>
                <input
                    id="audience"
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g., Young professionals, fitness enthusiasts"
                    className="w-full rounded-lg border-2 border-border-color bg-surface p-3 text-text-primary focus:border-primary focus:outline-none dark:border-dark-border-color dark:bg-dark-surface dark:text-dark-text-primary"
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

        {generatedResult && (
            <div className="mt-8 animate-fade-in">
                <h2 className="text-xl font-bold text-center mb-4 text-text-primary dark:text-dark-text-primary">Your Generated Ad!</h2>
                <div className="rounded-2xl bg-surface dark:bg-dark-surface p-4 shadow-lg">
                    <div className="relative group">
                        <img src={generatedResult.imageUrl} alt="Generated ad visual" className="mb-4 w-full aspect-square rounded-lg object-cover" />
                         <button 
                            onClick={() => handleDownload(generatedResult.imageUrl)}
                            className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100"
                            aria-label="Download Image"
                        >
                            <DownloadIcon className="h-4 w-4" />
                            <span>Download</span>
                        </button>
                    </div>
                    <div className="mb-3 flex items-start justify-between">
                        <div 
                            className="flex-1 cursor-pointer group"
                            onClick={() => handleCopy(generatedResult.adContent.headline, 'Headline')}
                        >
                            <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-dark-text-secondary">{selectedPlatform} Ad</span>
                            <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary group-hover:text-primary dark:group-hover:text-primary transition-colors">{generatedResult.adContent.headline}</h3>
                        </div>
                         <button 
                            className="p-2 text-text-secondary transition-colors hover:text-primary dark:text-dark-text-secondary dark:hover:text-primary"
                            onClick={() => handleCopy(generatedResult.adContent.headline, 'Headline')}
                            title="Copy Headline"
                        >
                            <CopyIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <p 
                        className="mb-4 text-text-primary dark:text-dark-text-primary cursor-pointer hover:text-primary dark:hover:text-primary transition-colors"
                        onClick={() => handleCopy(generatedResult.adContent.body, 'Body')}
                    >
                      {generatedResult.adContent.body}
                    </p>
                    
                    <div className="mb-4 flex flex-wrap gap-2">
                        {generatedResult.adContent.hashtags.map((tag, index) => (
                        <span key={index} className="rounded-full bg-secondary px-3 py-1 text-sm text-text-secondary dark:bg-dark-secondary dark:text-dark-text-secondary">
                            #{tag}
                        </span>
                        ))}
                    </div>

                    <button className="w-full rounded-lg bg-primary py-2.5 font-bold text-white transition-colors hover:bg-primary-hover">
                        {generatedResult.adContent.callToAction}
                    </button>
                </div>
                <p className="mt-4 text-center text-sm text-text-secondary dark:text-dark-text-secondary">
                    This ad has been saved to your History.
                </p>
            </div>
        )}
    </div>
  );
};

export default GenerateScreen;