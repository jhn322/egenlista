'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AUTH_PATHS } from '@/lib/constants/routes';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const pathname = usePathname();

  // Check if current path is an auth page
  const isAuthPage = Object.values(AUTH_PATHS).some((path) =>
    pathname.startsWith(path)
  );

  if (isAuthPage) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pb-20">{children}</main>
      <Footer />
    </>
  );
};

export default PageWrapper;
