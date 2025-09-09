
import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 w-full border-b border-border-color bg-surface/80 backdrop-blur-sm dark:border-dark-border-color dark:bg-dark-surface/80">
      <div className="flex h-16 items-center justify-between px-4">
        <h1 className="text-lg font-bold text-text-primary dark:text-dark-text-primary md:hidden">{title}</h1>
        <div className="hidden text-lg font-bold text-text-primary dark:text-dark-text-primary md:block">{title}</div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;