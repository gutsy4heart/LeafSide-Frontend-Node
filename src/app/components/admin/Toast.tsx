"use client";

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: Toast[];
}

export default function Toast({ toasts }: ToastProps) {
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div 
          key={t.id} 
          className={`px-4 py-3 rounded shadow text-white ${
            t.type === 'success' ? 'bg-green-600' : 
            t.type === 'error' ? 'bg-red-600' : 
            'bg-[var(--accent)]'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
