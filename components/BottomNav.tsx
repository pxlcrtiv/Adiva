
import React from 'react';
import { Tab } from '../types';

interface BottomNavProps {
  tabs: Tab[];
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-20 w-full border-t border-secondary bg-surface/80 backdrop-blur-sm md:hidden">
      <div className={`grid h-20 grid-cols-${tabs.length}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab)}
            className={`flex flex-col items-center justify-center gap-1 text-xs transition-colors duration-200 ${
              activeTab.id === tab.id ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <tab.icon className="h-6 w-6" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
