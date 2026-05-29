import { Outlet } from "react-router";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { DeadlineBanner } from "@/components/deadline-banner";
import workshopData from "@/data/workshop.json";

export default function SharedUILayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background from-20% via-background-gradation-1 via-50% to-background-gradation-2 to-90%">
      <div className="bg-animated simple-grid flex min-h-screen w-full flex-col items-center overflow-x-hidden">
        <Header />
        <DeadlineBanner dates={workshopData.home.importantDates} />
        <div className="grow pt-20">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}
