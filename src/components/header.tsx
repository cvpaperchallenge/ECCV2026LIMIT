import { Link } from "react-router";
import { Menu } from "lucide-react";

import whiteLimitLabLogoWide from "../../public/limitlab-logo-white-wide.png";
import blackLimitLabLogoWide from "../../public/limitlab-logo-black-wide.png";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";

const navItems = [
  { name: "Home", path: "/" },
  { name: "CFP", path: "/#cfp" },
  { name: "Program", path: "/#program" },
  { name: "Speakers", path: "/#speakers" },
  { name: "Organizers", path: "/#organizers" },
  { name: "Sponsors", path: "/#sponsors" },
  { name: "Contact", path: "/#contact" },
];

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-header-background/80 backdrop-blur-xl flex justify-center shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 xl:max-w-6xl">
        <div className="flex items-center gap-2">
          <a
            href="https://limitlab.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 group"
          >
            {/* <span className="font-bold text-xl">VGI 2026</span> */}
            <img
              src={blackLimitLabLogoWide}
              alt="LIMIT Workshop logo"
              className="object-contain h-16 w-auto dark:hidden transition-transform group-hover:scale-105"
              loading="lazy"
            />
            <img
              src={whiteLimitLabLogoWide}
              alt="LIMIT Workshop logo"
              className="object-contain h-16 w-auto hidden dark:block transition-transform group-hover:scale-105"
              loading="lazy"
            />
          </a>
        </div>

        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <Link to={item.path}>
                      <NavigationMenuLink className="bg-transparent hover:bg-primary/10 font-medium transition-colors px-4 py-2 rounded-lg">
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <ThemeToggle />

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass-strong">
              <div className="flex flex-col gap-6 py-8">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.path}>
                    <Link
                      to={item.path}
                      className="block px-4 py-3 text-lg font-semibold hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
