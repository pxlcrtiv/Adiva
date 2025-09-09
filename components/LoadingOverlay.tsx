
import React from 'react';
import { LoadingIcon } from './icons';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-bg/80 backdrop-blur-sm dark:bg-dark-brand-bg/80">
      <div className="w-full max-w-md animate-pulse p-4 md:max-w-xl">
        <div className="flex space-x-4">
          <div className="h-12 w-12 rounded-full bg-secondary dark:bg-dark-secondary"></div>
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 rounded bg-secondary dark:bg-dark-secondary"></div>
            <div className="h-4 w-5/6 rounded bg-secondary dark:bg-dark-secondary"></div>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="h-24 rounded-lg bg-secondary dark:bg-dark-secondary"></div>
          <div className="h-8 rounded-lg bg-secondary dark:bg-dark-secondary"></div>
          <div className="h-8 w-1/2 rounded-lg bg-secondary dark:bg-dark-secondary"></div>
        </div>
      </div>
      <div className="mt-8 flex items-center gap-3 rounded-full bg-surface px-6 py-3 text-lg font-semibold text-text-primary shadow-lg dark:bg-dark-surface dark:text-dark-text-primary">
        <LoadingIcon className="h-6 w-6 animate-spin text-primary" />
        <span>ADIVA AI is thinking...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
