import { Outlet } from "react-router";
import { AppHeader } from "@/components/shared/AppHeader";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <AppHeader />
      <main className="px-6 pb-10">
        <Outlet />
      </main>
    </div>
  );
}
