import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { CardContent, CardTitle, CardDescription } from '@/components/ui/card';

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/blueredgoldab/',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.044.976.207 1.504.344 1.857.182.466.398.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.986-.01 4.04-.058.976-.044 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.054.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.044-.976-.207-1.504-.344-1.857-.182-.466-.398-.8-.748-1.15-.35-.35-.684-.566-1.15-.748-.353-.137-.881-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.469a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/people/Blueredgold/100087048124977/',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/blueredgold-ab/',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white">
      <Separator className="mb-4 bg-black/20" />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col space-y-8">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="h-16 w-32">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={128}
                height={64}
                priority
                sizes="128px"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="mt-6 -ml-8 text-3xl font-extrabold tracking-tight text-black">
              Egen Lista
            </h1>
          </div>

          {/* Main Content */}
          <section className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-12">
            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-12 lg:col-span-12">
              <CardContent className="space-y-3 md:space-y-4">
                <CardTitle className="text-base font-semibold text-black">
                  Saffron
                </CardTitle>
                <div className="grid gap-2 md:gap-3">
                  <Link href="/">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Growing Saffron
                    </CardDescription>
                  </Link>
                  <Link href="/premium-saffron/food-beverages">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Food & Beverages
                    </CardDescription>
                  </Link>
                  <Link href="/premium-saffron/medical-cosmetics">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Medical & Cosmetics
                    </CardDescription>
                  </Link>
                </div>
              </CardContent>

              <CardContent className="space-y-3 md:space-y-4">
                <CardTitle className="text-base font-semibold text-black">
                  Technology
                </CardTitle>
                <div className="grid gap-2 md:gap-3">
                  <Link href="/technology/growing">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Growing
                    </CardDescription>
                  </Link>
                  <Link href="/technology/harvesting">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Harvesting
                    </CardDescription>
                  </Link>
                  <Link href="/technology/data/batches">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Batches
                    </CardDescription>
                  </Link>
                </div>
              </CardContent>

              <CardContent className="space-y-3 md:space-y-4">
                <CardTitle className="text-base font-semibold text-black">
                  Blog
                </CardTitle>
                <div className="grid gap-2 md:gap-3">
                  <Link href="/blogs/updates">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Updates
                    </CardDescription>
                  </Link>
                  <Link href="/blogs/news">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      In the News
                    </CardDescription>
                  </Link>
                  <Link href="/blogs/saffron-recipes">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Recipes
                    </CardDescription>
                  </Link>
                  <Link href="/blogs/science">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Science
                    </CardDescription>
                  </Link>
                </div>
              </CardContent>

              <CardContent className="space-y-3 md:space-y-4">
                <CardTitle className="text-base font-semibold text-black">
                  About us
                </CardTitle>
                <div className="grid gap-2 md:gap-3">
                  <Link href="/about-us/about">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      About
                    </CardDescription>
                  </Link>
                  <Link href="/about-us/career">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Career
                    </CardDescription>
                  </Link>
                  <Link href="/about-us/contact-us">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Contact
                    </CardDescription>
                  </Link>
                  <Link href="/about-us/investor-relations">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Investor Relations
                    </CardDescription>
                  </Link>
                  <Link href="/about-us/press">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Press
                    </CardDescription>
                  </Link>
                  <Link href="/about-us/sustainability/esg">
                    <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                      Sustainability (ESG)
                    </CardDescription>
                  </Link>
                </div>
              </CardContent>
            </nav>
          </section>

          {/* Footer Bottom */}
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <CardDescription className="text-center text-sm text-black md:text-left">
              © {currentYear} | Egen Lista.
            </CardDescription>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary text-black transition-colors"
                  aria-label={social.name}
                >
                  <div className="h-5 w-5">{social.icon}</div>
                </a>
              ))}
            </div>

            <div className="flex gap-4 text-sm">
              <Link href="/privacy-policy">
                <CardDescription className="hover:text-primary text-sm text-black transition-colors">
                  Privacy Policy
                </CardDescription>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
