import { Clock, Calendar } from "lucide-react";
import { findNextDate } from "@/lib/calendar";

interface DeadlineBannerProps {
  dates: Array<{ title: string; date: string }>;
}

export function DeadlineBanner({ dates }: DeadlineBannerProps) {
  const nextDate = findNextDate(dates);

  if (!nextDate) {
    return null;
  }

  const { title, date, daysUntil } = nextDate;

  // Determine urgency level for styling
  const isUrgent = daysUntil <= 7;
  const isModerate = daysUntil > 7 && daysUntil <= 30;

  return (
    <div
      className={`sticky top-20 z-40 w-full border-b shadow-sm ${
        isUrgent
          ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900"
          : isModerate
            ? "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900"
            : "bg-primary/5 border-primary/10"
      }`}
    >
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <Clock
            className={`h-4 w-4 shrink-0 ${
              isUrgent
                ? "text-red-600 dark:text-red-400"
                : isModerate
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-primary"
            }`}
          />
          <span className="font-semibold">{title}</span>
        </div>
        <span className="text-muted-foreground hidden sm:inline">•</span>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground">{date}</span>
        </div>
        <span className="text-muted-foreground hidden sm:inline">•</span>
        <span
          className={`font-bold hidden sm:inline ${
            isUrgent
              ? "text-red-600 dark:text-red-400"
              : isModerate
                ? "text-orange-600 dark:text-orange-400"
                : "text-primary"
          }`}
        >
          {daysUntil === 0
            ? "Today!"
            : daysUntil === 1
              ? "Tomorrow!"
              : `in ${daysUntil} days`}
        </span>
      </div>
    </div>
  );
}
