import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/Navbar';
import Footer from '../components/Footer';
import { Providers } from '../app/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
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
    <html lang="sv" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <Providers>
          <header>
            <Navbar />
          </header>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
