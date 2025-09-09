import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useToast } from '../contexts';
import { CheckIcon } from './icons';

const Toast: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onDismiss, 300); // Animation duration
    }, 3000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const animationClass = isExiting ? 'animate-toast-out' : 'animate-toast-in';

  return (
    <div className={`flex items-center gap-3 rounded-full bg-surface px-5 py-3 text-sm font-semibold text-text-primary shadow-2xl dark:bg-dark-secondary dark:text-dark-text-primary ${animationClass}`}>
      <CheckIcon className="h-5 w-5 text-green-500" />
      <span>{message}</span>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

   if (typeof document === 'undefined') return null;

  return ReactDOM.createPortal(
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>,
    document.body
  );
}
export default ToastContainer;
