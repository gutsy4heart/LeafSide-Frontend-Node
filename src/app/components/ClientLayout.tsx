'use client';

import Providers from "./Providers";
import Header from "./Header";
import Footer from "./Footer";
import ExtensionCleaner from "./ClientWrapper";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ExtensionCleaner />
      <div className="relative overflow-x-hidden" suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
      </div>
    </Providers>
  );
}

