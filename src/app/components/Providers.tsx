'use client';

import { CartProvider } from "../cart-context";
import { AuthProvider } from "../auth-context";
import { LanguageProvider } from "../language-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

