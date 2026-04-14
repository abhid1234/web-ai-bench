import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
