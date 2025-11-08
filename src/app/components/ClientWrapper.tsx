'use client';

import { useLayoutEffect } from 'react';

// Компонент для очистки атрибутов браузерных расширений
// Не оборачивает children, чтобы не нарушать структуру layout router
export default function ExtensionCleaner() {
  useLayoutEffect(() => {
    // Function to remove browser extension attributes
    const removeExtensionAttributes = () => {
      const elements = document.querySelectorAll('[bis_skin_checked], [bis_register]');
      elements.forEach(element => {
        element.removeAttribute('bis_skin_checked');
        element.removeAttribute('bis_register');
      });
    };

    // Run immediately
    removeExtensionAttributes();

    // Set up a MutationObserver with more aggressive settings
    const observer = new MutationObserver((mutations) => {
      let shouldClean = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const target = mutation.target as Element;
          if (target.hasAttribute('bis_skin_checked') || target.hasAttribute('bis_register')) {
            target.removeAttribute('bis_skin_checked');
            target.removeAttribute('bis_register');
            shouldClean = true;
          }
        } else if (mutation.type === 'childList') {
          // Check new nodes for extension attributes
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.hasAttribute('bis_skin_checked') || element.hasAttribute('bis_register')) {
                element.removeAttribute('bis_skin_checked');
                element.removeAttribute('bis_register');
                shouldClean = true;
              }
              // Check children recursively
              const children = element.querySelectorAll('[bis_skin_checked], [bis_register]');
              children.forEach(child => {
                child.removeAttribute('bis_skin_checked');
                child.removeAttribute('bis_register');
                shouldClean = true;
              });
            }
          });
        }
      });

      // If we found and removed attributes, run a full cleanup
      if (shouldClean) {
        setTimeout(removeExtensionAttributes, 0);
      }
    });

    // Start observing with comprehensive settings
    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['bis_skin_checked', 'bis_register']
    });

    // Also set up a periodic cleanup as a fallback
    const interval = setInterval(removeExtensionAttributes, 100);

    // Cleanup
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return null; // Не рендерим ничего, только запускаем эффект
}
