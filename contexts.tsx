import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { Theme } from './types';

// --- Theme Context ---
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    const initialTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const determinedTheme = initialTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(determinedTheme);
    root.classList.remove('light', 'dark');
    root.classList.add(determinedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// --- Toast Context ---
interface ToastMessage {
  id: number;
  message: string;
}

interface ToastContextType {
  showToast: (message: string) => void;
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};


// --- App Loading Context ---
interface AppLoadingContextType {
  isAppLoading: boolean;
  setIsAppLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppLoadingContext = createContext<AppLoadingContextType | undefined>(undefined);

const AppLoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAppLoading, setIsAppLoading] = useState(false);
    return (
        <AppLoadingContext.Provider value={{ isAppLoading, setIsAppLoading }}>
            {children}
        </AppLoadingContext.Provider>
    );
};

export const useAppLoading = () => {
    const context = useContext(AppLoadingContext);
    if (!context) {
        throw new Error('useAppLoading must be used within an AppLoadingProvider');
    }
    return context;
};

// --- Combined Providers ---
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppLoadingProvider>
      <ThemeProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </AppLoadingProvider>
  );
};