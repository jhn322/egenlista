import Hero from '../components/landing-page/Hero';
import Features from '../components/landing-page/Features';
import HowItWorks from '../components/landing-page/How-it-works';
import Benefits from '../components/landing-page/Benefits';
import Tools from '../components/landing-page/Tools';
import UseCases from '../components/landing-page/Use-cases';
import Cta from '../components/landing-page/Cta';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  // * Metadata ärvs från layout.tsx
  // Lägg till specifik metadata här om det behövs
};

export default function Home() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col">
      <header>
        <Hero />
      </header>
      <Features />
      <HowItWorks />
      <Benefits />
      <Tools />
      <UseCases />
      <Cta />
    </main>
  );
}
