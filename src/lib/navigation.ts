/**
 * Primary navigation, shared by the header and by the footer's Quick Links so
 * the two lists cannot drift apart.
 *
 * Sections deliberately left out: Call for Papers, which is archival now that
 * the call has closed, and Reviewers, until that list is published.
 */
export const navItems = [
  { name: "Home", path: "/" },
  { name: "Program", path: "/#program" },
  { name: "Speakers", path: "/#speakers" },
  // The only entry that is a page rather than a section of the home page:
  // the award has to be linkable on its own for the authors to share it.
  { name: "Award", path: "/best-paper-award" },
  { name: "Papers", path: "/#papers" },
  { name: "Organizers", path: "/#organizers" },
  { name: "Sponsors", path: "/#sponsors" },
  { name: "Contact", path: "/#contact" },
];
