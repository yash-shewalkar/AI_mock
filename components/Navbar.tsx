"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentUser, signOut } from "@/lib/actions/auth.action"; // Import signOut

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string } | null>(null);

  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(/^\/(en|fr|es)/, "");

  useEffect(() => {
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      // Optionally redirect to login page after logout
      window.location.href = '/sign-in';
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/create-interview", label: "Create Interview" },
    { href: "/resume-parser", label: "Resume Parser" },
    { href: "/lms-platform", label: "Learning Platform" },   //TODO: Add link to LMS platform
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Branding (Left side) */}
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-full p-1.5">
            <Image src="/logo.png" alt="MockMate Logo" width={38} height={32} className="object-fit" />
          </div>
          <span className="text-lg font-bold tracking-tight">RiseUp</span>
        </Link>

        {/* Desktop Navigation (Center) */}
        <div className="hidden md:flex mx-4">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      active={pathWithoutLocale === item.href}
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {user ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden sm:inline-flex"
              onClick={handleLogout}
            >
              {user.name || "Logout"}
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background pb-4 px-4 border-t">
          <div className="flex flex-col space-y-2 pt-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "w-full px-4 py-2 rounded-md text-sm font-medium",
                  pathWithoutLocale === item.href
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <Button variant="outline" className="mt-2 w-full" onClick={handleLogout}>
                {user.name || "Logout"}
              </Button>
            ) : (
              <Link href="/sign-in">
                <Button variant="outline" className="mt-2 w-full">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}