'use client';

// import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { OnlineStatusIndicator } from '@/components/ui/online-status-indicator';

interface NavItem {
  href: string;
  label: string;
}

// Grundläggande navigationslänkar som alla besökare kan se
const publicNavItems: NavItem[] = [
  { href: '/page1', label: 'Page 1' },
  { href: '/page2', label: 'Page 2' },
  { href: '/page3', label: 'Page 3' },
  { href: '/page4', label: 'Page 4' },
  { href: '/page5', label: 'Page 5' },
];

// Rollspecifika navigationslänkar
const roleBasedNavItems: Record<string, NavItem[]> = {
  // ADMIN: [{ href: "/dashboard", label: "Dashboard" }],
  USER: [{ href: '/admin', label: 'Admin Panel' }],
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  // Hämta aktuell session från NextAuth
  const { data: session, status } = useSession();

  // Kontrollera om användaren är inloggad
  const isAuthenticated = status === 'authenticated';
  // Hämta användarens roll om inloggad
  const userRole = session?.user?.role;

  // Bygg upp dynamisk navlista baserat på användarstatus och roll
  const navItems = [...publicNavItems];

  // Lägg till rollspecifika alternativ om användaren har en roll
  if (isAuthenticated && userRole && roleBasedNavItems[userRole]) {
    navItems.splice(1, 0, ...roleBasedNavItems[userRole]);
  }

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when screen becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to determine if a nav item is active
  const isActiveLink = (href: string): boolean => {
    return pathname === href || (href !== '/' && pathname?.startsWith(href));
  };

  return (
    <>
      <div className="h-16" />
      <div className="relative">
        <nav className="bg-background/80 fixed top-0 right-0 left-0 z-50 w-full border-b backdrop-blur-sm transition-colors duration-500">
          <div className="flex h-16 items-center justify-between px-6 md:px-8">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-semibold text-foreground">
                Egen Lista
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden items-center gap-6 md:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-md px-2 py-1 text-foreground transition-colors hover:bg-accent ${
                      isActiveLink(item.href) && 'font-medium'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:block">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <OnlineStatusIndicator className="h-2 w-2" />
                  <span className="text-sm text-green-600">Online</span>
                  <Button
                    variant="default"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="bg-primary text-primary-foreground transition-colors hover:bg-primary/80"
                  >
                    Logga ut
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button
                    variant="default"
                    className="bg-primary text-primary-foreground transition-colors hover:bg-primary/80"
                  >
                    Logga in
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative h-14 w-14 p-0 hover:bg-transparent md:hidden"
              onClick={handleToggleMenu}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                {/* Transform transition lines */}
                <span
                  className={`bg-foreground absolute h-[2px] rounded-full transition-all duration-300 ease-in-out ${
                    isOpen
                      ? 'w-5 translate-y-0 rotate-45'
                      : 'w-5 -translate-y-1.5'
                  }`}
                />
                <span
                  className={`bg-foreground absolute h-[2px] rounded-full transition-all duration-300 ease-in-out ${
                    isOpen ? 'w-0 opacity-0' : 'w-5 opacity-100'
                  }`}
                />
                <span
                  className={`bg-foreground absolute h-[2px] rounded-full transition-all duration-300 ease-in-out ${
                    isOpen
                      ? 'w-5 translate-y-0 -rotate-45'
                      : 'w-5 translate-y-1.5'
                  }`}
                />
              </div>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div
          className={`bg-background fixed inset-0 z-40 transition-transform duration-500 ease-in-out md:hidden ${
            isOpen ? 'translate-y-16' : 'translate-y-[-100%]'
          }`}
        >
          <div className="flex h-[calc(100vh-4rem)] flex-col px-6 py-8 md:px-8">
            <div className="-mt-20 flex h-full flex-col items-center justify-center space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-3xl transition-colors ${
                    isActiveLink(item.href)
                      ? 'font-medium text-foreground'
                      : 'hover:bg-secondary rounded-md px-2 py-1 text-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-8 w-full max-w-[200px]">
                {isAuthenticated ? (
                  <Button
                    variant="default"
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                      setIsOpen(false);
                    }}
                    className="bg-primary w-full text-lg text-primary-foreground transition-colors"
                  >
                    Logga ut
                  </Button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="block w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="default"
                      className="w-full bg-primary text-lg text-primary-foreground transition-colors"
                    >
                      Logga in
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
