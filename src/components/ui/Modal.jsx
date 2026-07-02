import { useEffect } from 'react';
import { X } from './icons';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-fadeUp"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative w-full ${maxWidth} max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-lift animate-fadeUp`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-pine-100 bg-white/95 backdrop-blur px-5 sm:px-6 py-4">
          <h2 id="modal-title" className="font-serif text-lg font-semibold text-ink">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1.5 text-ink/50 hover:bg-mint hover:text-ink transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-5 sm:px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
