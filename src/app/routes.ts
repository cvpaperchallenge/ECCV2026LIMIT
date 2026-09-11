import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layout.tsx", [
    index("./routes/Home.tsx"),
    route("/best-paper-award", "./routes/BestPaperAward.tsx"),
    // route("/schedule", "./routes/Schedule.tsx"),
    // route("/program", "./routes/Program.tsx"),
    // route("/organizers", "./routes/Organizers.tsx"),
    // route("/past-events", "./routes/PastEvents.tsx"),
    // route("/contact", "./routes/Contact.tsx"),
  ]),
] satisfies RouteConfig;
