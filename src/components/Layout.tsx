import { Outlet, Link } from "react-router";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <MobileHeader />
      <Sidebar />
      <main className="flex-1 px-4 py-6 md:px-10 md:py-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

function MobileHeader() {
  return (
    <header
      className="md:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-10"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-outline-variant)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Link to="/" className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          WB
        </div>
        <div>
          <div className="font-bold text-sm leading-tight" style={{ color: "var(--color-on-surface)" }}>
            Web AI Bench
          </div>
          <div className="text-[9px] uppercase tracking-wider" style={{ color: "var(--color-outline)" }}>
            Curriculum
          </div>
        </div>
      </Link>
      <Link
        to="/"
        className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-md"
        style={{
          backgroundColor: "var(--color-primary-container)",
          color: "var(--color-on-primary-container)",
        }}
      >
        All lessons
      </Link>
    </header>
  );
}
