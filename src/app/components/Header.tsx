'use client';

import Link from "next/link";
import CartNav from "../CartNav";

export default function Header() {
  return (
    <header className="border-b border-white/10">
      <div className="container flex items-center justify-between py-4" suppressHydrationWarning>
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative h-9 w-9" suppressHydrationWarning>
            {/* Leaf */}
            <div className="absolute top-1 left-1 h-6 w-4 bg-green-400 rounded-sm transform rotate-12 shadow-lg shadow-green-400/50" suppressHydrationWarning>
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-green-300" suppressHydrationWarning></div>
              <div className="absolute top-1 left-0.5 w-1 h-0.5 bg-green-300 transform rotate-45" suppressHydrationWarning></div>
              <div className="absolute top-2 left-0.5 w-1 h-0.5 bg-green-300 transform rotate-45" suppressHydrationWarning></div>
              <div className="absolute top-3 left-0.5 w-1 h-0.5 bg-green-300 transform rotate-45" suppressHydrationWarning></div>
            </div>
            {/* Book */}
            <div className="absolute top-2 right-1 h-5 w-3 bg-blue-600 rounded-sm shadow-lg shadow-blue-600/50" suppressHydrationWarning>
              <div className="absolute top-0.5 left-0.5 w-2 h-0.5 bg-blue-400" suppressHydrationWarning></div>
              <div className="absolute top-1 left-0.5 w-2 h-0.5 bg-blue-400" suppressHydrationWarning></div>
              <div className="absolute top-1.5 left-0.5 w-2 h-0.5 bg-blue-400" suppressHydrationWarning></div>
            </div>
          </div>
          <span className="text-lg font-semibold tracking-tight">LeafSide</span>
        </Link>
        <CartNav />
      </div>
    </header>
  );
}

