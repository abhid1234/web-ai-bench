import { NavLink, Link } from "react-router";
import { LESSONS } from "../lib/lessons";

export function Sidebar() {
  return (
    <aside
      className="hidden md:flex w-64 flex-shrink-0 border-r flex-col"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-outline-variant)",
      }}
    >
      <div className="px-5 py-6 border-b" style={{ borderColor: "var(--color-outline-variant)" }}>
        <Link to="/" className="flex items-center gap-2.5">
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
              Curriculum
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
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
          Curriculum index
        </NavLink>

        <div
          className="px-3 pt-4 pb-1 text-[10px] uppercase tracking-wider font-bold"
          style={{ color: "var(--color-outline)" }}
        >
          Lessons
        </div>

        {LESSONS.map((lesson) => (
          <NavLink
            key={lesson.slug}
            to={lesson.path}
            className={({ isActive }) =>
              `flex items-start gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
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
            <span
              className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold tabular-nums mt-0.5"
              style={{
                backgroundColor: "var(--color-surface-container)",
                color: "var(--color-on-surface-variant)",
              }}
            >
              {lesson.number}
            </span>
            <span className="font-semibold leading-snug">{lesson.title}</span>
          </NavLink>
        ))}
      </nav>

      <div
        className="px-5 py-4 border-t text-[11px] space-y-3"
        style={{ borderColor: "var(--color-outline-variant)", color: "var(--color-outline)" }}
      >
        <div className="flex flex-wrap gap-1.5">
          <BackendChip name="WebNN" color="var(--color-webnn)" />
          <BackendChip name="WebGPU" color="var(--color-webgpu)" />
          <BackendChip name="WASM" color="var(--color-wasm)" />
        </div>
        <div className="flex flex-col gap-1">
          <Link to="/pitch" className="hover:underline" style={{ color: "var(--color-on-surface-variant)" }}>
            Pitch deck →
          </Link>
          <a
            href="https://github.com/abhid1234/web-ai-bench"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub →
          </a>
        </div>
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
