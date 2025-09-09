
import React, { useState } from 'react';
import { Ad } from '../types';
import { CopyIcon, StarIcon, StarFilledIcon } from './icons';

interface AdCardProps {
  ad: Ad;
  toggleFavorite: (adId: string) => void;
}

const AdCard: React.FC<AdCardProps> = ({ ad, toggleFavorite }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  
  const fullAdText = `
Headline: ${ad.headline}
Body: ${ad.body}
CTA: ${ad.callToAction}
Hashtags: ${ad.hashtags.map(h => `#${h}`).join(' ')}
  `.trim();

  return (
    <div className="rounded-2xl bg-surface p-4 shadow-lg transition-all duration-300">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{ad.platform} Ad</span>
          <h3 className="text-xl font-bold text-text-primary">{ad.headline}</h3>
        </div>
        <div className="flex items-center space-x-2">
            <button 
                onClick={() => handleCopy(fullAdText, 'all')}
                className="p-2 text-text-secondary transition-colors hover:text-primary"
                title="Copy all"
            >
                {copiedField === 'all' ? <span className="text-xs text-primary">Copied!</span> : <CopyIcon className="h-5 w-5" />}
            </button>
            <button onClick={() => toggleFavorite(ad.id)} className="p-2 text-yellow-400" title="Favorite">
              {ad.isFavorite ? <StarFilledIcon className="h-6 w-6" /> : <StarIcon className="h-6 w-6" />}
            </button>
        </div>
      </div>

      <p className="mb-4 text-text-primary">{ad.body}</p>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {ad.hashtags.map((tag, index) => (
          <span key={index} className="rounded-full bg-secondary px-3 py-1 text-sm text-text-secondary">
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
