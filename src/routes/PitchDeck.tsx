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

// Typography stacks
const FONT_BODY = "'Inter', system-ui, -apple-system, sans-serif";
const FONT_HEAD = "'Space Grotesk', 'Inter', system-ui, sans-serif";

// ─── Per-slide metadata (built after SLIDES is defined below) ────────────────

type SlideMeta = { title: string; section: string; note: string };
// Filled in via SLIDE_META constant at the bottom of the file (after SLIDES).

// ─── Citation registry ───────────────────────────────────────────────────────
// Sources are verified May 2026 via Gemini Deep Research Max. URLs are Gemini's
// grounding redirects; they resolve to the labeled domain.

type Source = { label: string; url: string };
const SOURCES: Source[] = [
  { label: "Google Developers Blog — TensorFlow Lite is now LiteRT", url: "https://developers.googleblog.com/en/tensorflow-lite-is-now-litert/" },
  { label: "Google AI Edge — LiteRT-LM and Gemma support", url: "https://ai.google.dev/edge/litert" },
  { label: "Meta / PyTorch — ExecuTorch releases (v1.2.0)", url: "https://github.com/pytorch/executorch/releases" },
  { label: "PyTorch Foundation — ExecuTorch joins as Core project", url: "https://pytorch.org/blog/" },
  { label: "Linux Foundation — vendor-neutral governance for ExecuTorch", url: "https://www.linuxfoundation.org/" },
  { label: "AI Engineer World's Fair 2026 — June 30 – July 2, San Francisco", url: "https://www.ai.engineer/" },
  { label: "Moscone Center — World's Fair venue confirmation", url: "https://www.moscone.com/" },
  { label: "AWS — SageMaker Edge Manager end-of-life (April 2024)", url: "https://docs.aws.amazon.com/sagemaker/latest/dg/edge-eol.html" },
  { label: "Hugging Face — Transformers.js v4 with C++ WebGPU (Feb 2026)", url: "https://huggingface.co/blog" },
  { label: "Hugging Face — litert-community organization", url: "https://huggingface.co/litert-community" },
  { label: "Qualcomm — AI Engine Direct SDK (replaces SNPE)", url: "https://www.qualcomm.com/developer/software/qualcomm-ai-engine-direct-sdk" },
  { label: "Google Developers Blog — Unlocking Peak Performance on Qualcomm NPU with LiteRT", url: "https://developers.googleblog.com/en/unlocking-peak-performance-on-qualcomm-npu-with-litert/" },
  { label: "Google Developers Blog — MediaTek NPU and LiteRT: Powering the Next Generation of On-Device AI", url: "https://developers.googleblog.com/en/mediatek-npu-and-litert-powering-the-next-generation-of-on-device-ai/" },
  { label: "Android Developers — Gemini Nano (formerly AICore)", url: "https://developer.android.com/ai/gemini-nano" },
  { label: "Google DeepMind — Gemma models (E2B / E4B edge variants)", url: "https://deepmind.google/models/gemma/" },
  { label: "ARM — Ethos-U85 microNPU specifications", url: "https://www.arm.com/products/silicon-ip-cpu/ethos/ethos-u85" },
  { label: "GitHub Marketplace — current LiteRT / TFLite Actions inventory", url: "https://github.com/marketplace?type=actions&query=tflite" },
  { label: "Edge Impulse — build-deploy GitHub Action (MCU exception)", url: "https://github.com/edgeimpulse/build-deploy" },
  { label: "Apple — Core ML Tools and on-device deployment", url: "https://developer.apple.com/documentation/coreml" },
  { label: "Hacker News — \"google really neglected it in the last 3 years or so\" (pzo, comment on LiteRT thread)", url: "https://news.ycombinator.com/item?id=44155827" },
  { label: "Towards Data Science — \"My Journey in Converting PyTorch to TensorFlow Lite\" (Ran Rubin, Sept 2020)", url: "https://towardsdatascience.com/my-journey-in-converting-pytorch-to-tensorflow-lite-d244376beed/" },
  { label: "GitHub issue tensorflow/tensorflow#53682 — NNAPI delegate fails to fall back to CPU (MoveNet on Android 11)", url: "https://github.com/tensorflow/tensorflow/issues/53682" },
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
    <div className="absolute inset-0 flex flex-col px-12 md:px-24 pt-16 pb-16 overflow-hidden">
      {children}
    </div>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        color: INK,
        fontFamily: FONT_HEAD,
        letterSpacing: "-0.02em",
      }}
      className="text-4xl md:text-[2.75rem] font-bold mb-8 leading-[1.1]"
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
        borderLeft: accent ? `3px solid ${accent}` : `1px solid ${BORDER}`,
        boxShadow:
          "0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.04)",
      }}
      className={`rounded-2xl p-5 ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Slide 0: Cover ──────────────────────────────────────────────────────────

function Cover() {
  return (
    <div
      style={{
        background:
          "radial-gradient(ellipse at top, #f0f6ff 0%, #ffffff 45%, #ffffff 100%)",
      }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
    >
      <div className="flex gap-1.5 mb-14">
        {[
          { w: 64, c: BLUE },
          { w: 32, c: RED },
          { w: 16, c: YELLOW },
          { w: 32, c: GREEN },
        ].map((s) => (
          <div
            key={s.c}
            style={{ width: s.w, height: 5, background: s.c, borderRadius: 3 }}
          />
        ))}
      </div>
      <h1
        style={{
          color: INK,
          fontFamily: FONT_HEAD,
          letterSpacing: "-0.035em",
        }}
        className="text-6xl md:text-[5.5rem] font-bold mb-8 leading-[1.02] max-w-5xl"
      >
        The deployment layer
        <br />
        for on-device AI
        <br />
        <span style={{ color: BLUE }}>is missing.</span>
      </h1>
      <p
        style={{ color: GRAY, fontFamily: FONT_BODY, letterSpacing: "-0.005em" }}
        className="text-xl md:text-2xl mb-4 font-normal max-w-3xl"
      >
        LiteRT Rotation — Three Plays to Own the Edge AI Stack
      </p>
      <p
        style={{ color: MUTED, fontFamily: FONT_BODY }}
        className="text-xs mt-6 uppercase tracking-[0.18em] font-semibold"
      >
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
        Nine great Google products. Zero coherent workflow.
        <br />
        <span style={{ color: GRAY }} className="text-2xl font-normal">
          Deploying a custom edge model still takes 6 manual steps across disconnected tools — no unified CI/CD pipeline ties the 1P stack together.<Cite ids={[17, 18]} />
        </span>
      </Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 content-start stagger-enter">
        {steps.map((s) => (
          <div
            key={s.n}
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              boxShadow:
                "0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.04)",
            }}
            className="flex gap-4 p-4 rounded-2xl"
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
      <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${BORDER}` }}>
        <div className="flex items-baseline gap-3 mb-2">
          <span style={{ color: INK }} className="text-[11px] font-bold uppercase tracking-[0.12em]">
            What devs are saying
          </span>
          <span style={{ color: MUTED }} className="text-[10px]">
            Verbatim · public sources
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <blockquote
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderLeft: `3px solid ${RED}`,
            }}
            className="p-2.5 rounded-lg text-xs leading-snug"
          >
            <span style={{ color: INK }} className="italic">
              &ldquo;I haven&rsquo;t seen any SOTA model officially released having official port to tensorflow lite / liteRT for a long time&hellip;&rdquo;
            </span>
            <div style={{ color: MUTED }} className="mt-1.5 text-[10px] not-italic">
              — pzo · Hacker News<Cite ids={[20]} />
            </div>
          </blockquote>
          <blockquote
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderLeft: `3px solid ${RED}`,
            }}
            className="p-2.5 rounded-lg text-xs leading-snug"
          >
            <span style={{ color: INK }} className="italic">
              &ldquo;I found myself collecting pieces of information from Stackoverflow posts and GitHub issues.&rdquo;
            </span>
            <div style={{ color: MUTED }} className="mt-1.5 text-[10px] not-italic">
              — Ran Rubin · &ldquo;My Journey in Converting PyTorch to TensorFlow Lite&rdquo;<Cite ids={[21]} />
            </div>
          </blockquote>
          <blockquote
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderLeft: `3px solid ${RED}`,
            }}
            className="p-2.5 rounded-lg text-xs leading-snug"
          >
            <span style={{ color: INK }} className="italic">
              &ldquo;Even if the model is not supported by NNAPI delegate, it should fallback on CPU which is not happening.&rdquo;
            </span>
            <div style={{ color: MUTED }} className="mt-1.5 text-[10px] not-italic">
              — GitHub issue #53682 · MoveNet on Android 11<Cite ids={[22]} />
            </div>
          </blockquote>
        </div>
      </div>
      <p style={{ color: MUTED }} className="text-xs mt-3">
        ExecuTorch offers near-single-command export for PyTorch-native models
        with a public benchmark dashboard.<Cite ids={[3]} /> LiteRT has no equivalent packaged
        workflow. Edge Impulse covers the MCU/embedded slice via{" "}
        <code style={{ background: PAGE, border: `1px solid ${BORDER}` }} className="px-1 rounded font-mono text-[10px]">edgeimpulse/build-deploy</code>;<Cite ids={[18]} />{" "}
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
      <div className="flex flex-col gap-4 flex-1 justify-center stagger-enter">
        <Card accent={RED}>
          <div
            style={{ color: RED }}
            className="text-xs font-bold uppercase tracking-widest mb-2 inline-flex items-center gap-2"
          >
            <InlineIcon slug="pytorch" color="ea4335" size={14} />
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
            className="text-xs font-bold uppercase tracking-widest mb-2 inline-flex items-center gap-2"
          >
            <InlineIcon slug="onnx" color="1a73e8" size={14} />
            ONNX Runtime Web · v1.25.0 surge (April 2026)
          </div>
          <div style={{ color: INK }} className="text-lg font-bold mb-1">
            ~300K weekly npm downloads. Transformers.js v4 rewrote on top of it in C++ WebGPU.<Cite ids={[9]} />
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

