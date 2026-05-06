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
          There is no unified, cross-platform CI/CD pipeline for on-device AI.
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
        with a public benchmark dashboard. LiteRT has no equivalent packaged
        workflow.
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
            ExecuTorch (Meta) · v1.2.0 · April 2026
          </div>
          <div style={{ color: INK }} className="text-lg font-bold mb-1">
            Powers Instagram, WhatsApp, Ray-Ban, Quest 3.
          </div>
          <div style={{ color: GRAY }} className="text-sm">
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
            . Powers billions of users across Meta's app family.
          </div>
        </Card>

        <Card accent={YELLOW}>
          <div
            style={{ color: YELLOW }}
            className="text-xs font-bold uppercase tracking-widest mb-2"
          >
            AI Engineer World's Fair 2026 · Jun 29 – Jul 2 · San Francisco
          </div>
          <div style={{ color: INK }} className="text-lg font-bold mb-1">
            Across all its tracks: zero on-device AI. Zero CI/CD for ML.
          </div>
          <div style={{ color: GRAY }} className="text-sm">
            Robotics, Voice, Vision, LLM Infra, Evals &amp; Observability —
            confirmed tracks, none covering on-device AI. First team to show up
            owns the conversation.
          </div>
        </Card>

        <Card>
          <div
            style={{ color: MUTED }}
            className="text-xs font-bold uppercase tracking-widest mb-2"
          >
            AWS SageMaker Edge
          </div>
          <div style={{ color: INK }} className="text-lg font-bold mb-1">
            Deprecated April 26, 2024.
          </div>
          <div style={{ color: GRAY }} className="text-sm">
            No cloud provider has a seamless, publicized cloud-to-edge developer
            experience. Azure has IoT Edge integrations; Google has partial
            pieces. But none approach Apple Core ML's end-to-end UX. Google is
            the only company with both the training story (Vertex) and the edge
            runtime (LiteRT) — but they're not connected.
          </div>
        </Card>
      </div>
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
              className="text-xs uppercase tracking-widest mb-2 font-semibold"
            >
              GitHub Actions Suite
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
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Card>
            <div
              style={{ color: BLUE }}
              className="text-xs font-semibold uppercase tracking-widest mb-2"
            >
              Launch Partners
            </div>
            <div style={{ color: INK }} className="text-sm">
              CI/CD: Bitrise · CircleCI · Harness · GitHub Marketplace
              <br />
              Models: Hugging Face · Ultralytics · Roboflow
              <br />
              Hardware: Qualcomm AI Hub · MediaTek NeuroPilot
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
                "litert CLI v1.0 open-sourced",
                "Actions on GitHub Marketplace + Bitrise Steps + CircleCI Orbs",
                "3+ co-announcement partners across CI/CD, model hubs, hardware",
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
      examples: "HF litert-community, TF Hub, Kaggle Models, Roboflow Universe",
      what: "Verified .tflite model cards with benchmark data",
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
            Year 1:
          </span>{" "}
          8 partners, public portal at ai.google.dev/edge/partners, annual
          summit
        </div>
      </div>
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
              "Actions on GitHub Marketplace + Bitrise Steps Store + CircleCI Orb Registry",
              "3+ co-announcement partners: Harness, Roboflow, Ultralytics",
              "Benchmark dashboard: Qualcomm, MediaTek, ARM device profiles live",
              "Talk accepted at AI Engineer World's Fair or PyTorch Conference",
              "3 Certified Partner Network signed LOIs",
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

// ─── Slide registry ───────────────────────────────────────────────────────────

const SLIDES = [
  <Cover />,
  <Problem />,
  <Stakes />,
  <ThreePlays />,
  <Devkit />,
  <PartnerNetwork />,
  <VertexBridge />,
  <WhyThisTeam />,
  <TheAsk />,
  <DeepDives />,
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
