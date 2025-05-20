import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '../app/providers';
import { Toaster } from 'sonner';
import { APP_NAME } from '@/lib/constants/site';
import PageWrapper from '@/components/PageWrapper';
import { SuperAdminToolbar } from '@/components/super-admin/SuperAdminToolbar';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${APP_NAME} | Ett enkelt verktyg för svenska företagare`,
  description: `${APP_NAME} hjälper svenska företagare att enkelt bygga och hantera sina egna kundlistor för bättre kundrelationer och ökad försäljning.`,
  keywords: [
    'kundlista',
    'svenska företagare',
    'CRM',
    'kundhantering',
    'företagsverktyg',
  ],
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: `${APP_NAME} | Ett enkelt verktyg för svenska företagare`,
    description: `${APP_NAME} hjälper svenska företagare att enkelt bygga och hantera sina egna kundlistor för bättre kundrelationer och ökad försäljning.`,
    type: 'website',
    locale: 'sv_SE',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={inter.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <PageWrapper>{children}</PageWrapper>
          <Toaster richColors position="bottom-right" />
          <SuperAdminToolbar />
        </Providers>
      </body>
    </html>
  );
}
