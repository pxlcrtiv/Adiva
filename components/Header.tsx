
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 mx-auto max-w-md border-b border-secondary bg-surface/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-center px-4">
        <h1 className="text-lg font-bold text-text-primary">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
