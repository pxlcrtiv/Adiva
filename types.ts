
export interface Ad {
  id: string;
  platform: string;
  headline: string;
  body: string;
  callToAction: string;
  hashtags: string[];
  isFavorite: boolean;
}

export interface AdContent {
  headline: string;
  body: string;
  callToAction: string;
  hashtags: string[];
}

export interface Tab {
  id: 'generate' | 'history' | 'favorites' | 'image-editor';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}
