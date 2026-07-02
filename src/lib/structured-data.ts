/**
 * Generates JSON-LD structured data for workshop events
 * This helps search engines understand the event details and display rich results
 */

type WorkshopStructuredData = {
  name: string;
  description: string;
  startDate: string; // ISO 8601 format: YYYY-MM-DDTHH:MM
  endDate?: string; // ISO 8601 format: YYYY-MM-DDTHH:MM
  location: {
    name: string;
    address?: string;
  };
  organizer: {
    name: string;
    url?: string;
  };
  eventAttendanceMode?:
    | "OfflineEventAttendanceMode"
    | "OnlineEventAttendanceMode"
    | "MixedEventAttendanceMode";
  eventStatus?:
    "EventScheduled" | "EventCancelled" | "EventPostponed" | "EventRescheduled";
  image?: string;
  url?: string;
};

export function generateWorkshopStructuredData(
  data: WorkshopStructuredData,
): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: data.name,
    description: data.description,
    startDate: data.startDate,
    ...(data.endDate && { endDate: data.endDate }),
    location: {
      "@type": "Place",
      name: data.location.name,
      ...(data.location.address && { address: data.location.address }),
    },
    organizer: {
      "@type": "Organization",
      name: data.organizer.name,
      ...(data.organizer.url && { url: data.organizer.url }),
    },
    eventAttendanceMode:
      data.eventAttendanceMode || "OfflineEventAttendanceMode",
    eventStatus: data.eventStatus || "EventScheduled",
    ...(data.image && { image: data.image }),
    ...(data.url && { url: data.url }),
  };

  return JSON.stringify(structuredData);
}

/**
 * Generates JSON-LD structured data for a list of speakers/organizers
 */
type PersonData = {
  name: string;
  jobTitle?: string;
  affiliation?: string;
  image?: string;
  url?: string;
};

export function generatePersonListStructuredData(people: PersonData[]): string {
  const structuredData = people.map((person) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    ...(person.jobTitle && { jobTitle: person.jobTitle }),
    ...(person.affiliation && {
      worksFor: {
        "@type": "Organization",
        name: person.affiliation,
      },
    }),
    ...(person.image && { image: person.image }),
    ...(person.url && { url: person.url }),
  }));

  return JSON.stringify(structuredData);
}
