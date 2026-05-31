/**
 * Calculate days until a date.
 * When the date string contains "AoE", uses Anywhere on Earth (UTC-12)
 * so deadlines are not shown as ended prematurely.
 */
export function daysUntil(dateString: string): number | null {
  if (/tbd/i.test(dateString)) {
    return null;
  }

  const isAoE = /AoE/i.test(dateString);
  const cleanDate = dateString.replace(/,?\s*AoE$/i, "").trim();

  const targetDate = new Date(cleanDate);
  if (isNaN(targetDate.getTime())) {
    return null;
  }

  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth();
  const targetDay = targetDate.getDate();

  let todayYear: number, todayMonth: number, todayDay: number;

  if (isAoE) {
    // AoE = UTC-12: subtract 12 hours from UTC to get current AoE wall-clock
    const now = new Date();
    const aoeNow = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    todayYear = aoeNow.getUTCFullYear();
    todayMonth = aoeNow.getUTCMonth();
    todayDay = aoeNow.getUTCDate();
  } else {
    const now = new Date();
    todayYear = now.getFullYear();
    todayMonth = now.getMonth();
    todayDay = now.getDate();
  }

  const target = Date.UTC(targetYear, targetMonth, targetDay);
  const today = Date.UTC(todayYear, todayMonth, todayDay);

  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date has passed
 */
export function isPast(dateString: string): boolean {
  const days = daysUntil(dateString);
  return days !== null && days < 0;
}

/**
 * Find the next upcoming date from a list of dates
 */
export function findNextDate(
  dates: Array<{ title: string; date: string }>,
): { title: string; date: string; daysUntil: number } | null {
  const upcomingDates = dates
    .map((item) => ({
      ...item,
      daysUntil: daysUntil(item.date),
    }))
    .filter(
      (item): item is { title: string; date: string; daysUntil: number } =>
        item.daysUntil !== null && item.daysUntil >= 0,
    )
    .sort((a, b) => a.daysUntil - b.daysUntil);

  return upcomingDates.length > 0 ? upcomingDates[0] : null;
}

/**
 * Generate an .ics calendar file for a workshop event
 */
export function generateICS(
  title: string,
  date: string,
  description?: string,
): string {
  // Strip AoE suffix before parsing
  const cleanDate = date.replace(/,?\s*AoE$/i, "").trim();
  const eventDate = new Date(cleanDate);

  // If date is invalid, use a placeholder
  if (isNaN(eventDate.getTime())) {
    // Return a placeholder ICS with TBD
    const now = new Date();
    return generateICSContent(
      title,
      now,
      now,
      description || "Date to be determined",
    );
  }

  // Set default times if not specified
  const startDate = new Date(eventDate);
  startDate.setHours(9, 0, 0, 0); // 9:00 AM default

  const endDate = new Date(eventDate);
  endDate.setHours(17, 0, 0, 0); // 5:00 PM default

  return generateICSContent(title, startDate, endDate, description);
}

function generateICSContent(
  title: string,
  startDate: Date,
  endDate: Date,
  description?: string,
): string {
  const formatDate = (date: Date): string => {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  };

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Workshop Template//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `SUMMARY:${title}`,
    description ? `DESCRIPTION:${description}` : "",
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    `UID:${Date.now()}@workshop-template.com`,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");

  return icsContent;
}

/**
 * Download an .ics file
 */
export function downloadICS(title: string, date: string, description?: string) {
  const icsContent = generateICS(title, date, description);
  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  const filename = `${title.replace(/\s+/g, "-").toLowerCase()}.ics`;
  link.download = filename;
  link.setAttribute("download", filename); // Ensure download attribute is set
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, 100);
}
