'use client';

import { usePathname } from 'next/navigation';
import Header from './header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't render the main header for admin routes
  // The admin layout will handle its own header
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  // Render the main header for all other routes
  return <Header />;
}
