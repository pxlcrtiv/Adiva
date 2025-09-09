
import React from 'react';
import { Ad } from '../types';
import { CopyIcon, StarIcon, StarFilledIcon, DownloadIcon } from './icons';
import { useToast } from '../contexts';

interface AdCardProps {
  ad: Ad;
  toggleFavorite: (adId: string) => void;
}

const AdCard: React.FC<AdCardProps> = ({ ad, toggleFavorite }) => {
  const { showToast } = useToast();

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${fieldName} copied to clipboard!`);
  };
  
  const handleDownload = (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation(); // Prevent card interactions
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `adiva-ai-${ad.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Image downloaded!');
  };

  const fullAdText = `
Headline: ${ad.headline}
Body: ${ad.body}
CTA: ${ad.callToAction}
Hashtags: ${ad.hashtags.map(h => `#${h}`).join(' ')}
  `.trim();

  return (
    <div className="rounded-2xl bg-surface p-4 shadow-lg transition-all duration-300 dark:bg-dark-surface">
      {ad.imageUrl && (
        <div className="relative group mb-4">
          <img src={ad.imageUrl} alt={`Ad for ${ad.headline}`} className="w-full aspect-square rounded-lg object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
            <button 
                onClick={(e) => handleDownload(e, ad.imageUrl!)}
                className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-transform hover:scale-105"
                aria-label="Download Image"
            >
                <DownloadIcon className="h-5 w-5" />
                <span>Download</span>
            </button>
          </div>
        </div>
      )}
      <div className="mb-3 flex items-start justify-between">
        <div 
            className="flex-1 cursor-pointer group"
            onClick={() => handleCopy(ad.headline, 'Headline')}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary dark:text-dark-text-secondary">{ad.platform} Ad</span>
          <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary transition-colors group-hover:text-primary">{ad.headline}</h3>
        </div>
        <div className="flex items-center space-x-2">
            <button 
                onClick={() => handleCopy(fullAdText, 'Full ad')}
                className="p-2 text-text-secondary transition-colors hover:text-primary dark:text-dark-text-secondary dark:hover:text-primary"
                title="Copy all"
            >
                <CopyIcon className="h-5 w-5" />
            </button>
            <button onClick={() => toggleFavorite(ad.id)} className="p-2 text-yellow-400" title="Favorite">
              {ad.isFavorite ? <StarFilledIcon className="h-6 w-6" /> : <StarIcon className="h-6 w-6" />}
            </button>
        </div>
      </div>

      <p 
        className="mb-4 text-text-primary dark:text-dark-text-primary cursor-pointer transition-colors hover:text-primary"
        onClick={() => handleCopy(ad.body, 'Body')}
      >
        {ad.body}
      </p>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {ad.hashtags.map((tag, index) => (
          <span key={index} className="rounded-full bg-secondary px-3 py-1 text-sm text-text-secondary dark:bg-dark-secondary dark:text-dark-text-secondary">
            #{tag}
          </span>
        ))}
      </div>

      <button className="w-full rounded-lg bg-primary py-2.5 font-bold text-white transition-colors hover:bg-primary-hover">
        {ad.callToAction}
      </button>
    </div>
  );
};

export default AdCard;