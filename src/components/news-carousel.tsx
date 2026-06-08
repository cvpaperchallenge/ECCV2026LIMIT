import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsItem {
  title: string;
  date: string;
  content: string;
}

export function NewsCarousel({ items }: { items: NewsItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const firstCard = container.children[0] as HTMLElement | undefined;
      if (!firstCard) return;
      const gap = parseFloat(getComputedStyle(container).columnGap) || 0;
      const step = firstCard.offsetWidth + gap;
      const index = Math.round(container.scrollLeft / step);
      setActiveIndex(Math.min(index, items.length - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [items.length]);

  const scrollTo = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const card = container.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, []);

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Latest news"
    >
      {/* Arrow buttons */}
      <button
        onClick={() => scrollTo(activeIndex - 1)}
        className={cn(
          "absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10",
          "glass rounded-full p-2 shadow-lg",
          "transition-opacity duration-200",
          "hover:bg-primary/10 hover:text-primary",
          activeIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
        aria-label="Previous news"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scrollTo(activeIndex + 1)}
        className={cn(
          "absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10",
          "glass rounded-full p-2 shadow-lg",
          "transition-opacity duration-200",
          "hover:bg-primary/10 hover:text-primary",
          activeIndex === items.length - 1
            ? "opacity-0 pointer-events-none"
            : "opacity-100",
        )}
        aria-label="Next news"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
      >
        {items.map((news, index) => (
          <div
            key={index}
            className="snap-start shrink-0 w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)]"
            role="group"
            aria-roledescription="slide"
            aria-label={`News ${index + 1} of ${items.length}`}
          >
            <div className="glass rounded-2xl p-8 shadow-md card-hover border h-full">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{news.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {news.date}
                  </p>
                </div>
                <p className="text-base leading-relaxed text-foreground/80">
                  {news.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              activeIndex === index
                ? "w-6 bg-primary"
                : "w-2 bg-primary/30 hover:bg-primary/50",
            )}
            aria-label={`Go to news ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
