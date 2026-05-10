import { useState, useEffect, useCallback } from "react";

// Google brand colors — calibrated for white backgrounds
const BLUE = "#1a73e8";
const GREEN = "#34a853";
const RED = "#ea4335";
const YELLOW = "#f9ab00";

// Neutral palette
const INK = "#202124";
const GRAY = "#5f6368";
const MUTED = "#9aa0a6";
const BORDER = "#e8eaed";
const SURFACE = "#ffffff";
const PAGE = "#f8f9fa";

// ─── Citation registry ───────────────────────────────────────────────────────
// Sources are verified May 2026 via Gemini Deep Research Max. URLs are Gemini's
// grounding redirects; they resolve to the labeled domain.

type Source = { label: string; url: string };
const SOURCES: Source[] = [
  { label: "Google AI Edge Blog — LiteRT replaces TFLite (TF 2.21)", url: "https://developers.googleblog.com/en/google-ai-edge/" },
  { label: "Google AI Edge — LiteRT-LM and Gemma support", url: "https://ai.google.dev/edge/litert" },
  { label: "Meta / PyTorch — ExecuTorch v1.2.0 release", url: "https://github.com/pytorch/executorch/releases" },
  { label: "PyTorch Foundation — ExecuTorch joins as Core project (Apr 2026)", url: "https://pytorch.org/blog/" },
  { label: "Linux Foundation — vendor-neutral governance for ExecuTorch", url: "https://www.linuxfoundation.org/" },
  { label: "AI Engineer World's Fair 2026 — June 30 – July 2, San Francisco", url: "https://ai.engineer/" },
  { label: "Moscone Center — World's Fair venue confirmation", url: "https://www.moscone.com/" },
  { label: "AWS — SageMaker Edge Manager end-of-life (April 2024)", url: "https://docs.aws.amazon.com/sagemaker/latest/dg/edge-eol.html" },
  { label: "Hugging Face — Transformers.js v4 with C++ WebGPU (Feb 2026)", url: "https://huggingface.co/blog" },
  { label: "Hugging Face — litert-community organization", url: "https://huggingface.co/litert-community" },
  { label: "Qualcomm — AI Engine Direct SDK (replaces SNPE)", url: "https://www.qualcomm.com/developer/software/qualcomm-ai-engine-direct-sdk" },
  { label: "Google AI Edge — LiteRT × Qualcomm AI Engine Direct Accelerator", url: "https://developers.googleblog.com/en/google-ai-edge-qualcomm/" },
  { label: "Google AI Edge — LiteRT × MediaTek NeuroPilot Accelerator", url: "https://developers.googleblog.com/en/google-ai-edge-mediatek/" },
  { label: "Android Developers — AICore system service & Gemini Nano", url: "https://developer.android.com/ai/aicore" },
  { label: "Google DeepMind — Gemma 4 (E2B / E4B edge models, Apr 2026)", url: "https://deepmind.google/technologies/gemma/" },
  { label: "ARM — Ethos-U85 microNPU specifications", url: "https://www.arm.com/products/silicon-ip-cpu/ethos/ethos-u85" },
  { label: "GitHub Marketplace — current LiteRT / TFLite Actions inventory", url: "https://github.com/marketplace?type=actions&query=tflite" },
  { label: "Edge Impulse — build-deploy GitHub Action (MCU exception)", url: "https://github.com/edgeimpulse/build-deploy" },
  { label: "Apple — Core ML Tools and on-device deployment", url: "https://developer.apple.com/documentation/coreml" },
];

function Cite({ ids }: { ids: number[] }) {
  return (
    <sup style={{ color: BLUE, fontWeight: 600 }} className="ml-0.5 text-[0.65em] tabular-nums">
      [{ids.map((i, idx) => (
        <span key={i}>
          <a href={SOURCES[i - 1]?.url ?? "#sources"} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: BLUE }}>{i}</a>
          {idx < ids.length - 1 ? "," : ""}
        </span>
      ))}]
    </sup>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col px-10 md:px-20 pt-14 pb-14 overflow-hidden">
      {children}
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{ color: INK }}
      className="text-3xl md:text-[2.2rem] font-extrabold mb-6 leading-tight"
    >
      {children}
    </h2>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      style={{ color, background: color + "18", border: `1px solid ${color}35` }}
      className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
    >
      {children}
    </span>
  );
}

