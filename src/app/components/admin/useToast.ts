import { useState } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    // auto dismiss
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  return { toasts, showToast };
}
