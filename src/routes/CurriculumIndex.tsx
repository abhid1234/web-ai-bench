import { Link } from "react-router";
import { LESSONS } from "../lib/lessons";

export function Component() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col gap-3 pt-2">
        <div
          className="text-[10px] uppercase tracking-wider font-semibold"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Web AI Bench · Curriculum
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold leading-tight"
          style={{ color: "var(--color-on-surface)" }}
        >
          Learn in-browser AI by running real benchmarks.
        </h1>
        <p
          className="text-base md:text-lg leading-relaxed max-w-2xl"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          Seven short lessons that teach how AI runs on-device — through the browser. Every lesson includes a working
          lab you can run on this page, on this device, right now. No install, no SDK, no signup.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {LESSONS.map((l) => (
          <Link
            key={l.slug}
            to={l.path}
            className="group rounded-xl p-5 hover:shadow-md transition-all"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-outline-variant)",
            }}
          >
            <div className="flex items-start gap-5">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold tabular-nums"
                style={{
                  backgroundColor: "var(--color-primary-container)",
                  color: "var(--color-on-primary-container)",
                }}
              >
                {l.number}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-[10px] uppercase tracking-wider font-semibold mb-1"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  Lesson {l.number} · {l.kicker}
                </div>
                <h2
                  className="text-xl font-bold mb-1 group-hover:underline"
                  style={{ color: "var(--color-on-surface)" }}
                >
                  {l.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
                  {l.oneLiner}
                </p>
              </div>
              <div
                className="flex-shrink-0 self-center text-2xl"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <footer
        className="rounded-xl p-5 text-sm leading-relaxed"
        style={{
          backgroundColor: "var(--color-surface-container)",
          color: "var(--color-on-surface-variant)",
        }}
      >
        <div
          className="text-[10px] uppercase tracking-wider font-semibold mb-2"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          About this project
        </div>
        Web AI Bench is an open-source benchmark and education site for in-browser AI. Models load from Hugging Face via
        Transformers.js, run on your device, and contribute (if you choose) to a public matrix.{" "}
        <a
          href="https://github.com/abhid1234/web-ai-bench"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          GitHub
        </a>{" "}
        ·{" "}
        <Link to="/pitch" className="underline font-semibold" style={{ color: "var(--color-primary)" }}>
          Pitch deck
        </Link>
      </footer>
    </div>
  );
}