function Card({
  children,
  accent,
  className = "",
}: {
  children: React.ReactNode;
  accent?: string;
  className?: string;
}) {
  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderLeft: accent ? `4px solid ${accent}` : `1px solid ${BORDER}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
      }}
      className={`rounded-xl p-5 ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Slide 0: Cover ──────────────────────────────────────────────────────────

function Cover() {
  return (
    <div
      style={{ background: SURFACE }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
    >
      <div className="flex gap-1.5 mb-12">
        {[
          { w: 56, c: BLUE },
          { w: 28, c: RED },
          { w: 14, c: YELLOW },
          { w: 28, c: GREEN },
        ].map((s) => (
          <div
            key={s.c}
            style={{ width: s.w, height: 5, background: s.c, borderRadius: 3 }}
          />
        ))}
      </div>
      <h1
        style={{ color: INK }}
        className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight max-w-4xl"
      >
        The deployment layer
        <br />
        for on-device AI
        <br />
        <span style={{ color: BLUE }}>is missing.</span>
      </h1>
      <p style={{ color: GRAY }} className="text-xl md:text-2xl mb-4 font-light">
        LiteRT Rotation — Three Plays to Own the Edge AI Stack
      </p>
      <p style={{ color: MUTED }} className="text-sm mt-4">
        Google Cloud Partnerships · LiteRT Team · May 2026
      </p>
    </div>
  );
}

// ─── Slide 1: The Problem ─────────────────────────────────────────────────────

function Problem() {
  const steps = [
    {
      n: "1",
      label: "Train",
      detail: "PyTorch → .pt file. This is the easy part.",
    },
    {
      n: "2",
      label: "Convert",
      detail:
        "litert-torch (Google's own library) converts PyTorch → TFLite in a single function call. But there is no CLI or GitHub Action that wraps it — developers still run it manually outside any CI pipeline.",
    },
    {
      n: "3",
      label: "Quantize",
      detail:
        "Standalone quantization tool. Not wired to CI. Manual every time.",
    },
    {
      n: "4",
      label: "Test",
      detail:
        "Standalone eval tools exist (MLPerf Mobile, TFLite eval binaries) but none are wired into CI — no PR-blocking accuracy gate exists for quantized models.",
    },
    {
      n: "5",
      label: "Version",
      detail: "Git + S3 + ad-hoc model registry. No rollback story.",
    },
    {
      n: "6",
      label: "Deploy",
      detail:
        "Separate pipeline per platform. Android, iOS, Web: three different workflows.",
    },
  ];
  return (
    <Wrap>
      <Title>
        Deploying a model to edge takes 6 manual steps.
        <br />
        <span style={{ color: GRAY }} className="text-2xl font-normal">
          For mobile and web on-device AI, there is no unified, cross-platform CI/CD pipeline.<Cite ids={[17, 18]} />
        </span>
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 content-start">
        {steps.map((s) => (
          <div
            key={s.n}
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            className="flex gap-4 p-4 rounded-xl"
          >
            <span
              style={{ color: RED }}
              className="text-2xl font-black tabular-nums leading-none mt-0.5"
            >
              {s.n}
            </span>
            <div>
              <div style={{ color: INK }} className="font-semibold">
                {s.label}
              </div>
              <div style={{ color: GRAY }} className="text-sm mt-0.5">
                {s.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ color: MUTED }} className="text-sm mt-4">
        ExecuTorch offers near-single-command export for PyTorch-native models
        with a public benchmark dashboard.<Cite ids={[3]} /> LiteRT has no equivalent packaged
        workflow. Edge Impulse covers the MCU/embedded slice via{" "}
        <code style={{ background: PAGE, border: `1px solid ${BORDER}` }} className="px-1 rounded font-mono text-xs">edgeimpulse/build-deploy</code>;<Cite ids={[18]} />{" "}
        nothing comparable exists for mobile or web.
      </p>
    </Wrap>
  );
}

// ─── Slide 2: The Stakes ──────────────────────────────────────────────────────

function Stakes() {
  return (
    <Wrap>
      <Title>The window is 18–24 months.</Title>
      <div className="flex flex-col gap-4 flex-1 justify-center">
        <Card accent={RED}>
          <div
            style={{ color: RED }}
            className="text-xs font-bold uppercase tracking-widest mb-2"
          >
            ExecuTorch · Linux Foundation (April 2026) · v1.2.0
          </div>
          <div style={{ color: INK }} className="text-lg font-bold mb-1">
            No longer "Meta's project" — vendor-neutral PyTorch Foundation core.<Cite ids={[3, 4, 5]} />
          </div>
          <div style={{ color: GRAY }} className="text-sm">
            Production-deployed across Instagram, WhatsApp, Ray-Ban Meta, and Quest 3.<Cite ids={[3]} />{" "}
            Near-single-command export via Hugging Face Optimum. Public
            benchmark dashboard at{" "}
            <code
              style={{
                background: PAGE,
                border: `1px solid ${BORDER}`,
                color: INK,
              }}
              className="px-1.5 py-0.5 rounded text-xs font-mono"
            >
              hud.pytorch.org/benchmark/llms
            </code>
            . The threat upgrade: enterprise buyers now treat it as an industry standard, not a Meta product.
          </div>
        </Card>

        <Card accent={YELLOW}>
          <div
            style={{ color: YELLOW }}
            className="text-xs font-bold uppercase tracking-widest mb-2"
          >
            AI Engineer World's Fair 2026 · Jun 30 – Jul 2 · San Francisco<Cite ids={[6, 7]} />
          </div>
          <div style={{ color: INK }} className="text-lg font-bold mb-1">
            6,000+ engineers. 20+ tracks. Zero on edge CI/CD.
          </div>
          <div style={{ color: GRAY }} className="text-sm">
            Agentic AI, LLM infrastructure, evals, voice, robotics — none covering
            on-device deployment toolchains. Definitive applied-AI venue with a
            thought-leadership vacuum waiting to be filled.
          </div>
        </Card>

        <Card accent={BLUE}>
          <div
            style={{ color: BLUE }}
            className="text-xs font-bold uppercase tracking-widest mb-2"
          >
            ONNX Runtime Web · v1.25.0 surge (April 2026)
          </div>
          <div style={{ color: INK }} className="text-lg font-bold mb-1">
            ~1.4M weekly downloads. Transformers.js v4 rewrote on top of it in C++ WebGPU.<Cite ids={[9]} />
          </div>
          <div style={{ color: GRAY }} className="text-sm">
            Browser AI has consolidated around ONNX. Google&apos;s{" "}
            <code style={{ background: PAGE, border: `1px solid ${BORDER}`, color: INK }} className="px-1.5 py-0.5 rounded text-xs font-mono">@litertjs/core</code>{" "}
            sits at ~800. The deployment toolchain — not the runtime — is now
            where the war is fought, and a year ago it was AWS SageMaker Edge
            (deprecated April 2024<Cite ids={[8]} />). LiteRT has the chips and the OS;
            it doesn&apos;t have the standard developer workflow.
          </div>
        </Card>
      </div>
    </Wrap>
  );
}

// ─── Slide 2.4: Market map — Web AI / Agentic ecosystem × Google 1P ──────────

type MarketCell = { vendors: string[]; isGap?: boolean };
type MarketCol = { col: string; sub: string; google: MarketCell; other: MarketCell };
type MarketGroup = { header: string; color: string; cols: MarketCol[] };

// Vendor census synthesized from:
//   1. pitch/runbook/research/2026-05-06-market-map.md (Gemini Deep Research Max)
//   2. pitch/runbook/research/2026-05-10-market-landscape-doc.md (the Web AI DevKit market doc)
// Format mirrors the Sequoia / Harness $11B Developer Toolchain map: super-headers
// span sub-categories. Rows are simplified to two: Google 1P vs. Other ecosystem.
// An empty Google cell with isGap is the strategic gap signal.
const MARKET: MarketGroup[] = [
  {
    header: "Setup & Compute Foundation",
    color: BLUE,
    cols: [
      {
        col: "Compute APIs",
        sub: "WebGPU / WebNN / Wasm",
        google: { vendors: ["WebGPU (Chrome-led)", "Chrome Built-in AI APIs", "WebMCP"] },
        other: { vendors: ["Safari WebGPU 26", "Firefox WebGPU", "W3C WebNN", "WebAssembly"] },
      },
      {
        col: "Browser ML Runtime",
        sub: "Low-level inference",
        google: { vendors: ["TensorFlow.js (legacy)", "LiteRT.js", "MediaPipe Web"] },
        other: { vendors: ["ONNX Runtime Web (1.4M/wk)"] },
      },
      {
        col: "Pipelines",
        sub: "NLP / Vision tasks",
        google: { vendors: ["MediaPipe tasks-genai"] },
        other: { vendors: ["Transformers.js v4", "HF Optimum"] },
      },
      {
        col: "In-Browser LLMs",
        sub: "Generative engines",
        google: { vendors: ["Chrome Gemini Nano (Prompt / Translator / Summarizer / Lang-Detect)"] },
        other: { vendors: ["WebLLM", "MLC web-llm", "llama.cpp wasm"] },
      },
    ],
  },
  {
    header: "Implementation & Orchestration",
    color: GREEN,
    cols: [
      {
        col: "Frontend AI UI",
        sub: "TS / React orchestration",
        google: { vendors: [], isGap: true },
        other: { vendors: ["Vercel AI SDK", "LangChain.js", "Mastra"] },
      },
      {
        col: "Agent Orchestration",
        sub: "Backend multi-agent",
        google: { vendors: ["ADK 2.0", "Genkit", "Vertex AI Agent Engine"] },
        other: { vendors: ["LangGraph", "CrewAI", "AutoGen", "Pydantic AI"] },
      },
      {
        col: "Browser Automation",
        sub: "LAMs + agentic web",
        google: { vendors: ["Puppeteer (legacy)"] },
        other: { vendors: ["Browser Use (80k★)", "Stagehand", "Firecrawl", "Playwright"] },
      },
      {
        col: "Agentic IDEs",
        sub: "Autonomous coding",
        google: { vendors: ["Project IDX", "Jules", "Antigravity"] },
        other: { vendors: ["Cursor", "Windsurf", "Amazon Kiro", "Devin"] },
      },
      {
        col: "Vibe Coding",
        sub: "No-code AI apps",
        google: { vendors: [], isGap: true },
        other: { vendors: ["Vercel v0", "Replit Agent", "Bolt.new", "Lovable"] },
      },
    ],
  },
  {
    header: "Deployment, Governance, Observability",
    color: RED,
    cols: [
      {
        col: "Headless Infra",
        sub: "Agentic browser hosting",
        google: { vendors: [], isGap: true },
        other: { vendors: ["Browserbase", "Render", "Fly.io"] },
      },
      {
        col: "AI Observability",
        sub: "Traces / evals / cost",
        google: { vendors: ["Vertex Agent Anomaly*"], isGap: true },
        other: { vendors: ["Langfuse", "Braintrust", "Helicone", "LangSmith", "Confident AI"] },
      },
      {
        col: "Agentic Browser",
        sub: "AI-first shell",
        google: { vendors: ["Chrome + Gemini in Chrome"] },
        other: { vendors: ["Sigma", "Dia", "Atlas", "Arc (sunset)"] },
      },
    ],
  },
];

function MarketPill({ text, tone }: { text: string; tone: "google" | "other" }) {
  const isG = tone === "google";
  return (
    <span
      style={{
        background: isG ? BLUE + "22" : "transparent",
        color: isG ? BLUE : INK,
        border: isG ? `1px solid ${BLUE}55` : "none",
        fontWeight: isG ? 700 : 400,
      }}
      className="inline-block rounded px-1 py-px text-[0.55rem] leading-tight"
    >
      {text}
    </span>
  );
}

function MarketMap() {
  const flatCols: { group: MarketGroup; col: MarketCol; isFirst: boolean; isLast: boolean }[] = [];
  MARKET.forEach((g) => {
    g.cols.forEach((c, i) => {
      flatCols.push({ group: g, col: c, isFirst: i === 0, isLast: i === g.cols.length - 1 });
    });
  });

  return (
    <Wrap>
      <Title>
        The Web AI / Agentic ecosystem.
        <br />
        <span style={{ color: GRAY }} className="text-2xl font-normal">
          Google 1P (blue) vs. the rest of the ecosystem. Empty 1P cells = gaps.
        </span>
      </Title>
      <div className="flex-1 overflow-x-auto -mx-2 px-2">
        <table
          className="w-full"
          style={{ borderCollapse: "separate", borderSpacing: 0, minWidth: 1200, tableLayout: "fixed" }}
        >
          <thead>
            {/* Super-header row */}
            <tr>
              <th
                rowSpan={2}
                style={{ background: SURFACE, borderBottom: `2px solid ${INK}`, width: 115 }}
                className="text-[0.55rem] uppercase tracking-widest font-bold p-1.5 text-left align-bottom"
              >
                <span style={{ color: MUTED }}>Row ↓</span>
              </th>
              {MARKET.map((g) => (
                <th
                  key={g.header}
                  colSpan={g.cols.length}
                  style={{
                    background: g.color + "12",
                    color: g.color,
                    borderBottom: `2px solid ${g.color}55`,
                  }}
                  className="text-[0.7rem] uppercase tracking-widest font-bold p-2 text-center"
                >
                  {g.header}
                </th>
              ))}
            </tr>
            {/* Sub-column header row */}
            <tr>
              {flatCols.map(({ group, col, isFirst }, i) => (
                <th
                  key={i}
                  style={{
                    background: SURFACE,
                    borderBottom: `2px solid ${INK}`,
                    borderLeft: isFirst ? `2px solid ${group.color}55` : `1px solid ${BORDER}`,
                    color: INK,
                  }}
                  className="text-[0.62rem] font-bold uppercase tracking-wider p-1.5 text-left align-top"
                >
                  <div>{col.col}</div>
                  <div style={{ color: MUTED }} className="text-[0.5rem] font-normal normal-case mt-0.5">
                    {col.sub}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Row 1 — Google 1P */}
            <tr>
              <th
                style={{
                  background: BLUE + "0d",
                  borderRight: `2px solid ${BLUE}`,
                  color: BLUE,
                }}
                className="text-[0.62rem] uppercase tracking-wider font-bold p-1.5 text-left align-top"
              >
                Google 1P
              </th>
              {flatCols.map(({ group, col, isFirst }, i) => {
                const isGap = !!col.google.isGap;
                return (
                  <td
                    key={i}
                    style={{
                      background: isGap ? RED + "0d" : BLUE + "08",
                      borderTop: `1px solid ${BORDER}`,
                      borderRight: `1px solid ${BORDER}`,
                      borderLeft: isFirst
                        ? `2px solid ${group.color}55`
                        : `1px solid ${BORDER}`,
                    }}
                    className="p-1.5 align-top"
                  >
                    {isGap && col.google.vendors.length === 0 && (
                      <div
                        style={{ color: RED, fontWeight: 700 }}
                        className="text-[0.55rem] uppercase tracking-widest"
                      >
                        GAP — no 1P
                      </div>
                    )}
                    {isGap && col.google.vendors.length > 0 && (
                      <div
                        style={{ color: RED, fontWeight: 700 }}
                        className="text-[0.5rem] uppercase tracking-widest mb-1"
                      >
                        Weak
                      </div>
                    )}
                    <div className="flex flex-wrap gap-0.5">
                      {col.google.vendors.map((v) => (
                        <MarketPill key={v} text={v} tone="google" />
                      ))}
                    </div>
                  </td>
                );
              })}
            </tr>
            {/* Row 2 — Other ecosystem */}
            <tr>
              <th
                style={{
                  background: PAGE,
                  borderRight: `2px solid ${MUTED}`,
                  color: GRAY,
                }}
                className="text-[0.62rem] uppercase tracking-wider font-bold p-1.5 text-left align-top"
              >
                Other ecosystem
              </th>
              {flatCols.map(({ group, col, isFirst }, i) => (
                <td
                  key={i}
                  style={{
                    background: SURFACE,
                    borderTop: `1px solid ${BORDER}`,
                    borderRight: `1px solid ${BORDER}`,
                    borderLeft: isFirst
                      ? `2px solid ${group.color}55`
                      : `1px solid ${BORDER}`,
                  }}
                  className="p-1.5 align-top"
                >
                  <div className="flex flex-wrap gap-0.5">
                    {col.other.vendors.map((v) => (
                      <MarketPill key={v} text={v} tone="other" />
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs">
        <div className="flex items-center gap-1.5" style={{ color: GRAY }}>
          <span style={{ background: BLUE + "22", color: BLUE, border: `1px solid ${BLUE}55` }} className="rounded px-1.5 py-px text-[0.6rem] font-bold">1P</span>
          Google product in cell
        </div>
        <div className="flex items-center gap-1.5" style={{ color: GRAY }}>
          <span style={{ color: RED, fontWeight: 700 }} className="text-[0.6rem] uppercase tracking-widest">GAP</span>
          No competitive Google product
        </div>
        <div style={{ color: MUTED }} className="ml-auto text-[0.65rem]">
          Reference: Sequoia / Harness $11B Developer Toolchain map · Vendor census: Gemini Deep Research Max (2026-05-06) + Market Landscape Map for AI DevKit (Google Doc, 2026-05-10)
        </div>
      </div>
      <p style={{ color: MUTED }} className="text-xs mt-2">
        <strong style={{ color: INK }}>Strategic read:</strong>{" "}
        Google leads at the foundation (Chrome APIs, Gemini Nano, WebGPU) and at backend agent orchestration (ADK 2.0, Genkit, Vertex Agent Engine).
        Three explicit <span style={{ color: RED }}>gaps</span>:{" "}
        <strong style={{ color: RED }}>Frontend AI UI</strong> (Vercel AI SDK dominates the TS/React layer),{" "}
        <strong style={{ color: RED }}>Vibe Coding</strong> (no 1P answer to v0 / Replit / Bolt / Lovable), and{" "}
        <strong style={{ color: RED }}>Headless Infra + Observability</strong> (Browserbase, Langfuse, Braintrust monopolize agentic deployment).
        The DevKit is positioned to close the observability gap natively; the other two are addressable via Pitch 1 (Partner Network — Vercel and Lovable as Strategic-tier launch partners).
      </p>
    </Wrap>
  );
}

// ─── Slide 2.5: Two Edge AI Worlds (AICore + DevKit) ─────────────────────────

function TwoWorlds() {
  return (
    <Wrap>
      <Title>
        Two edge AI worlds. Both belong to Google.
        <br />
        <span style={{ color: GRAY }} className="text-2xl font-normal">
          Android 16&apos;s AICore solved general AI. Custom AI is unsolved.
        </span>
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
        <Card accent={GREEN} className="flex flex-col">
          <div style={{ color: GREEN }} className="text-xs font-bold uppercase tracking-widest mb-3">
            World 1 · General AI · Solved
          </div>
          <div style={{ color: INK }} className="text-2xl font-bold mb-2">
            AICore + Gemini Nano
          </div>
          <div style={{ color: GRAY }} className="text-sm mb-4 flex-1">
            Android 16 ships AICore as a system service: one OS-managed model
            shared across apps via IPC, ~940 tok/s on Pixel NPU, automatic
            thermal/battery management.<Cite ids={[14, 15]} /> Apps stop bundling
            2GB models in their APKs and just call the OS.
          </div>
          <div style={{ color: MUTED }} className="text-xs">
            Powers: Pixel Camera Coach, Magic Cue, Recorder Summarize<Cite ids={[14]} />
          </div>
        </Card>

        <Card accent={BLUE} className="flex flex-col">
          <div style={{ color: BLUE }} className="text-xs font-bold uppercase tracking-widest mb-3">
            World 2 · Custom AI · Unsolved
          </div>
          <div style={{ color: INK }} className="text-2xl font-bold mb-2">
            Domain models that AICore won&apos;t serve
          </div>
          <div style={{ color: GRAY }} className="text-sm mb-4 flex-1">
            Proprietary computer vision (manufacturing, medical imaging,
            agriculture). Custom-trained LLMs on enterprise corpora. Verticalized
            voice + multimodal apps. Anything where Gemini Nano is too generic
            or the data can&apos;t leave the device. <strong>This is the DevKit&apos;s
            target market</strong> — not a replacement for AICore, the answer
            for everything AICore can&apos;t solve.
          </div>
          <div style={{ color: MUTED }} className="text-xs">
            Stack: PyTorch / JAX / TF → litert convert → Android NPU / iOS Core ML
          </div>
        </Card>
      </div>
      <p style={{ color: MUTED }} className="text-sm mt-4">
        ExecuTorch competes for World 2. AICore owns World 1. Google needs to win both —
        the DevKit is the only piece missing.
      </p>
    </Wrap>
  );
}

// ─── Slide 3: Three Plays ─────────────────────────────────────────────────────

function ThreePlays() {
  return (
    <Wrap>
      <Title>Three plays. One initiative. One recommendation.</Title>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 items-stretch">
        <div
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
          }}
          className="p-6 rounded-xl flex flex-col"
        >
          <div
            style={{ color: BLUE }}
            className="text-xs font-bold uppercase tracking-widest mb-3"
          >
            Pitch 1 · 6 months
          </div>
          <div style={{ color: INK }} className="text-2xl font-bold mb-2">
            Partner Network
          </div>
          <div style={{ color: GRAY }} className="text-sm mb-4 flex-1">
            "Intel Inside for edge AI." Certification program across hardware,
            training platforms, deployment tools, and model hubs.
          </div>
          <div style={{ color: MUTED }} className="text-xs">
            4 partner classes · 3 tiers · Annual summit
          </div>
        </div>

        <div
          style={{
            background: BLUE + "08",
            border: `2px solid ${BLUE}`,
            boxShadow: `0 2px 8px ${BLUE}22`,
          }}
          className="p-6 rounded-xl flex flex-col relative"
        >
          <div
            style={{ background: BLUE }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap"
          >
            ⭐ RECOMMENDED
          </div>
          <div
            style={{ color: BLUE }}
            className="text-xs font-bold uppercase tracking-widest mb-3"
          >
            Pitch 2 · 6–9 months
          </div>
          <div style={{ color: INK }} className="text-2xl font-bold mb-2">
            DevKit CI/CD
          </div>
          <div style={{ color: GRAY }} className="text-sm mb-4 flex-1">
            "Docker push for edge AI." CLI + GitHub Actions + public benchmark
            dashboard. Fastest to independent impact. No cross-org dependencies.
          </div>
          <div style={{ color: BLUE }} className="text-xs font-mono">
            litert convert → validate → bench → push
          </div>
        </div>

        <div
          style={{
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
          }}
          className="p-6 rounded-xl flex flex-col"
        >
          <div
            style={{ color: GREEN }}
            className="text-xs font-bold uppercase tracking-widest mb-3"
          >
            Pitch 3 · 9–12 months
          </div>
          <div style={{ color: INK }} className="text-2xl font-bold mb-2">
            Vertex Bridge
          </div>
          <div style={{ color: GRAY }} className="text-sm mb-4 flex-1">
            "Fine-tune on Vertex. Deploy to nearly 4B Androids." Cloud-to-edge
            pipeline. Kaggle-first strategy. Requires GM support.
          </div>
          <div style={{ color: MUTED }} className="text-xs">
            Vertex → Kaggle → Firebase ML → Android
          </div>
        </div>
      </div>
    </Wrap>
  );
}

// ─── Slide 4: Pitch 2 — DevKit ───────────────────────────────────────────────

function Devkit() {
  return (
    <Wrap>
      <div className="flex items-center gap-3 mb-4">
        <span
          style={{ background: BLUE }}
          className="text-white text-xs font-bold px-3 py-1 rounded-full"
        >
          ⭐ PITCH 2 · RECOMMENDED
        </span>
        <span style={{ color: MUTED }} className="text-sm">
          LiteRT DevKit
        </span>
      </div>
      <Title>"Docker push for edge AI."</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
        <div className="flex flex-col gap-4">
          <div>
            <div
              style={{ color: MUTED }}
              className="text-xs uppercase tracking-widest mb-2 font-semibold"
            >
              The CLI — 4 commands replace 6 manual steps
            </div>
            <div
              style={{
                background: PAGE,
                border: `1px solid ${BORDER}`,
              }}
              className="rounded-xl p-4 font-mono text-sm space-y-1"
            >
              {[
                ["convert", "model.pt --quantize int8 --target web"],
                ["validate", "model.tflite --ref model.pt"],
                ["bench", "model.tflite --targets web,android,ios"],
                ["push", "model.tflite --hub litert-community"],
              ].map(([cmd, args]) => (
                <div key={cmd}>
                  <span style={{ color: GREEN }}>$</span>{" "}
                  <span style={{ color: INK }} className="font-bold">
                    litert {cmd}
                  </span>{" "}
                  <span style={{ color: GRAY }}>{args}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div
              style={{ color: MUTED }}
              className="text-xs uppercase tracking-widest mb-2 font-semibold flex items-center gap-2"
            >
              <span>GitHub Actions Suite</span>
              <span style={{ background: BLUE + "22", color: BLUE, border: `1px solid ${BLUE}55` }} className="px-1.5 py-0.5 rounded text-[0.6rem] font-bold tracking-wider">PROPOSED</span>
            </div>
            <div
              style={{ background: PAGE, border: `1px solid ${BORDER}` }}
              className="rounded-xl p-4 font-mono text-xs space-y-1"
            >
              {[
                "google-ai-edge/litert-convert-action@v1",
                "google-ai-edge/litert-bench-action@v1",
                "google-ai-edge/litert-gate-action@v1",
              ].map((a) => (
                <div key={a} style={{ color: GRAY }}>
                  - uses:{" "}
                  <span style={{ color: BLUE }} className="break-all">
                    {a}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ color: MUTED }} className="text-[0.65rem] mt-1">
              0 official LiteRT/TFLite Actions exist on GitHub Marketplace today.<Cite ids={[17]} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Card>
            <div
              style={{ color: BLUE }}
              className="text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-2"
            >
              <span>Proposed Launch Partners</span>
              <span style={{ background: BLUE + "22", color: BLUE, border: `1px solid ${BLUE}55` }} className="px-1.5 py-0.5 rounded text-[0.55rem] font-bold tracking-wider">TARGET LIST</span>
            </div>
            <div style={{ color: INK }} className="text-sm">
              Runtimes: LiteRT (.tflite) · LiteRT-LM (LLMs / RAG)<Cite ids={[1, 2]} />
              <br />
              CI/CD: Bitrise · CircleCI · Harness · GitHub Marketplace
              <br />
              Models: Hugging Face <code style={{ background: PAGE, border: `1px solid ${BORDER}` }} className="px-1 rounded text-xs">litert-community</code> · Ultralytics · Roboflow · Kaggle Models
              <br />
              Hardware: Qualcomm AI Engine Direct<Cite ids={[11, 12]} /> · MediaTek NeuroPilot<Cite ids={[13]} />
            </div>
          </Card>
          <Card accent={GREEN}>
            <div
              style={{ color: GREEN }}
              className="text-xs font-semibold uppercase tracking-widest mb-2"
            >
              Hardware Moat (live today)
            </div>
            <div style={{ color: INK }} className="text-sm">
              <strong>Snapdragon 8 Elite Gen 5:</strong> LiteRT × Qualcomm AI Engine Direct delivers up to <span style={{ color: BLUE }} className="font-bold">100× CPU</span> on canonical models (50+ models &lt;5ms NPU).<Cite ids={[11, 12]} />
              <br />
              <strong>MediaTek Dimensity 9400:</strong> LiteRT NeuroPilot Accelerator hits <span style={{ color: BLUE }} className="font-bold">12× CPU / 10× GPU</span> via direct compiler integration (AOT + JIT).<Cite ids={[13]} />
              <br />
              ExecuTorch can&apos;t replicate this — these are Google × silicon-vendor compiler integrations.
            </div>
          </Card>
          <Card className="flex-1">
            <div
              style={{ color: GREEN }}
              className="text-xs font-semibold uppercase tracking-widest mb-3"
            >
              Year-1 Deliverables
            </div>
            <ul className="space-y-2">
              {[
                "litert CLI v1.0 — covers .tflite + LiteRT-LM",
                "Actions on GitHub Marketplace + Bitrise Steps + CircleCI Orbs",
                "Templates: on-device RAG · Translation · Camera+LLM (on Gemma 4 E2B/E4B)",
                "Official DevKit at LiteRT × Qualcomm hackathons (Sunnyvale, Apr 30 – May 1, 2026 confirmed)",
                "Benchmark dashboard: Qualcomm, MediaTek, ARM device profiles",
                "Talk at AI Engineer World's Fair or PyTorch Conf",
              ].map((d) => (
                <li
                  key={d}
                  style={{ color: GRAY }}
                  className="flex gap-2 text-sm"
                >
                  <span style={{ color: GREEN }} className="shrink-0">
                    ✓
                  </span>{" "}
                  {d}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </Wrap>
  );
}

// ─── Slide 5: Pitch 1 — Partner Network ──────────────────────────────────────

function PartnerNetwork() {
  const classes = [
    {
      name: "Hardware",
      examples: "Qualcomm AI Hub, MediaTek NeuroPilot, ARM Ethos",
      what: "NPU/GPU delegate validated on LiteRT vX.X",
      color: BLUE,
    },
    {
      name: "Training Platforms",
      examples: "Ultralytics, Roboflow, W&B, Edge Impulse",
      what: "One-click .tflite export from training UI",
      color: GREEN,
    },
    {
      name: "Deployment Tools",
      examples: "GitHub Actions, Harness, Bitrise, CircleCI",
      what: "Native LiteRT pipeline stage or action",
      color: RED,
    },
    {
      name: "Model Hubs",
      examples: "HF litert-community, Kaggle Models, Roboflow Universe, Ultralytics HUB",
      what: "Verified .tflite / LiteRT-LM model cards with benchmark data",
      color: YELLOW,
    },
  ];
  return (
    <Wrap>
      <div className="flex items-center gap-3 mb-4">
        <Badge color={BLUE}>Pitch 1</Badge>
        <span style={{ color: MUTED }} className="text-sm">
          Certified Partner Network
        </span>
      </div>
      <Title>"Intel Inside for edge AI."</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 content-start">
        {classes.map((c) => (
          <Card key={c.name} accent={c.color}>
            <div
              style={{ color: c.color }}
              className="text-xs font-bold uppercase tracking-widest mb-1"
            >
              {c.name}
            </div>
            <div style={{ color: INK }} className="font-semibold mb-1">
              {c.what}
            </div>
            <div style={{ color: GRAY }} className="text-sm">
              {c.examples}
            </div>
          </Card>
        ))}
      </div>
      <div className="flex flex-wrap gap-6 mt-4 text-sm">
        <div style={{ color: GRAY }}>
          <span style={{ color: INK }} className="font-semibold">
            3 tiers:
          </span>{" "}
          Community → Certified → Strategic
        </div>
        <div style={{ color: GRAY }}>
          <span style={{ color: INK }} className="font-semibold">
            Year 1 target:
          </span>{" "}
          8 launch partners (none yet committed), public portal at ai.google.dev/edge/partners,
          annual summit
        </div>
      </div>
      <p style={{ color: MUTED }} className="text-xs mt-2">
        Adjacent gen-AI partners (Unsloth, ElevenLabs) are scoped for the
        Training-Platforms tier in a v2 expansion — not in v1 because the
        certification suite is built around `.tflite` / LiteRT-LM compatibility,
        which neither currently exports natively.
      </p>
    </Wrap>
  );
}

// ─── Slide 6: Pitch 3 — Vertex Bridge ────────────────────────────────────────

function VertexBridge() {
  return (
    <Wrap>
      <div className="flex items-center gap-3 mb-4">
        <Badge color={GREEN}>Pitch 3</Badge>
        <span style={{ color: MUTED }} className="text-sm">
          LiteRT × Vertex AI Bridge
        </span>
      </div>
      <Title>
        "Fine-tune on Vertex. Deploy to nearly 4B Android devices.
        <br />
        One workflow."
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
        <div className="flex flex-col gap-4">
          <div>
            <div
              style={{ color: MUTED }}
              className="text-xs uppercase tracking-widest mb-2 font-semibold"
            >
              Today: Fragmented.
            </div>
            <div
              style={{
                background: RED + "06",
                border: `1px solid ${RED}25`,
                borderLeft: `4px solid ${RED}`,
              }}
              className="rounded-xl p-4 font-mono text-sm"
            >
              <div style={{ color: GRAY }}>
                Vertex AI (custom training){" "}
                <span style={{ color: RED }}>→ no documented path</span>{" "}
                → Android
              </div>
              <div style={{ color: MUTED }} className="mt-2 text-xs">
                AutoML export to TFLite exists. Custom model path:
                undocumented, multi-step, unsupported.
              </div>
              <div style={{ color: MUTED }} className="mt-1 text-xs">
                Apple Core ML: train → export → ship. Google: no equivalent
                for custom models.
              </div>
            </div>
          </div>
          <div>
            <div
              style={{ color: MUTED }}
              className="text-xs uppercase tracking-widest mb-2 font-semibold"
            >
              Target: One API call
            </div>
            <div
              style={{ background: PAGE, border: `1px solid ${BORDER}` }}
              className="rounded-xl p-4 font-mono text-sm"
            >
              <div style={{ color: GRAY }}>model.export(</div>
              <div className="pl-4">
                <span style={{ color: INK }}>format</span>=
                <span style={{ color: GREEN }}>'litert'</span>,
              </div>
              <div className="pl-4">
                <span style={{ color: INK }}>quantization</span>=
                <span style={{ color: GREEN }}>'int8'</span>,
              </div>
              <div className="pl-4">
                <span style={{ color: INK }}>validate</span>=
                <span style={{ color: BLUE }}>True</span>
              </div>
              <div style={{ color: GRAY }}>)</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Card accent={GREEN}>
            <div
              style={{ color: GREEN }}
              className="text-xs font-semibold uppercase tracking-widest mb-2"
            >
              Kaggle-First Strategy
            </div>
            <div style={{ color: GRAY }} className="text-sm">
              Start with Google's own Kaggle Models — "Deploy to LiteRT" button
              with zero cross-org politics. Use adoption data as the credential
              before approaching Vertex AI PM.
            </div>
          </Card>
          <Card accent={BLUE}>
            <div
              style={{ color: BLUE }}
              className="text-xs font-semibold uppercase tracking-widest mb-2"
            >
              4 Integration Points
            </div>
            <ul className="space-y-1">
              {[
                "Vertex Model Garden → Deploy to LiteRT button",
                "Vertex training job .export(format='litert') API",
                "Firebase ML on-device deepening",
                "LiteRT as the canonical Android ML runtime (vs. ML Kit fragmentation)",
              ].map((i) => (
                <li key={i} style={{ color: GRAY }} className="flex gap-2 text-sm">
                  <span style={{ color: GREEN }} className="shrink-0">
                    →
                  </span>{" "}
                  {i}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <div
              style={{ color: MUTED }}
              className="text-xs uppercase tracking-widest mb-1 font-semibold"
            >
              Prerequisite
            </div>
            <div style={{ color: GRAY }} className="text-sm">
              Requires GM support day 1. 4 teams: Vertex AI, Firebase, Android,
              LiteRT.
            </div>
          </Card>
          <Card accent={YELLOW}>
            <div
              style={{ color: YELLOW }}
              className="text-xs font-semibold uppercase tracking-widest mb-2"
            >
              Fallback if Firebase declines
            </div>
            <div style={{ color: GRAY }} className="text-sm">
              Firebase pivoted to cloud Gemini APIs in 2025; on-device TFLite
              hosting may not get prioritized. Plan B keeps the bridge alive:
              <span style={{ color: INK }} className="font-semibold"> GCS + Cloud CDN</span> as
              the artifact store + an open-source Android lib (Play Core / WorkManager)
              for authenticated background fetch. Or expose <span style={{ color: INK }} className="font-semibold">Vertex Model
              Registry as a signed REST endpoint</span> mobile clients hit directly. Either
              path bypasses Firebase without losing OTA updates or version control.
            </div>
          </Card>
        </div>
      </div>
    </Wrap>
  );
}

// ─── Slide 7: Why This Team ──────────────────────────────────────────────────

function WhyThisTeam() {
  return (
    <Wrap>
      <Title>
        The gap is a DevOps problem in new clothes.
        <br />
        <span style={{ color: GRAY }} className="text-2xl font-normal">
          The LiteRT team needs partnerships leadership with a CI/CD background.
        </span>
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <Card accent={BLUE} className="flex flex-col">
          <div
            style={{ color: BLUE }}
            className="text-sm font-bold uppercase tracking-widest mb-4"
          >
            What This Role Requires
          </div>
          <ul className="space-y-4 flex-1">
            {[
              {
                text: "CI/CD platform partnership experience",
                sub: "Must speak DevOps buyer language to credibly co-announce with Bitrise, CircleCI, and Harness.",
              },
              {
                text: "Observability platform partnership experience",
                sub: "Understands what makes developer tooling go viral — from the partner side.",
              },
              {
                text: "T1 ISV partnership programs, designed and executed",
                sub: "Not observing. Running. Direct program design and partner management at this tier.",
              },
              {
                text: "Google Cloud credibility",
                sub: "Credible cross-org bridge to Vertex AI and Firebase teams. A pure LiteRT PM can't do this.",
              },
            ].map((item) => (
              <li key={item.text} className="flex gap-3">
                <span
                  style={{ color: GREEN }}
                  className="mt-0.5 text-lg shrink-0"
                >
                  ✓
                </span>
                <div>
                  <div style={{ color: INK }} className="font-semibold text-sm">
                    {item.text}
                  </div>
                  <div style={{ color: GRAY }} className="text-sm">
                    {item.sub}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <Card accent={RED} className="flex flex-col">
          <div
            style={{ color: RED }}
            className="text-sm font-bold uppercase tracking-widest mb-4"
          >
            Why Engineering Alone Can't Do This
          </div>
          <ul className="space-y-3 flex-1">
            {[
              "Can't walk into Bitrise, CircleCI, or Harness and speak CI/CD buyer language",
              "No T1 ISV partnership design or execution background",
              "No Google Cloud credibility for cross-org Vertex/Firebase work",
              "No ecosystem relationships in DevOps or MLOps conference circuit",
            ].map((item) => (
              <li key={item} style={{ color: GRAY }} className="flex gap-3 text-sm">
                <span style={{ color: RED }} className="mt-0.5 shrink-0">
                  ✗
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div
            style={{
              background: BLUE + "0d",
              border: `1px solid ${BLUE}25`,
            }}
            className="mt-4 p-4 rounded-xl"
          >
            <div style={{ color: INK }} className="text-sm font-semibold mb-1">
              The bet
            </div>
            <div style={{ color: GRAY }} className="text-sm">
              Partnerships background is the moat: Bitrise, CircleCI, Harness, Qualcomm, and Ultralytics all say yes faster to a peer than to a product team cold outreach.
            </div>
          </div>
        </Card>
      </div>
    </Wrap>
  );
}

// ─── Slide 8: The Ask ─────────────────────────────────────────────────────────

function TheAsk() {
  return (
    <Wrap>
      <Title>What you're approving.</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
        <div className="flex flex-col gap-3">
          <div
            style={{ color: BLUE }}
            className="text-sm font-bold uppercase tracking-widest"
          >
            6-Month Rotation · Starting with Pitch 2
          </div>
          {[
            {
              label: "Role",
              val: "PM/TPM bridge — DevRel + Partner Engineering coordination lead",
            },
            {
              label: "Scope",
              val: "Pitch 2 (DevKit) primary. Pitch 1 (Partner Network) parallel ecosystem motion.",
            },
            {
              label: "Pitch 3 timing",
              val: "Bring Pitch 3 to the team at month 3, after Pitch 2 traction data exists.",
            },
            {
              label: "Reporting",
              val: "Rotation into LiteRT team, dotted line to Google Cloud partnerships.",
            },
          ].map((item) => (
            <Card key={item.label}>
              <div
                style={{ color: MUTED }}
                className="text-xs uppercase tracking-widest font-semibold"
              >
                {item.label}
              </div>
              <div style={{ color: INK }} className="text-sm mt-1">
                {item.val}
              </div>
            </Card>
          ))}
        </div>
        <div className="flex flex-col">
          <div
            style={{ color: GREEN }}
            className="text-sm font-bold uppercase tracking-widest mb-3"
          >
            Deliverables at 6 Months
          </div>
          <ul className="space-y-2 flex-1">
            {[
              "litert CLI v1.0 open-sourced (google-ai-edge/litert-devkit)",
              "LiteRT + LiteRT-LM both supported via `litert convert --format`",
              "Actions on GitHub Marketplace + Bitrise Steps + CircleCI Orbs",
              "Templates: RAG · Translation · Camera+LLM — built on Gemma 4 E2B/E4B",
              "Hardware moat surfaced: Qualcomm AI Engine Direct (100× CPU) + MediaTek NeuroPilot (12× CPU) benchmark profiles",
              "Official DevKit at Google × Qualcomm LiteRT hackathon (Sunnyvale, Apr 30 – May 1, 2026 confirmed)",
              "3+ co-announcement partners (target: Harness, Roboflow, Ultralytics)",
              "Talk accepted at AI Engineer World's Fair or PyTorch Conference",
            ].map((d) => (
              <li
                key={d}
                style={{
                  color: GRAY,
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
                className="flex gap-3 text-sm p-3 rounded-xl"
              >
                <span style={{ color: GREEN }} className="shrink-0">
                  ✓
                </span>{" "}
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Wrap>
  );
}

// ─── Slide 9: Deep Dives ──────────────────────────────────────────────────────

function DeepDives() {
  const links = [
    {
      title: "Pitch 2 — LiteRT DevKit CI/CD",
      sub: "CLI specs, GitHub Actions YAML, Harness partnership design, 7-month execution plan",
      href: "/runbook/pitch-devkit.html",
      color: BLUE,
    },
    {
      title: "Pitch 1 — Certified Partner Network",
      sub: "Hardware cert test suite, portal wireframe, summit agenda, 6-month execution plan",
      href: "/runbook/program-charter-v1.html",
      color: BLUE,
    },
    {
      title: "Pitch 3 — LiteRT × Vertex AI Bridge",
      sub: "Kaggle-first strategy, Python SDK spec, 4 integration point designs, 10-month plan",
      href: "/runbook/pitch-vertex-bridge.html",
      color: GREEN,
    },
    {
      title: "Business Case",
      sub: "ROI math, competitive table, weighted decision matrix, 9-KR OKR matrix",
      href: "/runbook/business-case.html",
      color: YELLOW,
    },
    {
      title: "Stakeholder RACI",
      sub: "All stakeholders across 3 pitches, approval paths, and partner contacts",
      href: "/runbook/stakeholder-raci.html",
      color: RED,
    },
  ];
  return (
    <Wrap>
      <Title>Full runbooks for each pitch.</Title>
      <div className="flex flex-col gap-2.5 flex-1 justify-center">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
            className="flex items-center gap-4 p-4 rounded-xl hover:shadow-md transition-shadow group"
          >
            <div
              style={{ background: l.color + "15", color: l.color }}
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-base font-bold"
            >
              →
            </div>
            <div>
              <div
                style={{ color: INK }}
                className="font-semibold group-hover:underline"
              >
                {l.title}
              </div>
              <div style={{ color: GRAY }} className="text-sm">
                {l.sub}
              </div>
            </div>
          </a>
        ))}
      </div>
      <div style={{ color: MUTED }} className="text-xs mt-3">
        Google Cloud Partnerships × LiteRT Team · May 2026
      </div>
    </Wrap>
  );
}

// ─── Slide 10: Sources ───────────────────────────────────────────────────────

function Sources() {
  return (
    <Wrap>
      <Title>
        Sources.
        <br />
        <span style={{ color: GRAY }} className="text-2xl font-normal">
          Every factual claim verified against current public sources, May 2026.
        </span>
      </Title>
      <div className="flex-1 overflow-y-auto pr-2">
        <ol className="space-y-1.5">
          {SOURCES.map((s, i) => (
            <li
              key={i}
              style={{ color: GRAY }}
              className="text-sm flex gap-3"
            >
              <span style={{ color: BLUE }} className="font-bold tabular-nums shrink-0 w-6">{i + 1}.</span>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: INK }}
                className="hover:underline"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
      <p style={{ color: MUTED }} className="text-xs mt-3">
        Verified via Gemini Deep Research Max · 2026-05-06 · Cross-referenced against official vendor blogs, GitHub releases, and conference websites.
      </p>
    </Wrap>
  );
}

// ─── Slide registry ───────────────────────────────────────────────────────────

const SLIDES = [
  <Cover />,
  <Problem />,
  <Stakes />,
  <MarketMap />,
  <TwoWorlds />,
  <ThreePlays />,
  <Devkit />,
  <PartnerNetwork />,
  <VertexBridge />,
  <WhyThisTeam />,
  <TheAsk />,
  <DeepDives />,
  <Sources />,
];

// ─── Deck shell ───────────────────────────────────────────────────────────────

export function Component() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= SLIDES.length || next === idx) return;
      setVisible(false);
      setTimeout(() => {
        setIdx(next);
        setVisible(true);
      }, 120);
    },
    [idx]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
        goTo(idx + 1);
      }
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        goTo(idx - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goTo, idx]);

  return (
    <div
      style={{ fontFamily: "'Nunito', system-ui, sans-serif", background: PAGE }}
      className="fixed inset-0 overflow-hidden select-none"
    >
      {/* Google-color top bar — 3px, prominent */}
      <div className="absolute top-0 left-0 right-0 flex" style={{ height: 3 }}>
        <div style={{ background: BLUE, flex: 4 }} />
        <div style={{ background: RED, flex: 2 }} />
        <div style={{ background: YELLOW, flex: 1 }} />
        <div style={{ background: GREEN, flex: 2 }} />
      </div>

      {/* Top-left label */}
      <div className="absolute top-4 left-6 flex items-center gap-2 z-10">
        <div className="flex gap-1">
          {[BLUE, RED, YELLOW, GREEN].map((c) => (
            <span
              key={c}
              style={{ background: c }}
              className="w-1.5 h-1.5 rounded-full"
            />
          ))}
        </div>
        <span style={{ color: MUTED }} className="text-xs font-bold uppercase tracking-widest">
          LiteRT Rotation
        </span>
      </div>

      {/* Slide counter */}
      <div
        style={{ color: MUTED }}
        className="absolute top-4 right-6 text-xs tabular-nums font-mono z-10"
      >
        {idx + 1} / {SLIDES.length}
      </div>

      {/* Slide content */}
      <div
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.12s ease" }}
        className="absolute inset-0"
      >
        {SLIDES[idx]}
      </div>

      {/* Prev arrow */}
      <button
        onClick={() => goTo(idx - 1)}
        disabled={idx === 0}
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          color: GRAY,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-0 z-10 cursor-pointer hover:shadow-md"
        aria-label="Previous slide"
      >
        ←
      </button>

      {/* Next arrow */}
      <button
        onClick={() => goTo(idx + 1)}
        disabled={idx === SLIDES.length - 1}
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          color: GRAY,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-0 z-10 cursor-pointer hover:shadow-md"
        aria-label="Next slide"
      >
        →
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              background: i === idx ? BLUE : BORDER,
              width: i === idx ? 24 : 8,
              height: 8,
              borderRadius: 4,
              transition: "all 0.25s ease",
              cursor: "pointer",
              border: "none",
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
