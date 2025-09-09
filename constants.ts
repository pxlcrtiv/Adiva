
import { Tab } from './types';
import { GenerateIcon, HistoryIcon, FavoritesIcon, ImageIcon } from './components/icons';

export const TABS: Tab[] = [
  { id: 'generate', label: 'Generate Ad', icon: GenerateIcon },
  { id: 'image-editor', label: 'Image Editor', icon: ImageIcon },
  { id: 'history', label: 'History', icon: HistoryIcon },
  { id: 'favorites', label: 'Favorites', icon: FavoritesIcon },
];

export const PLATFORMS = ['Instagram', 'Facebook', 'TikTok', 'Google', 'LinkedIn'];
