import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "./button";

/**
 * The stored theme is read in an effect rather than in the `useState`
 * initialiser it used to be read in. Two reasons, both of which only started
 * to matter once a route was prerendered:
 *
 * `localStorage` does not exist while the HTML is being generated in Node, so
 * the initialiser threw and took the whole prerender down with it. And even
 * behind a `typeof window` guard it would still be wrong, because the markup
 * is built once at build time with no way to know which theme any particular
 * visitor stored — a reader with the dark theme set would hydrate against
 * light markup and React would have to discard it.
 *
 * Starting from the same "light" both sides agree on and correcting in an
 * effect keeps hydration clean. The correction lands in the same commit as
 * hydration, so it is not a flash anyone sees.
 */
export function ThemeToggle() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const stored = localStorage.getItem("theme");

    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, []);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Button
      className="hover:bg-header-accent dark:hover:bg-header-accent/50"
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
