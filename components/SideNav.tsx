import React from 'react';
import { Tab } from '../types';

interface SideNavProps {
  tabs: Tab[];
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const SideNav: React.FC<SideNavProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="hidden w-64 flex-col border-r border-secondary bg-surface p-4 md:flex">
      <div className="mb-4 px-2 py-2">
        <h1 className="text-xl font-bold text-text-primary">ADIVA AI ✨</h1>
      </div>
      <div className="flex flex-col space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors duration-200 ${
              activeTab.id === tab.id
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
            }`}
            aria-current={activeTab.id === tab.id}
          >
            <tab.icon className="h-6 w-6" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default SideNav;