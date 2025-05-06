import Link from 'next/link';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { CardContent, CardTitle, CardDescription } from '@/components/ui/card';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background">
      <Separator className="mb-4 bg-border" />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col space-y-8">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="h-16 w-32">
              <Image
                src="/logo.png"
                alt="Logo"
                width={128}
                height={64}
                priority
                sizes="128px"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="-ml-8 text-3xl font-bold tracking-tight text-primary">
              Egen Lista
            </h1>
          </div>

          {/* Main Content */}
          <section className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-12">
            <nav className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4 md:gap-12 lg:col-span-12">
              <CardContent className="space-y-3 md:space-y-4">
                <CardTitle className="text-base font-semibold text-foreground">
                  Saffron
                </CardTitle>
                <div className="grid gap-2 md:gap-3">
                  <Link href="/">
                    <CardDescription className="hover:text-primary text-sm text-foreground transition-colors">
                      Growing Saffron
                    </CardDescription>
                  </Link>
                  <Link href="/premium-saffron/food-beverages">
                    <CardDescription className="hover:text-primary text-sm text-foreground transition-colors">
                      Food & Beverages
                    </CardDescription>
                  </Link>
                  <Link href="/premium-saffron/medical-cosmetics">
                    <CardDescription className="hover:text-primary text-sm text-foreground transition-colors">
                      Medical & Cosmetics
                    </CardDescription>
                  </Link>
                </div>
              </CardContent>

              <CardContent className="space-y-3 md:space-y-4">
                <CardTitle className="text-base font-semibold text-foreground">
                  Technology
                </CardTitle>
                <div className="grid gap-2 md:gap-3">
                  <Link href="/technology/growing">
                    <CardDescription className="hover:text-primary text-sm text-foreground transition-colors">
                      Growing
                    </CardDescription>
                  </Link>
                  <Link href="/technology/harvesting">
                    <CardDescription className="hover:text-primary text-sm text-foreground transition-colors">
                      Harvesting
                    </CardDescription>
                  </Link>
                  <Link href="/technology/data/batches">
                    <CardDescription className="hover:text-primary text-sm text-foreground transition-colors">
                      Batches
                    </CardDescription>
                  </Link>
                </div>
              </CardContent>

              <CardContent className="space-y-3 md:space-y-4">
                <CardTitle className="text-base font-semibold text-foreground">
                  Blog
                </CardTitle>
                <div className="grid gap-2 md:gap-3">
                  <Link href="/blogs/updates">
                    <CardDescription className="hover:text-primary text-sm text-foreground transition-colors">
                      Updates
                    </CardDescription>
                  </Link>
                  <Link href="/blogs/news">
                    <CardDescription className="hover:text-primary text-sm text-foreground transition-colors">
                      In the News
                    </CardDescription>
                  </Link>
                  <Link href="/blogs/saffron-recipes">
                    <CardDescription className="hover:text-primary text-sm text-foreground transition-colors">
                      Recipes
                    </CardDescription>
                  </Link>
                </div>
              </CardContent>

              <CardContent className="space-y-3 md:space-y-4">
                <CardTitle className="text-base font-semibold text-foreground">
                  About us
                </CardTitle>
                <div className="grid gap-2 md:gap-3">
                  <Link href="/about-us/about">
                    <CardDescription className="hover:text-primary text-sm text-foreground transition-colors">
                      About
                    </CardDescription>
                  </Link>
                  <Link href="/about-us/career">
                    <CardDescription className="hover:text-primary text-sm text-foreground transition-colors">
                      Career
                    </CardDescription>
                  </Link>
                  <Link href="/about-us/contact-us">
                    <CardDescription className="hover:text-primary text-sm text-foreground transition-colors">
                      Contact
                    </CardDescription>
                  </Link>
                </div>
              </CardContent>
            </nav>
          </section>

          {/* Footer Bottom */}
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <CardDescription className="text-center text-sm text-foreground md:text-left">
              © {currentYear} | Egen Lista.
            </CardDescription>

            <div className="flex gap-4 text-sm">
              <Link href="/privacy-policy">
                <CardDescription className="hover:text-primary text-sm text-foreground transition-colors">
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
