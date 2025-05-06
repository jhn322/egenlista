import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/Navbar';
import Footer from '../components/Footer';
import { Providers } from '../app/providers';
import { Toaster } from 'sonner';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Egen Lista | Ett enkelt verktyg för svenska företagare',
  description:
    'Egen Lista hjälper svenska företagare att enkelt bygga och hantera sina egna kundlistor för bättre kundrelationer och ökad försäljning.',
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
    title: 'Egen Lista | Ett enkelt verktyg för svenska företagare',
    description:
      'Egen Lista hjälper svenska företagare att enkelt bygga och hantera sina egna kundlistor för bättre kundrelationer och ökad försäljning.',
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
      <body className="antialiased">
        <Providers>
          <header>
            <Navbar />
          </header>
          {children}
          <Footer />
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