// ─── Section divider component ───────────────────────────────────────────────

function SectionDivider({
  part,
  title,
  subtitle,
  accent,
}: {
  part: string;
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div
      style={{
        background:
          "radial-gradient(ellipse at center, " +
          accent +
          "11 0%, transparent 60%), " +
          SURFACE,
      }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-12"
    >
      <div
        style={{ background: accent, height: 3, width: 64, borderRadius: 2 }}
        className="mb-10"
      />
      <p
        style={{
          color: accent,
          fontFamily: FONT_HEAD,
          letterSpacing: "0.32em",
        }}
        className="text-sm font-bold uppercase mb-8"
      >
        {part}
      </p>
      <h2
        style={{
          color: INK,
          fontFamily: FONT_HEAD,
          letterSpacing: "-0.035em",
        }}
        className="text-6xl md:text-[5rem] font-bold mb-8 leading-[1.02] max-w-5xl"
      >
        {title}
      </h2>
      <p
        style={{ color: GRAY, fontFamily: FONT_BODY }}
        className="text-xl md:text-2xl max-w-3xl font-light leading-snug"
      >
        {subtitle}
      </p>
    </div>
  );
}

function PartTwoDivider() {
  return (
    <SectionDivider
      part="Part II"
      title="The plays."
      subtitle="One initiative. Three pitches. One recommendation that ships in six months."
      accent={BLUE}
    />
  );
}

function PartThreeDivider() {
  return (
    <SectionDivider
      part="Part III"
      title="The proposal."
      subtitle="Why this team, why this person, what gets approved today."
      accent={GREEN}
    />
  );
}

// ─── Hero-number slide — the 100× hardware moat ──────────────────────────────

function HardwareMoatHero() {
  return (
    <div
      style={{
        background:
          "radial-gradient(ellipse at center, " +
          BLUE +
          "0d 0%, transparent 65%), " +
          SURFACE,
      }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-12"
    >
      <p
        style={{
          color: BLUE,
          fontFamily: FONT_HEAD,
          letterSpacing: "0.32em",
        }}
        className="text-xs font-bold uppercase mb-8"
      >
        The hardware moat · live today
      </p>
      <div className="flex items-baseline gap-2 mb-2">
        <span
          style={{
            color: INK,
            fontFamily: FONT_HEAD,
            letterSpacing: "-0.055em",
            lineHeight: 0.85,
            fontWeight: 700,
          }}
          className="text-[12rem] md:text-[18rem]"
        >
          100
        </span>
        <span
          style={{
            color: BLUE,
            fontFamily: FONT_HEAD,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            fontWeight: 700,
          }}
          className="text-[6rem] md:text-[9rem]"
        >
          ×
        </span>
      </div>
      <p
        style={{ color: INK, fontFamily: FONT_HEAD, letterSpacing: "-0.02em" }}
        className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
      >
        CPU on Snapdragon 8 Elite Gen 5.
      </p>
      <p
        style={{ color: GRAY, fontFamily: FONT_BODY }}
        className="text-lg md:text-xl max-w-3xl font-light leading-snug mb-6"
      >
        LiteRT × Qualcomm AI Engine Direct delivers 100× the speed of CPU
        execution. 50+ canonical models run in under 5&nbsp;ms on the NPU.
        MediaTek Dimensity 9400 hits 12× via the NeuroPilot Accelerator.
      </p>
      <div className="flex items-center gap-5 mb-4" style={{ color: GRAY }}>
        <span className="inline-flex items-center gap-2 text-sm">
          <InlineIcon slug="google" color="1a73e8" size={20} />
          <span className="font-semibold">Google</span>
        </span>
        <span style={{ color: MUTED }} className="text-base">×</span>
        <span className="inline-flex items-center gap-2 text-sm">
          <InlineIcon slug="qualcomm" color="3253dc" size={20} />
          <span className="font-semibold">Qualcomm</span>
        </span>
        <span style={{ color: MUTED }} className="text-base">×</span>
        <span className="inline-flex items-center gap-2 text-sm">
          <InlineIcon slug="mediatek" color="ee3a3a" size={20} />
          <span className="font-semibold">MediaTek</span>
        </span>
      </div>
      <p
        style={{ color: MUTED, fontFamily: FONT_BODY }}
        className="text-sm max-w-2xl"
      >
        ExecuTorch can&apos;t replicate this — these are Google × silicon-vendor
        compiler integrations no competitor has.<Cite ids={[11, 12, 13]} />
      </p>
    </div>
  );
}

// ─── Slide 2.3: The Numbers — three landscapes, three openings ──────────────

function TheNumbers() {
  const columns = [
    {
      title: "Web ML Runtimes",
      eyebrow: "Weekly npm downloads",
      hero: "0.06%",
      heroSub: "LiteRT.js share of ORT-Web",
      accent: RED,
      rows: [
        { label: "onnxruntime-web", value: "1.4M / wk", logo: "onnx" },
        { label: "@huggingface/transformers", value: "672K / wk", logo: "huggingface" },
        { label: "@mlc-ai/web-llm", value: "40K / wk", logo: null },
        { label: "@mediapipe/tasks-genai", value: "7.5K / wk", logo: "mediapipe" },
        { label: "@litertjs/core", value: "0.8K / wk", logo: "google", emphasis: true },
      ],
      diagnosis: "Not a tech gap — LiteRT v2.1.4 (Apr 2026) is the officially recommended Android runtime with industry-leading NPU support. The gap is awareness + ecosystem + operationalization.",
      pitchRef: "→ Pitch 1 (Partner Network)",
    },
    {
      title: "On-Device AI CI/CD",
      eyebrow: "GitHub Actions for LiteRT",
      hero: "0",
      heroSub: "Actions on Marketplace today",
      accent: GREEN,
      rows: [
        { label: "GH Marketplace · TFLite", value: "0", logo: "githubactions", emphasis: true },
        { label: "Harness", value: "no ML CI", logo: null },
        { label: "Edge Impulse", value: "MCU only", logo: "edgeimpulse" },
        { label: "ExecuTorch", value: "CLI + bench", logo: "pytorch" },
        { label: "MLflow / W&B", value: "train-side only", logo: null },
      ],
      diagnosis: "Total whitespace at the mobile / Android / iOS / web layer. Edge Impulse owns MCU; nothing covers the rest. First mover wins.",
      pitchRef: "→ Pitch 2 (DevKit) — Recommended",
    },
    {
      title: "Cloud-to-Edge",
      eyebrow: "Train → ship pipelines",
      hero: "3 → 1",
      heroSub: "Fragmented today → unified target",
      accent: YELLOW,
      rows: [
        { label: "AWS SageMaker Edge", value: "EOL Apr 2024", logo: null },
        { label: "Azure IoT + Azure ML", value: "not mobile-native", logo: null },
        { label: "Apple Core ML + Xcode", value: "best in class", logo: "apple", emphasis: true },
        { label: "Vertex AI → LiteRT", value: "no path", logo: "googlecloud" },
      ],
      diagnosis: "AWS exited the market. Apple is the gold standard for iOS. Google has 3 disconnected pipelines (Vertex, Firebase, LiteRT) and no documented custom-model path.",
      pitchRef: "→ Pitch 3 (Vertex Bridge)",
    },
  ];

  return (
    <Wrap>
      <h2
        style={{ color: INK, fontFamily: FONT_HEAD, letterSpacing: "-0.025em" }}
        className="text-4xl md:text-[2.75rem] font-bold leading-[1.05] mb-2"
      >
        The market we&apos;re sizing into.
      </h2>
      <p style={{ color: GRAY }} className="text-xl font-light mb-5 leading-snug">
        Three landscapes, three openings — every claim verified April 30, 2026.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 stagger-enter">
        {columns.map((col) => (
          <div
            key={col.title}
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderTop: `3px solid ${col.accent}`,
            }}
            className="rounded-2xl p-4 flex flex-col"
          >
            <div style={{ color: col.accent }} className="text-[10px] font-bold uppercase tracking-widest mb-1">
              {col.title}
            </div>
            <div style={{ color: MUTED }} className="text-[10px] uppercase tracking-wider mb-3">
              {col.eyebrow}
            </div>
            <div className="mb-4">
              <div
                style={{ color: INK, fontFamily: FONT_HEAD, letterSpacing: "-0.04em", lineHeight: 0.95 }}
                className="text-5xl font-bold"
              >
                {col.hero}
              </div>
              <div style={{ color: GRAY }} className="text-xs mt-1">
                {col.heroSub}
              </div>
            </div>
            <div className="space-y-1 mb-3 flex-1">
              {col.rows.map((row) => {
                const slug = row.logo;
                const isEmph = row.emphasis;
                return (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-2 text-[11px] py-0.5"
                    style={{
                      borderBottom: `1px solid ${BORDER}80`,
                      paddingBottom: 3,
                    }}
                  >
                    <span className="inline-flex items-center gap-1.5 min-w-0">
                      {slug ? (
                        <img
                          src={`https://cdn.simpleicons.org/${slug}/${isEmph ? col.accent.slice(1) : "5f6368"}`}
                          alt=""
                          width={10}
                          height={10}
                          loading="lazy"
                          className="shrink-0"
                        />
                      ) : (
                        <span style={{ width: 10 }} className="shrink-0" />
                      )}
                      <span
                        style={{ color: isEmph ? col.accent : INK, fontWeight: isEmph ? 700 : 500 }}
                        className="truncate"
                      >
                        {row.label}
                      </span>
                    </span>
                    <span
                      style={{ color: isEmph ? col.accent : GRAY, fontWeight: isEmph ? 700 : 400 }}
                      className="font-mono text-[10px] shrink-0"
                    >
                      {row.value}
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              style={{ background: col.accent + "0d", border: `1px solid ${col.accent}25`, color: INK }}
              className="rounded-lg p-2.5 text-[11px] leading-snug mb-2"
            >
              <span style={{ color: col.accent }} className="font-semibold">Diagnosis:</span>{" "}
              {col.diagnosis}
            </div>
            <div style={{ color: col.accent }} className="text-[11px] font-bold uppercase tracking-wider">
              {col.pitchRef}
            </div>
          </div>
        ))}
      </div>

      <p style={{ color: MUTED }} className="text-[10px] mt-3">
        Sources: npm registry stats (Apr 30, 2026), GitHub Marketplace search, ExecuTorch v1.2.0 release notes, vendor product docs.<Cite ids={[3, 8, 17, 18]} />
      </p>
    </Wrap>
  );
}

// ─── Slide 2.4: Market map — On-device AI lifecycle × Google 1P ──────────────

type MarketCell = { vendors: string[]; isGap?: boolean };
type MarketCol = { col: string; sub: string; google: MarketCell; other: MarketCell };
type MarketGroup = { header: string; color: string; cols: MarketCol[] };

// Vendor census scoped to the on-device AI lifecycle owned by the Google AI Edge
// team per ai.google.dev/edge (2026-05-12). Twelve sub-categories grouped under
// Setup & Authoring / Runtimes / Acceleration & Deployment. Rows simplified to
// two: Google 1P vs. Other ecosystem. isGap=true with empty vendors renders
// "GAP — NO 1P"; isGap=true with vendors renders "WEAK" (1P exists but loses
// developer mindshare).
const MARKET: MarketGroup[] = [
  {
    header: "Setup & Authoring",
    color: BLUE,
    cols: [
      {
        col: "Authoring",
        sub: "Where models start",
        google: { vendors: ["TensorFlow", "JAX", "Keras"] },
        other: { vendors: ["PyTorch", "MLX (Apple)", "Mojo"] },
      },
      {
        col: "Model Hubs",
        sub: "Discovery & distribution",
        google: { vendors: ["Kaggle Models", "Vertex AI Model Garden"] },
        other: { vendors: ["Hugging Face", "GitHub"] },
      },
      {
        col: "Quantization",
        sub: "Shrink for device",
        google: { vendors: ["AI Edge Quantizer", "TF Model Optimization"] },
        other: { vendors: ["AIMET (Qualcomm)", "Neural Magic", "ONNX Quantizer", "bitsandbytes", "GGUF (llama.cpp)"] },
      },
      {
        col: "Model Conversion",
        sub: "Framework → runtime",
        google: { vendors: ["ai-edge-torch", "LiteRT Converter", "MediaPipe Model Maker"] },
        other: { vendors: ["ExecuTorch CLI", "Core ML Tools", "ONNX", "HF Optimum"] },
      },
    ],
  },
  {
    header: "Runtimes",
    color: GREEN,
    cols: [
      {
        col: "Mobile Inference",
        sub: "Android & iOS",
        google: { vendors: ["LiteRT", "MediaPipe Tasks"] },
        other: { vendors: ["ExecuTorch", "Core ML", "ONNX Runtime Mobile", "NCNN (Tencent)"] },
      },
      {
        col: "Web Inference",
        sub: "In-browser .tflite",
        google: { vendors: ["LiteRT.js", "MediaPipe Web", "TensorFlow.js"] },
        other: { vendors: ["ONNX Runtime Web", "Transformers.js"] },
      },
      {
        col: "MCU / Embedded",
        sub: "Sub-1MB footprint",
        google: { vendors: ["LiteRT Micro"], isGap: true },
        other: { vendors: ["Edge Impulse", "Arduino TinyML", "STM X-CUBE-AI", "NXP eIQ"] },
      },
      {
        col: "On-Device LLMs",
        sub: "Generative on mobile",
        google: { vendors: ["LiteRT-LM", "MediaPipe LLM", "Gemini Nano (AICore)"] },
        other: { vendors: ["llama.cpp", "MLC LLM", "Ollama", "FoundationModels (Apple)", "Phi-Silica (MS)"] },
      },
    ],
  },
  {
    header: "Acceleration & Deployment",
    color: RED,
    cols: [
      {
        col: "NPU Acceleration",
        sub: "Silicon delegates",
        google: { vendors: ["AICore", "Edge TPU", "Coral"] },
        other: { vendors: ["Qualcomm AI Engine Direct", "MediaTek NeuroPilot", "Apple Neural Engine", "ARM Ethos", "Intel OpenVINO"] },
      },
      {
        col: "Mobile / Edge CI/CD",
        sub: "Build & ship pipelines",
        google: { vendors: [], isGap: true },
        other: { vendors: ["Bitrise", "GitHub Actions", "CircleCI", "Harness", "Jenkins", "EI build-deploy"] },
      },
      {
        col: "Benchmarking",
        sub: "Device matrix & perf",
        google: { vendors: ["AI Edge Portal", "TFLite benchmark"], isGap: true },
        other: { vendors: ["MLPerf Mobile", "AI Benchmark", "Geekbench AI"] },
      },
      {
        col: "On-Device Observability",
        sub: "Crash, perf, A/B",
        google: { vendors: ["Firebase Crashlytics", "Firebase Performance", "Firebase A/B Testing"] },
        other: { vendors: ["Sentry", "Datadog Mobile RUM", "Mixpanel", "AppCenter"] },
      },
    ],
  },
];

const VENDOR_ICONS: Record<string, string | null> = {
  // Authoring frameworks
  "TensorFlow": "tensorflow",
  "JAX": null,
  "Keras": "keras",
  "PyTorch": "pytorch",
  "MLX (Apple)": "apple",
  "Mojo": null,
  // Model hubs
  "Kaggle Models": "kaggle",
  "Vertex AI Model Garden": "googlecloud",
  "Hugging Face": "huggingface",
  "GitHub": "github",
  // Quantization
  "AI Edge Quantizer": "google",
  "TF Model Optimization": "tensorflow",
  "AIMET (Qualcomm)": "qualcomm",
  "Neural Magic": null,
  "ONNX Quantizer": "onnx",
  "bitsandbytes": null,
  "GGUF (llama.cpp)": "meta",
  // Model conversion
  "ai-edge-torch": "google",
  "LiteRT Converter": "google",
  "MediaPipe Model Maker": "mediapipe",
  "ExecuTorch CLI": "pytorch",
  "Core ML Tools": "apple",
  "ONNX": "onnx",
  "HF Optimum": "huggingface",
  // Mobile inference
  "LiteRT": "google",
  "MediaPipe Tasks": "mediapipe",
  "ExecuTorch": "pytorch",
  "Core ML": "apple",
  "ONNX Runtime Mobile": "onnx",
  "NCNN (Tencent)": null,
  // Web inference
  "LiteRT.js": "google",
  "MediaPipe Web": "mediapipe",
  "TensorFlow.js": "tensorflow",
  "ONNX Runtime Web": "onnx",
  "Transformers.js": "huggingface",
  // MCU / Embedded
  "LiteRT Micro": "google",
  "Edge Impulse": "edgeimpulse",
  "Arduino TinyML": "arduino",
  "STM X-CUBE-AI": "stmicroelectronics",
  "NXP eIQ": "nxp",
  // On-device LLMs
  "LiteRT-LM": "google",
  "MediaPipe LLM": "mediapipe",
  "Gemini Nano (AICore)": "googlegemini",
  "llama.cpp": "meta",
  "MLC LLM": null,
  "Ollama": "ollama",
  "FoundationModels (Apple)": "apple",
  "Phi-Silica (MS)": null,
  // NPU Acceleration
  "AICore": "android",
  "Edge TPU": "google",
  "Coral": null,
  "Qualcomm AI Engine Direct": "qualcomm",
  "MediaTek NeuroPilot": "mediatek",
  "Apple Neural Engine": "apple",
  "ARM Ethos": "arm",
  "Intel OpenVINO": "intel",
  // Mobile / Edge CI/CD
  "Bitrise": "bitrise",
  "GitHub Actions": "githubactions",
  "CircleCI": "circleci",
  "Harness": null,
  "Jenkins": "jenkins",
  "EI build-deploy": "edgeimpulse",
  // Benchmarking
  "AI Edge Portal": "google",
  "TFLite benchmark": "tensorflow",
  "MLPerf Mobile": null,
  "AI Benchmark": null,
  "Geekbench AI": null,
  // On-device observability
  "Firebase Crashlytics": "firebase",
  "Firebase Performance": "firebase",
  "Firebase A/B Testing": "firebase",
  "Sentry": "sentry",
  "Datadog Mobile RUM": "datadog",
  "Mixpanel": "mixpanel",
  "AppCenter": null,
};

function shortName(name: string): string {
  // Drop trailing parenthetical so display labels stay compact.
  return name.replace(/\s*\(.*?\)\s*$/, "").trim();
}

type LogoItem = { name: string; slug?: string | null };
function LogoStrip({ items, size = 12, color = "5f6368" }: { items: LogoItem[]; size?: number; color?: string }) {
  return (
    <span className="inline-flex flex-wrap gap-x-2.5 gap-y-1 items-center align-middle">
      {items.map((item, i) => {
        const slug = item.slug !== undefined ? item.slug : VENDOR_ICONS[item.name];
        return (
          <span key={i} className="inline-flex items-center gap-1">
            {slug && (
              <img
                src={`https://cdn.simpleicons.org/${slug}/${color}`}
                alt=""
                width={size}
                height={size}
                loading="lazy"
                className="shrink-0"
              />
            )}
            <span>{item.name}</span>
          </span>
        );
      })}
    </span>
  );
}

function InlineIcon({ slug, color = "5f6368", size = 14 }: { slug: string; color?: string; size?: number }) {
  return (
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color}`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className="inline-block align-middle shrink-0"
    />
  );
}

function MarketVendor({ name, tone }: { name: string; tone: "google" | "other" }) {
  const isG = tone === "google";
  const slug = VENDOR_ICONS[name];
  const accentHex = isG ? "1a73e8" : "202124";
  const textColor = isG ? BLUE : INK;
  return (
    <div
      className="inline-flex flex-col items-center text-center gap-0.5"
      style={{ width: 52 }}
      title={name}
    >
      <span
        style={{
          background: isG ? BLUE + "14" : SURFACE,
          border: `1px solid ${isG ? BLUE + "45" : BORDER}`,
        }}
        className="w-6 h-6 rounded flex items-center justify-center shrink-0"
      >
        {slug ? (
          <img
            src={`https://cdn.simpleicons.org/${slug}/${accentHex}`}
            alt=""
            width={14}
            height={14}
            loading="lazy"
          />
        ) : (
          <span style={{ color: textColor }} className="text-[9px] font-black">
            {name[0]}
          </span>
        )}
      </span>
      <span
        style={{ color: textColor, lineHeight: 1.1, fontWeight: isG ? 600 : 500 }}
        className="text-[7.5px] block"
      >
        {shortName(name)}
      </span>
    </div>
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
        The on-device AI ecosystem.
        <br />
        <span style={{ color: GRAY }} className="text-2xl font-normal">
          Google 1P (blue) vs. the rest. Where LiteRT, MediaPipe, and LiteRT-LM compete across the full lifecycle.
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
                    <div className="flex flex-wrap gap-x-1 gap-y-1.5 justify-start">
                      {col.google.vendors.map((v) => (
                        <MarketVendor key={v} name={v} tone="google" />
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
                  <div className="flex flex-wrap gap-x-1 gap-y-1.5 justify-start">
                    {col.other.vendors.map((v) => (
                      <MarketVendor key={v} name={v} tone="other" />
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
          Scope: products the Google AI Edge team owns or competes with directly — per <code style={{ background: PAGE, border: `1px solid ${BORDER}` }} className="px-1 rounded font-mono text-[10px]">ai.google.dev/edge</code>. Vendor list verified against vendor docs · 2026-05-12.
        </div>
      </div>
      <p style={{ color: MUTED }} className="text-xs mt-2">
        <strong style={{ color: INK }}>Strategic read:</strong>{" "}
        Across the on-device AI lifecycle, Google leads or competes seriously in 9 of 12 columns — authoring (TensorFlow + JAX + Keras), hubs (Kaggle + Vertex Model Garden), quantization (AI Edge Quantizer), conversion (ai-edge-torch), mobile + web + LLM runtimes (LiteRT, LiteRT.js, MediaPipe, LiteRT-LM, Gemini Nano), NPU delegates (AICore + Edge TPU), and observability (Firebase Crashlytics + Performance + A/B Testing). The 1P stack already covers the full pipeline from <code style={{ background: PAGE, border: `1px solid ${BORDER}` }} className="px-1 rounded font-mono text-[10px]">.pt</code> to device.
        <br />
        <strong style={{ color: RED }}>Three weak spots:</strong>{" "}
        <strong style={{ color: RED }}>(1) GAP — Mobile / Edge CI/CD</strong> — zero 1P offering. Bitrise / GitHub Actions / Harness / Edge Impulse's <code style={{ background: PAGE, border: `1px solid ${BORDER}` }} className="px-1 rounded font-mono text-[10px]">build-deploy</code> Action own this lane. The DevKit closes this gap directly.<Cite ids={[17, 18]} />
        <strong style={{ color: RED }}> (2) Weak — MCU / Embedded</strong> — LiteRT for Microcontrollers exists, but Edge Impulse owns developer mindshare for sub-1MB deployment.
        <strong style={{ color: RED }}> (3) Weak — Benchmarking</strong> — AI Edge Portal is private preview; MLPerf Mobile, AI Benchmark, and Geekbench AI own public device-matrix mindshare.
        <br />
        <strong style={{ color: INK }}>Pitch implication:</strong> DevKit + AI Edge Portal public ramp + an Edge Impulse partnership close all three weak spots at once — and none require new tech, only packaging, distribution, and partnership work.
        <br />
        <strong style={{ color: INK }}>The moat:</strong> Google has the most complete on-device AI stack in the industry — silicon (Pixel Tensor + Edge TPU), OS (AICore + Android), models (Gemma 4), cloud training (Vertex AI), four runtimes (mobile, web, MCU, LLM), and observability (Firebase). The DevKit packages this 1P stack into a <strong style={{ color: BLUE }}>single Apple-style developer workflow no competitor can replicate</strong> — because no competitor owns this full stack.
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
            4 partner classes · 3 tiers · Year-2 Partner Summit (2027)
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
            "The Xcode for Google's edge AI stack." CLI + GitHub Actions + observability hooks + public benchmark dashboard. Connects LiteRT, Gemma 4, Vertex, and Cloud Run into one workflow. Fastest to independent impact.
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
      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-5">
        <span
          style={{ background: BLUE }}
          className="text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
        >
          ⭐ Pitch 2 · Recommended
        </span>
        <span style={{ color: MUTED }} className="text-xs uppercase tracking-widest font-semibold">
          LiteRT DevKit
        </span>
      </div>

      {/* Hero */}
      <h2
        style={{ color: INK, fontFamily: FONT_HEAD, letterSpacing: "-0.025em" }}
        className="text-5xl md:text-[3.25rem] font-bold leading-[1.05] mb-3"
      >
        The Xcode for Google&apos;s edge AI stack.
      </h2>
      <p style={{ color: GRAY }} className="text-xl md:text-2xl font-light mb-5 leading-snug">
        Nine 1P products. One developer workflow.
      </p>

      {/* What it is callout */}
      <div
        style={{ background: BLUE + "08", border: `1px solid ${BLUE}25` }}
        className="rounded-xl px-5 py-3.5 mb-6 flex gap-4 items-start"
      >
        <div
          style={{ background: BLUE, color: "white" }}
          className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded shrink-0 mt-0.5"
        >
          What it is
        </div>
        <p style={{ color: INK }} className="text-sm leading-relaxed">
          One CLI + three GitHub Actions + a public benchmark dashboard.{" "}
          <code style={{ background: PAGE, border: `1px solid ${BORDER}` }} className="px-1.5 py-0.5 rounded text-xs font-mono">litert convert &amp;&amp; litert push</code>{" "}
          ties nine 1P products into one developer workflow.
        </p>
      </div>

      {/* 3 modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 stagger-enter">
        <Card>
          <div style={{ color: BLUE }} className="text-[11px] font-bold uppercase tracking-widest mb-3">
            01 · The CLI
          </div>
          <div className="font-mono text-xs space-y-1.5">
            {[
              ["convert", "model.pt --quantize int8"],
              ["validate", "model.tflite --ref model.pt"],
              ["bench", "model.tflite --targets all"],
              ["push", "model.tflite --hub litert-community"],
            ].map(([cmd, args]) => (
              <div key={cmd} className="leading-tight">
                <span style={{ color: GREEN }}>$</span>{" "}
                <span style={{ color: INK }} className="font-bold">litert {cmd}</span>{" "}
                <span style={{ color: GRAY }}>{args}</span>
              </div>
            ))}
          </div>
          <div style={{ color: MUTED }} className="text-[11px] mt-3 italic">
            4 commands replace the 6 manual steps from Slide 2.
          </div>
        </Card>

        <Card>
          <div style={{ color: BLUE }} className="text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>02 · GitHub Actions</span>
            <span style={{ background: BLUE + "22", color: BLUE, border: `1px solid ${BLUE}55` }} className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider">PROPOSED</span>
          </div>
          <div className="font-mono text-xs space-y-1.5">
            {[
              "litert-convert-action@v1",
              "litert-bench-action@v1",
              "litert-gate-action@v1",
            ].map((a) => (
              <div key={a} className="leading-tight">
                <span style={{ color: GREEN }}>-</span>{" "}
                <span style={{ color: GRAY }}>uses:</span>{" "}
                <span style={{ color: BLUE }} className="break-all">{a}</span>
              </div>
            ))}
          </div>
          <div style={{ color: MUTED }} className="text-[11px] mt-3 italic">
            0 official LiteRT Actions on GitHub Marketplace today.<Cite ids={[17]} />
          </div>
        </Card>

        <Card>
          <div style={{ color: BLUE }} className="text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>03 · Launch Partners</span>
            <span style={{ background: BLUE + "22", color: BLUE, border: `1px solid ${BLUE}55` }} className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider">TARGETS</span>
          </div>
          <div className="text-xs space-y-2.5" style={{ color: INK }}>
            <div>
              <div style={{ color: MUTED }} className="text-[9px] font-bold uppercase tracking-wider mb-1">CI/CD</div>
              <LogoStrip items={[{ name: "Bitrise" }, { name: "CircleCI" }, { name: "Harness" }, { name: "GitHub", slug: "github" }]} size={11} />
            </div>
            <div>
              <div style={{ color: MUTED }} className="text-[9px] font-bold uppercase tracking-wider mb-1">Hardware</div>
              <LogoStrip items={[{ name: "Qualcomm", slug: "qualcomm" }, { name: "MediaTek", slug: "mediatek" }, { name: "ARM", slug: "arm" }]} size={11} />
            </div>
            <div>
              <div style={{ color: MUTED }} className="text-[9px] font-bold uppercase tracking-wider mb-1">Models</div>
              <LogoStrip items={[{ name: "Hugging Face" }, { name: "Kaggle", slug: "kaggle" }, { name: "Ultralytics", slug: "ultralytics" }, { name: "Roboflow", slug: "roboflow" }]} size={11} />
            </div>
          </div>
        </Card>
      </div>

      {/* Year-1 footer strip */}
      <div className="mt-5 pt-4 border-t" style={{ borderColor: BORDER }}>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span style={{ color: MUTED }} className="text-[10px] font-bold uppercase tracking-widest shrink-0">Year 1 →</span>
          {[
            "CLI v1.0",
            "Actions on Marketplace",
            "RAG / Translation / Camera+LLM templates",
            "Next Google × Qualcomm hackathon (target: H2 2026)",
            "Public benchmark dashboard",
            "Talk proposal: World's Fair 2027 / PyTorch Conf",
          ].map((m, i) => (
            <span key={i} className="inline-flex items-center gap-3">
              {i > 0 && <span style={{ color: BORDER }}>•</span>}
              <span style={{ color: GRAY }} className="text-xs">{m}</span>
            </span>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

// ─── Slide 5: Pitch 1 — Partner Network ──────────────────────────────────────

function PartnerNetwork() {
  const classes: { name: string; examples: LogoItem[]; what: string; color: string }[] = [
    {
      name: "Hardware",
      examples: [
        { name: "Qualcomm AI Hub", slug: "qualcomm" },
        { name: "MediaTek NeuroPilot", slug: "mediatek" },
        { name: "ARM Ethos", slug: "arm" },
      ],
      what: "NPU/GPU delegate validated on LiteRT vX.X",
      color: BLUE,
    },
    {
      name: "Training Platforms",
      examples: [
        { name: "Ultralytics", slug: "ultralytics" },
        { name: "Roboflow", slug: "roboflow" },
        { name: "W&B", slug: "weightsandbiases" },
        { name: "Edge Impulse", slug: "edgeimpulse" },
      ],
      what: "One-click .tflite export from training UI",
      color: GREEN,
    },
    {
      name: "Deployment Tools",
      examples: [
        { name: "GitHub Actions", slug: "githubactions" },
        { name: "Harness", slug: null },
        { name: "Bitrise", slug: "bitrise" },
        { name: "CircleCI", slug: "circleci" },
      ],
      what: "Native LiteRT pipeline stage or action",
      color: RED,
    },
    {
      name: "Model Hubs",
      examples: [
        { name: "HF litert-community", slug: "huggingface" },
        { name: "Kaggle Models", slug: "kaggle" },
        { name: "Roboflow Universe", slug: "roboflow" },
        { name: "Ultralytics HUB", slug: "ultralytics" },
      ],
      what: "Verified .tflite / LiteRT-LM model cards with benchmark data",
      color: YELLOW,
    },
  ];
  return (
    <Wrap>
      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-5">
        <Badge color={BLUE}>Pitch 1</Badge>
        <span style={{ color: MUTED }} className="text-xs uppercase tracking-widest font-semibold">
          Certified Partner Network
        </span>
      </div>

      {/* Hero */}
      <h2
        style={{ color: INK, fontFamily: FONT_HEAD, letterSpacing: "-0.025em" }}
        className="text-5xl md:text-[3.25rem] font-bold leading-[1.05] mb-3"
      >
        &ldquo;Intel Inside for edge AI.&rdquo;
      </h2>
      <p style={{ color: GRAY }} className="text-xl md:text-2xl font-light mb-5 leading-snug">
        A &ldquo;Validated for LiteRT&rdquo; badge program.
      </p>

      {/* What it is callout */}
      <div
        style={{ background: BLUE + "08", border: `1px solid ${BLUE}25` }}
        className="rounded-xl px-5 py-3.5 mb-6 flex gap-4 items-start"
      >
        <div
          style={{ background: BLUE, color: "white" }}
          className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded shrink-0 mt-0.5"
        >
          What it is
        </div>
        <p style={{ color: INK }} className="text-sm leading-relaxed">
          A 3-tier certification (Community → Certified → Strategic) across 4 partner classes. Partners co-market the badge on their products; buyers get one trust signal across hardware, training, deployment, and model hubs.
        </p>
      </div>

      {/* 4 modules — 2x2 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 content-start stagger-enter">
        {classes.map((c) => (
          <Card key={c.name} accent={c.color}>
            <div
              style={{ color: c.color }}
              className="text-[11px] font-bold uppercase tracking-widest mb-2"
            >
              {c.name}
            </div>
            <div style={{ color: INK }} className="font-semibold mb-3 text-sm leading-snug">
              {c.what}
            </div>
            <div style={{ color: GRAY }} className="text-sm">
              <LogoStrip items={c.examples} size={13} />
            </div>
          </Card>
        ))}
      </div>

      {/* Footer strip */}
      <div className="mt-5 pt-4 border-t" style={{ borderColor: BORDER }}>
        <div className="flex items-baseline gap-3 flex-wrap text-xs">
          <span style={{ color: MUTED }} className="font-bold uppercase tracking-widest shrink-0">Year 1 →</span>
          <span style={{ color: GRAY }}>
            <span style={{ color: INK }} className="font-semibold">8 launch partners</span> (none yet committed)
          </span>
          <span style={{ color: BORDER }}>•</span>
          <span style={{ color: GRAY }}>Public portal at <code style={{ background: PAGE, border: `1px solid ${BORDER}` }} className="px-1 rounded font-mono text-[10px]">ai.google.dev/edge/partners</code></span>
          <span style={{ color: BORDER }}>•</span>
          <span style={{ color: GRAY }}>Inaugural Partner Summit at World&apos;s Fair 2027</span>
          <span style={{ color: BORDER }}>•</span>
          <span style={{ color: GRAY }}>v2: Unsloth / ElevenLabs (gen-AI tier)</span>
        </div>
      </div>
    </Wrap>
  );
}

// ─── Slide 6: Pitch 3 — Vertex Bridge ────────────────────────────────────────

function VertexBridge() {
  return (
    <Wrap>
      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-5">
        <Badge color={GREEN}>Pitch 3</Badge>
        <span style={{ color: MUTED }} className="text-xs uppercase tracking-widest font-semibold">
          LiteRT × Vertex AI Bridge
        </span>
      </div>

      {/* Hero */}
      <h2
        style={{ color: INK, fontFamily: FONT_HEAD, letterSpacing: "-0.025em" }}
        className="text-4xl md:text-[2.75rem] font-bold leading-[1.05] mb-3"
      >
        &ldquo;Fine-tune on Vertex. Deploy to nearly 4B Android devices.&rdquo;
      </h2>
      <p style={{ color: GRAY }} className="text-xl md:text-2xl font-light mb-5 leading-snug">
        A &ldquo;Deploy to LiteRT&rdquo; button in Vertex Model Garden.
      </p>

      {/* What it is callout */}
      <div
        style={{ background: GREEN + "08", border: `1px solid ${GREEN}25` }}
        className="rounded-xl px-5 py-3.5 mb-6 flex gap-4 items-start"
      >
        <div
          style={{ background: GREEN, color: "white" }}
          className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded shrink-0 mt-0.5"
        >
          What it is
        </div>
        <p style={{ color: INK }} className="text-sm leading-relaxed">
          A &ldquo;Deploy to LiteRT&rdquo; button in Vertex Model Garden plus a Firebase ML Kit unification. One control plane for the cloud-to-edge model lifecycle, with GCS+CDN fallback if Firebase declines on-device hosting.
        </p>
      </div>

      {/* 3 modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-1 stagger-enter">
        <Card accent={RED}>
          <div style={{ color: RED }} className="text-[11px] font-bold uppercase tracking-widest mb-3">
            01 · Today
          </div>
          <div className="font-mono text-xs mb-3" style={{ color: GRAY }}>
            Vertex AI (custom){" "}
            <span style={{ color: RED }}>→ no path</span>{" "}
            <span style={{ color: MUTED }}>→</span> Android
          </div>
          <div style={{ color: GRAY }} className="text-xs leading-relaxed">
            AutoML → TFLite exists. Custom-model path: undocumented, multi-step, unsupported.
          </div>
          <div style={{ color: MUTED }} className="text-[11px] mt-3 italic">
            Apple Core ML: train → export → ship. Google has no equivalent for custom models.
          </div>
        </Card>

        <Card accent={GREEN}>
          <div style={{ color: GREEN }} className="text-[11px] font-bold uppercase tracking-widest mb-3">
            02 · Target
          </div>
          <div className="font-mono text-xs" style={{ color: GRAY }}>
            <div>model.export(</div>
            <div className="pl-4">
              <span style={{ color: INK }}>format</span>=<span style={{ color: GREEN }}>&apos;litert&apos;</span>,
            </div>
            <div className="pl-4">
              <span style={{ color: INK }}>quantization</span>=<span style={{ color: GREEN }}>&apos;int8&apos;</span>,
            </div>
            <div className="pl-4">
              <span style={{ color: INK }}>validate</span>=<span style={{ color: BLUE }}>True</span>,
            </div>
            <div>)</div>
          </div>
          <div style={{ color: MUTED }} className="text-[11px] mt-3 italic">
            One API call replaces the entire custom-model export pipeline.
          </div>
        </Card>

        <Card accent={BLUE}>
          <div style={{ color: BLUE }} className="text-[11px] font-bold uppercase tracking-widest mb-3">
            03 · Integration Points
          </div>
          <ul className="space-y-1.5">
            {[
              "Vertex Model Garden → Deploy to LiteRT button",
              "Vertex training .export(format='litert') API",
              "Firebase ML on-device deepening",
              "LiteRT as canonical Android ML runtime",
            ].map((i) => (
              <li key={i} style={{ color: GRAY }} className="flex gap-2 text-xs leading-snug">
                <span style={{ color: GREEN }} className="shrink-0">→</span>
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Footer strip — strategy, prerequisite, fallback */}
      <div className="mt-5 pt-4 border-t" style={{ borderColor: BORDER }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span style={{ color: GREEN }} className="font-bold uppercase tracking-widest text-[10px] mr-2">Strategy</span>
            <span style={{ color: GRAY }}>Kaggle-first ramp — zero cross-org politics, then approach Vertex.</span>
          </div>
          <div>
            <span style={{ color: MUTED }} className="font-bold uppercase tracking-widest text-[10px] mr-2">Prerequisite</span>
            <span style={{ color: GRAY }}>GM support day 1 across Vertex AI, Firebase, Android, LiteRT.</span>
          </div>
          <div>
            <span style={{ color: YELLOW }} className="font-bold uppercase tracking-widest text-[10px] mr-2">Fallback</span>
            <span style={{ color: GRAY }}>GCS+CDN+WorkManager or signed Vertex Registry REST if Firebase declines.</span>
          </div>
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
          <ul className="space-y-3">
            {[
              "Can't walk into a CI/CD vendor and speak DevOps buyer language",
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
          <div className="mt-5 flex-1">
            <div style={{ color: MUTED }} className="text-[10px] font-bold uppercase tracking-[0.14em] mb-2">
              The ecosystem this role spans
            </div>
            <div className="space-y-1.5">
              {[
                {
                  group: "CI/CD",
                  items: [
                    { name: "GitHub Actions", slug: "githubactions" },
                    { name: "GitLab", slug: "gitlab" },
                    { name: "CircleCI", slug: "circleci" },
                    { name: "Jenkins", slug: "jenkins" },
                    { name: "Bitrise", slug: "bitrise" },
                    { name: "Harness", slug: null },
                    { name: "Buildkite", slug: "buildkite" },
                  ],
                },
                {
                  group: "MLOps",
                  items: [
                    { name: "Hugging Face", slug: "huggingface" },
                    { name: "W&B", slug: "weightsandbiases" },
                    { name: "MLflow", slug: "mlflow" },
                    { name: "Roboflow", slug: "roboflow" },
                    { name: "Ultralytics", slug: "ultralytics" },
                  ],
                },
                {
                  group: "Silicon",
                  items: [
                    { name: "Qualcomm", slug: "qualcomm" },
                    { name: "MediaTek", slug: "mediatek" },
                    { name: "ARM", slug: "arm" },
                    { name: "Apple", slug: "apple" },
                  ],
                },
              ].map((row) => (
                <div key={row.group} className="flex items-center gap-1.5 flex-wrap">
                  <span style={{ color: MUTED }} className="text-[9px] uppercase tracking-wider font-semibold w-14 shrink-0">
                    {row.group}
                  </span>
                  {row.items.map((item) => (
                    <span
                      key={item.name}
                      style={{ background: PAGE, border: `1px solid ${BORDER}`, color: INK }}
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium inline-flex items-center gap-1"
                    >
                      {item.slug && (
                        <img
                          src={`https://cdn.simpleicons.org/${item.slug}/202124`}
                          alt=""
                          width={11}
                          height={11}
                          loading="lazy"
                          className="shrink-0"
                        />
                      )}
                      <span>{item.name}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
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
              Partnerships PMs already operate in this ecosystem every week — co-marketing, joint go-to-market, conference circuit. A peer call opens doors a product-team cold outreach can't.
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
              "Official DevKit at the next Google × Qualcomm LiteRT hackathon (target: H2 2026)",
              "3+ co-announcement partners (target: Harness, Roboflow, Ultralytics)",
              "Talk proposal submitted to AI Engineer World's Fair 2027 / PyTorch Conference",
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
  <TheNumbers />,
  <MarketMap />,
  <PartTwoDivider />,
  <ThreePlays />,
  <TwoWorlds />,
  <HardwareMoatHero />,
  <Devkit />,
  <PartnerNetwork />,
  <VertexBridge />,
  <PartThreeDivider />,
  <WhyThisTeam />,
  <TheAsk />,
  <DeepDives />,
  <Sources />,
];

// ─── Per-slide metadata (titles, sections, speaker notes) ─────────────────────

const SLIDE_META: SlideMeta[] = [
  { title: "Cover", section: "Opening", note: "Hook: deployment layer for on-device AI is missing. Three plays, one recommendation. Pause for eye contact." },
  { title: "Problem", section: "The Stakes", note: "Frame: nine great Google products, zero coherent workflow. A custom edge model still takes six manual steps. ExecuTorch ships a CLI; we don't." },
  { title: "Stakes", section: "The Stakes", note: "Three threats: ExecuTorch went vendor-neutral (Linux Foundation, April 2026), World's Fair has zero edge-CI/CD tracks, ONNX Runtime Web won browser AI. 18-24 month window." },
  { title: "The numbers", section: "The Stakes", note: "Quantitative backup for the three pitches. Web ML: LiteRT.js at 0.06% of ORT-Web (awareness gap, not tech). CI/CD: 0 LiteRT Actions on GitHub Marketplace (whitespace). Cloud-to-edge: AWS exited, Apple gold standard, Google has no path. Each column maps to one of the three pitches." },
  { title: "Market map", section: "The Stakes", note: "Reference slide, scoped to the AI Edge team's actual lane (per ai.google.dev/edge). 9 of 12 boxes have strong 1P. Net: 1 acute GAP (Mobile / Edge CI/CD — the DevKit lane) + 2 weak positions (MCU mindshare vs Edge Impulse, benchmarking — AI Edge Portal still private preview)." },
  { title: "Part II · The plays", section: "The Plays", note: "Transition. Section break. Take a breath, then dive into the three pitches." },
  { title: "Three plays", section: "The Plays", note: "Three pitches, one initiative. Recommendation is Pitch 2 (DevKit) because it has the fastest path to independent shipped artifacts and zero cross-org friction." },
  { title: "Two worlds", section: "The Plays", note: "DevKit lead-in #1 (scope): pre-empt the AICore objection. AICore + Gemini Nano solve general AI on Android. DevKit is for the second world — custom domain models AICore won't serve. Sets up Pitch 2." },
  { title: "100× hardware moat", section: "The Plays", note: "DevKit lead-in #2 (moat): hero number, pause. Google × Qualcomm AI Engine Direct and MediaTek NeuroPilot integrations no competitor can replicate — this is the silicon-vendor partnership advantage that makes DevKit defensible. Sets up Pitch 2." },
  { title: "Pitch 2 — DevKit", section: "The Plays", note: "Recommended. The Xcode for Google's edge AI stack. CLI + GitHub Actions + benchmark dashboard. Connects LiteRT, Gemma 4, Vertex, Cloud Run into one workflow. Two lead-in slides justified the scope + moat — now the play itself." },
  { title: "Pitch 1 — Partner Network", section: "The Plays", note: "Parallel ecosystem motion. Certification program across 4 partner classes. Year-1 target: 8 launch partners. Vercel and Lovable are strategic Year-1 targets." },
  { title: "Pitch 3 — Vertex Bridge", section: "The Plays", note: "Bring at month 3 after Pitch 2 traction. Kaggle-first to dodge cross-org friction. Plan B fallback if Firebase declines: GCS+CDN+WorkManager or Vertex Registry signed REST." },
  { title: "Part III · The proposal", section: "The Proposal", note: "Transition. Final third: why this team, why this person, what gets approved today." },
  { title: "Why this team / why this PM", section: "The Proposal", note: "Partnerships PM needed for Bitrise/CircleCI/Harness conversations. Engineering-only can't pull this off — the moat is the partnership relationships." },
  { title: "The Ask", section: "The Proposal", note: "6-month rotation. Pitch 2 primary, Pitch 1 parallel, Pitch 3 at month 3. Eight Year-1 deliverables — every one is independently verifiable." },
  { title: "Deep dives", section: "Reference", note: "Pointer slide. The 5 runbooks have full execution detail. Don't read them in the meeting — share them after." },
  { title: "Sources", section: "Reference", note: "19 verified citations. Every factual claim cross-referenced with Gemini Deep Research Max + Google Doc + per-vendor WebSearch." },
];

// ─── Deck shell ───────────────────────────────────────────────────────────────

// Inject global animation CSS once
const ANIMATION_CSS = `
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .stagger-enter > * { opacity: 0; animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
  .stagger-enter > *:nth-child(1) { animation-delay: 0.05s; }
  .stagger-enter > *:nth-child(2) { animation-delay: 0.12s; }
  .stagger-enter > *:nth-child(3) { animation-delay: 0.19s; }
  .stagger-enter > *:nth-child(4) { animation-delay: 0.26s; }
  .stagger-enter > *:nth-child(5) { animation-delay: 0.33s; }
  .stagger-enter > *:nth-child(6) { animation-delay: 0.40s; }
  .stagger-enter > *:nth-child(7) { animation-delay: 0.47s; }
  .stagger-enter > *:nth-child(8) { animation-delay: 0.54s; }
  @media print {
    .print-hide { display: none !important; }
    .print-slide { page-break-after: always; height: auto !important; min-height: 100vh; position: relative !important; }
  }
`;

export function Component() {
  const isPrint =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("print");
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [overview, setOverview] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= SLIDES.length || next === idx) return;
      setDirection(next > idx ? 1 : -1);
      setVisible(false);
      setTimeout(() => {
        setIdx(next);
        setVisible(true);
      }, 160);
    },
    [idx]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "o" || e.key === "O") {
        e.preventDefault();
        setOverview((v) => !v);
        return;
      }
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setSpeaker((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        if (overview) setOverview(false);
        else if (speaker) setSpeaker(false);
        return;
      }
      if (overview) return; // disable nav while overview open
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
  }, [goTo, idx, overview, speaker]);

  const pct = ((idx + 1) / SLIDES.length) * 100;
  const meta = SLIDE_META[idx] ?? { title: "", section: "", note: "" };

  // ─── PRINT MODE: linearize all slides ────────────────────────────────────
  if (isPrint) {
    return (
      <div
        style={{
          fontFamily: FONT_BODY,
          background: PAGE,
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        } as React.CSSProperties}
        className="select-none"
      >
        <style>{ANIMATION_CSS}</style>
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="print-slide"
            style={{
              position: "relative",
              width: "100vw",
              height: "100vh",
              overflow: "hidden",
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 flex" style={{ height: 2 }}>
              <div style={{ background: BLUE, flex: 4 }} />
              <div style={{ background: RED, flex: 2 }} />
              <div style={{ background: YELLOW, flex: 1 }} />
              <div style={{ background: GREEN, flex: 2 }} />
            </div>
            <div
              style={{ color: MUTED, fontFamily: FONT_HEAD, letterSpacing: "0.05em" }}
              className="absolute top-5 right-7 text-xs tabular-nums z-10"
            >
              {String(i + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </div>
            {slide}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: FONT_BODY,
        background: PAGE,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      } as React.CSSProperties}
      className="fixed inset-0 overflow-hidden select-none"
    >
      <style>{ANIMATION_CSS}</style>

      {/* Google-color top bar — slimmer, more refined */}
      <div className="absolute top-0 left-0 right-0 flex" style={{ height: 2 }}>
        <div style={{ background: BLUE, flex: 4 }} />
        <div style={{ background: RED, flex: 2 }} />
        <div style={{ background: YELLOW, flex: 1 }} />
        <div style={{ background: GREEN, flex: 2 }} />
      </div>

      {/* Progress bar — thin blue fill below the brand bar */}
      <div
        className="absolute left-0"
        style={{
          top: 2,
          height: 2,
          width: `${pct}%`,
          background: BLUE,
          opacity: 0.6,
          transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 5,
        }}
      />

      {/* Top-left label — section indicator */}
      <div className="absolute top-5 left-7 flex items-center gap-2.5 z-10">
        <div className="flex gap-1">
          {[BLUE, RED, YELLOW, GREEN].map((c) => (
            <span
              key={c}
              style={{ background: c }}
              className="w-1.5 h-1.5 rounded-full"
            />
          ))}
        </div>
        <span
          style={{ color: MUTED, fontFamily: FONT_HEAD, letterSpacing: "0.18em" }}
          className="text-[0.65rem] font-semibold uppercase"
        >
          LiteRT Rotation
        </span>
        {meta.section && (
          <>
            <span style={{ color: BORDER }} className="text-[0.65rem]">·</span>
            <span
              style={{
                color: GRAY,
                fontFamily: FONT_HEAD,
                letterSpacing: "0.18em",
              }}
              className="text-[0.65rem] font-semibold uppercase"
            >
              {meta.section}
            </span>
          </>
        )}
      </div>

      {/* Slide counter */}
      <div
        style={{ color: MUTED, fontFamily: FONT_HEAD, letterSpacing: "0.05em" }}
        className="absolute top-5 right-7 text-xs tabular-nums font-medium z-10"
      >
        {String(idx + 1).padStart(2, "0")}
        <span style={{ color: BORDER }}> / </span>
        {String(SLIDES.length).padStart(2, "0")}
      </div>

      {/* Slide content with slide-from-direction motion */}
      <div
        key={idx}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateX(0)"
            : `translateX(${direction === 1 ? "16px" : "-16px"})`,
          transition:
            "opacity 0.24s cubic-bezier(0.16,1,0.3,1), transform 0.32s cubic-bezier(0.16,1,0.3,1)",
        }}
        className="absolute inset-0"
      >
        {SLIDES[idx]}
      </div>

      {/* Speaker notes overlay */}
      {speaker && (
        <div
          style={{
            background: "rgba(32, 33, 36, 0.96)",
            borderTop: `2px solid ${BLUE}`,
            backdropFilter: "blur(8px)",
            fontFamily: FONT_BODY,
          }}
          className="absolute bottom-0 left-0 right-0 px-10 py-5 z-20 flex items-start gap-4"
        >
          <span
            style={{
              color: BLUE,
              fontFamily: FONT_HEAD,
              letterSpacing: "0.18em",
            }}
            className="text-[0.6rem] uppercase font-bold tracking-widest mt-1 shrink-0"
          >
            Speaker · {String(idx + 1).padStart(2, "0")}
          </span>
          <p
            style={{ color: "#fff" }}
            className="text-sm md:text-base leading-relaxed max-w-5xl flex-1"
          >
            {meta.note}
          </p>
          <button
            onClick={() => setSpeaker(false)}
            style={{ color: MUTED }}
            className="text-xl leading-none ml-2 hover:text-white"
            aria-label="Close speaker notes"
          >
            ×
          </button>
        </div>
      )}

      {/* Prev arrow */}
      <button
        onClick={() => goTo(idx - 1)}
        disabled={idx === 0}
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          color: GRAY,
          boxShadow:
            "0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.05)",
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-0 z-10 cursor-pointer hover:shadow-md hover:scale-105 print-hide"
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
          boxShadow:
            "0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.05)",
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-0 z-10 cursor-pointer hover:shadow-md hover:scale-105 print-hide"
        aria-label="Next slide"
      >
        →
      </button>

      {/* Progress dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 print-hide">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            title={SLIDE_META[i]?.title}
            style={{
              background: i === idx ? BLUE : BORDER,
              width: i === idx ? 28 : 6,
              height: 6,
              borderRadius: 999,
              transition: "all 0.32s cubic-bezier(0.16,1,0.3,1)",
              cursor: "pointer",
              border: "none",
            }}
            aria-label={`Go to slide ${i + 1} — ${SLIDE_META[i]?.title ?? ""}`}
          />
        ))}
      </div>

      {/* Keyboard-hint footer (right) */}
      <div
        style={{
          color: MUTED,
          fontFamily: FONT_HEAD,
          letterSpacing: "0.12em",
        }}
        className="absolute bottom-5 right-7 text-[0.55rem] uppercase font-semibold z-10 print-hide flex items-center gap-3"
      >
        <button onClick={() => setOverview(true)} className="hover:text-gray-700 cursor-pointer">
          [O]verview
        </button>
        <button onClick={() => setSpeaker((v) => !v)} className="hover:text-gray-700 cursor-pointer">
          [P]resenter
        </button>
      </div>

      {/* Overview grid modal */}
      {overview && (
        <div
          style={{ background: "rgba(13, 17, 23, 0.78)", backdropFilter: "blur(6px)" }}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center p-10"
          onClick={() => setOverview(false)}
        >
          <div className="flex items-center justify-between w-full max-w-7xl mb-6">
            <p
              style={{
                color: "#fff",
                fontFamily: FONT_HEAD,
                letterSpacing: "0.18em",
              }}
              className="text-xs uppercase font-bold"
            >
              Overview · {SLIDES.length} slides · press <kbd className="px-1.5 py-0.5 rounded bg-white/10 ml-1">Esc</kbd> to close
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOverview(false);
              }}
              className="text-white text-2xl hover:opacity-70"
              aria-label="Close overview"
            >
              ×
            </button>
          </div>
          <div
            className="grid gap-3 w-full max-w-7xl overflow-y-auto"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {SLIDES.map((_, i) => {
              const m = SLIDE_META[i] ?? { title: "", section: "" };
              const isCurrent = i === idx;
              return (
                <button
                  key={i}
                  onClick={() => {
                    goTo(i);
                    setOverview(false);
                  }}
                  style={{
                    background: SURFACE,
                    border: isCurrent ? `2px solid ${BLUE}` : `1px solid ${BORDER}`,
                    boxShadow: isCurrent
                      ? `0 4px 20px ${BLUE}55`
                      : "0 1px 3px rgba(0,0,0,0.18)",
                  }}
                  className="rounded-xl p-4 text-left transition-all hover:scale-[1.02]"
                >
                  <div
                    style={{
                      color: isCurrent ? BLUE : MUTED,
                      fontFamily: FONT_HEAD,
                      letterSpacing: "0.15em",
                    }}
                    className="text-[0.55rem] uppercase font-bold mb-2"
                  >
                    {String(i + 1).padStart(2, "0")} · {m.section}
                  </div>
                  <div
                    style={{
                      color: INK,
                      fontFamily: FONT_HEAD,
                      letterSpacing: "-0.01em",
                    }}
                    className="text-base font-semibold leading-tight"
                  >
                    {m.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
