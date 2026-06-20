import { Outlet } from "react-router-dom";

import TopBar from "@/shared/components/layout/TopBar";
import GlassBackground from "@/shared/components/bg/GlassBackground";

const TopBarLayout = () => (
  <div className="relative min-h-screen text-foreground">
    <GlassBackground />
    <TopBar />
    <main className="relative z-10 mx-auto max-w-[1600px] px-4 py-6 md:px-6">
      <Outlet />
    </main>
  </div>
);

export default TopBarLayout;
