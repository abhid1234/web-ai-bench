import { Link } from "react-router";
import type { ReactNode } from "react";
import { getLesson, getNextLesson, getPrevLesson } from "../lib/lessons";

export function LessonShell({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const lesson = getLesson(slug);
  const prev = getPrevLesson(slug);
  const next = getNextLesson(slug);

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <p style={{ color: "var(--color-on-surface-variant)" }}>Unknown lesson.</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold tabular-nums"
            style={{
              backgroundColor: "var(--color-primary-container)",
              color: "var(--color-on-primary-container)",
            }}
          >
            {lesson.number}
          </span>
          <span
            className="text-[10px] uppercase tracking-wider font-semibold"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            Lesson {lesson.number} · {lesson.minutes} min read · {lesson.kicker}
          </span>
        </div>
        <h1
          className="text-3xl md:text-4xl font-bold leading-tight"
          style={{ color: "var(--color-on-surface)" }}
        >
          {lesson.title}
        </h1>
        <p
          className="text-base md:text-lg leading-relaxed max-w-2xl"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          {lesson.oneLiner}
        </p>
        <a
          href="#lab"
          className="inline-flex self-start items-center gap-2 mt-1 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "var(--color-tertiary-container)",
            color: "var(--color-tertiary)",
          }}
        >
          Skip to lab ↓
        </a>
      </header>

      <div className="flex flex-col gap-6">{children}</div>

      <nav
        className="grid grid-cols-2 gap-3 mt-8 pt-6"
        style={{ borderTop: "1px solid var(--color-outline-variant)" }}
      >
        {prev ? (
          <Link
            to={prev.path}
            className="rounded-xl p-4 hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-outline-variant)",
            }}
          >
            <div
              className="text-[10px] uppercase tracking-wider font-semibold mb-1"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              ← Lesson {prev.number}
            </div>
            <div className="font-bold text-sm" style={{ color: "var(--color-on-surface)" }}>
              {prev.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            to={next.path}
            className="rounded-xl p-4 text-right hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: "var(--color-primary-container)",
              border: "1px solid var(--color-primary)",
            }}
          >
            <div
              className="text-[10px] uppercase tracking-wider font-semibold mb-1"
              style={{ color: "var(--color-on-primary-container)" }}
            >
              Next: Lesson {next.number} →
            </div>
            <div className="font-bold text-sm" style={{ color: "var(--color-on-primary-container)" }}>
              {next.title}
            </div>
          </Link>
        ) : (
          <Link
            to="/"
            className="rounded-xl p-4 text-right hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-outline-variant)",
            }}
          >
            <div
              className="text-[10px] uppercase tracking-wider font-semibold mb-1"
              style={{ color: "var(--color-on-surface-variant)" }}
            >
              ← Back to curriculum
            </div>
            <div className="font-bold text-sm" style={{ color: "var(--color-on-surface)" }}>
              Curriculum index
            </div>
          </Link>
        )}
      </nav>
    </article>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className="prose-block flex flex-col gap-4 text-[17px] md:text-[15px] leading-[1.7] md:leading-relaxed"
      style={{ color: "var(--color-on-surface)" }}
    >
      {children}
    </div>
  );
}

export function Callout({ children, kind = "info" }: { children: ReactNode; kind?: "info" | "warning" | "success" }) {
  const palette: Record<string, { bg: string; fg: string }> = {
    info: { bg: "var(--color-primary-container)", fg: "var(--color-on-primary-container)" },
    warning: { bg: "var(--color-danger-container)", fg: "var(--color-danger)" },
    success: { bg: "var(--color-tertiary-container)", fg: "var(--color-tertiary)" },
  };
  const c = palette[kind];
  return (
    <div
      className="rounded-lg p-4 text-[15px] md:text-sm leading-relaxed"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {children}
    </div>
  );
}

/**
 * CardGrid — replaces dense bullet lists with scannable cards.
 * Pass an array of items; each renders as a card with a label, title, and body.
 */
export function CardGrid({ items, cols = 2 }: { items: CardItem[]; cols?: 1 | 2 | 3 }) {
  const colsClass = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid ${colsClass} gap-3`}>
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-lg p-4 flex flex-col gap-2"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-outline-variant)",
          }}
        >
          {item.label && (
            <div
              className="text-[10px] uppercase tracking-wider font-bold inline-block self-start px-2 py-0.5 rounded"
              style={{
                color: item.labelColor ?? "var(--color-on-surface-variant)",
                backgroundColor: item.labelBg ?? "var(--color-surface-container)",
              }}
            >
              {item.label}
            </div>
          )}
          <div className="text-base font-bold leading-tight" style={{ color: "var(--color-on-surface)" }}>
            {item.title}
          </div>
          <div className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
            {item.body}
          </div>
        </div>
      ))}
    </div>
  );
}

export interface CardItem {
  label?: string;
  labelColor?: string;
  labelBg?: string;
  title: ReactNode;
  body: ReactNode;
}

/**
 * LabAnchor — wrap each lesson's interactive lab in this so the
 * "Skip to lab ↓" pill in the header has somewhere to scroll to.
 */
export function LabAnchor({ children }: { children: ReactNode }) {
  return (
    <div id="lab" className="scroll-mt-20">
      {children}
    </div>
  );
}
