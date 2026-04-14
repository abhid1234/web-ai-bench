import { NavLink } from "react-router";

const navItems = [
  { to: "/", label: "Bench", end: true, icon: BenchIcon },
  { to: "/matrix", label: "Matrix", icon: MatrixIcon },
  { to: "/models", label: "Models", icon: ModelsIcon },
  { to: "/about", label: "About", icon: AboutIcon },
];

export function Sidebar() {
  return (
    <aside
      className="w-60 flex-shrink-0 border-r flex flex-col"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-outline-variant)",
      }}
    >
      <div className="px-5 py-6 border-b" style={{ borderColor: "var(--color-outline-variant)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            WB
          </div>
          <div>
            <div className="font-bold text-sm leading-tight" style={{ color: "var(--color-on-surface)" }}>
              Web AI Bench
            </div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-outline)" }}>
              v0.1
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "" : "hover:bg-[color:var(--color-surface-container)]"
              }`
            }
            style={({ isActive }) =>
              isActive
                ? {
                    backgroundColor: "var(--color-primary-container)",
                    color: "var(--color-on-primary-container)",
                  }
                : { color: "var(--color-on-surface-variant)" }
            }
          >
            <item.icon />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t text-[11px] space-y-2" style={{ borderColor: "var(--color-outline-variant)", color: "var(--color-outline)" }}>
        <div className="flex flex-wrap gap-1.5">
          <BackendChip name="WebNN" color="var(--color-webnn)" />
          <BackendChip name="WebGPU" color="var(--color-webgpu)" />
          <BackendChip name="WASM" color="var(--color-wasm)" />
        </div>
        <a
          href="https://github.com/abhid1234/web-ai-bench"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:underline"
        >
          GitHub →
        </a>
      </div>
    </aside>
  );
}

function BackendChip({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {name}
    </span>
  );
}

function BenchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-4 4 4 6-6" />
    </svg>
  );
}

function MatrixIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function ModelsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
