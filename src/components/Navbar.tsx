"use client";

// import * as React from 'react';
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

interface NavItem {
  href: string;
  label: string;
}

// Grundläggande navigationslänkar som alla besökare kan se
const publicNavItems: NavItem[] = [
  { href: "/page1", label: "Page 1" },
  { href: "/page2", label: "Page 2" },
  { href: "/page3", label: "Page 3" },
  { href: "/page4", label: "Page 4" },
  { href: "/page5", label: "Page 5" },
];

// Rollspecifika navigationslänkar
const roleBasedNavItems: Record<string, NavItem[]> = {
  // ADMIN: [{ href: "/dashboard", label: "Dashboard" }],
  USER: [{ href: "/admin", label: "Admin Panel" }],
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  // Hämta aktuell session från NextAuth
  const { data: session, status } = useSession();

  // Kontrollera om användaren är inloggad
  const isAuthenticated = status === "authenticated";
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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Helper function to determine if a nav item is active
  const isActiveLink = (href: string): boolean => {
    return pathname === href || (href !== "/" && pathname?.startsWith(href));
  };

  return (
    <>
      <div className="h-16" />
      <div className="relative">
        <nav className="fixed z-50 top-0 left-0 right-0 w-full border-b transition-colors duration-500 bg-background/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-6 md:px-8">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-semibold text-xl text-black">
                Egen Lista
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2 py-1 rounded-md transition-colors text-black hover:bg-gray-100 ${
                      isActiveLink(item.href) && "font-medium"
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
                <Button
                  variant="default"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-black text-white hover:bg-black/80 transition-colors"
                >
                  Logga ut
                </Button>
              ) : (
                <Link href="/auth/login">
                  <Button
                    variant="default"
                    className="bg-black text-white hover:bg-black/80 transition-colors"
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
              className="relative md:hidden hover:bg-transparent p-0 h-14 w-14"
              onClick={handleToggleMenu}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 relative flex items-center justify-center">
                {/* Transform transition lines */}
                <span
                  className={`absolute h-[2px] rounded-full bg-foreground transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "w-5 rotate-45 translate-y-0"
                      : "w-5 -translate-y-1.5"
                  }`}
                />
                <span
                  className={`absolute h-[2px] rounded-full bg-foreground transition-all duration-300 ease-in-out ${
                    isOpen ? "w-0 opacity-0" : "w-5 opacity-100"
                  }`}
                />
                <span
                  className={`absolute h-[2px] rounded-full bg-foreground transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "w-5 -rotate-45 translate-y-0"
                      : "w-5 translate-y-1.5"
                  }`}
                />
              </div>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-background transition-transform duration-500 ease-in-out md:hidden ${
            isOpen ? "translate-y-16" : "translate-y-[-100%]"
          }`}
        >
          <div className="px-6 md:px-8 py-8 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex flex-col items-center justify-center h-full -mt-20 space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-3xl transition-colors relative ${
                    isActiveLink(item.href)
                      ? "text-black font-medium"
                      : "text-black hover:bg-secondary px-2 py-1 rounded-md"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="w-full max-w-[200px] mt-8">
                {isAuthenticated ? (
                  <Button
                    variant="default"
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setIsOpen(false);
                    }}
                    className="w-full text-lg bg-primary text-white transition-colors"
                  >
                    Logga ut
                  </Button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="w-full block"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button
                      variant="default"
                      className="w-full text-lg bg-black text-white transition-colors"
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
