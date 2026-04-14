import type { RunResult } from "./types";

/**
 * Build a deep link that opens a prefilled GitHub Issue with the run JSON
 * embedded in a fenced code block. The maintainer (Abhi) reviews and merges
 * to data/runs.json. No backend needed.
 */

const REPO = "abhid1234/web-ai-bench";

export function buildSubmissionUrl(runs: RunResult[]): string {
  const title = `Benchmark submission: ${runs[0]?.modelId ?? "unknown"}`;
  const body = [
    "## Benchmark submission",
    "",
    `**Model:** \`${runs[0]?.modelId}\``,
    `**Device:** ${runs[0]?.device.userAgent ?? "(unknown)"}`,
    `**Transformers.js:** ${runs[0]?.transformersVersion}`,
    `**Ran at:** ${runs[0]?.ranAt}`,
    "",
    "<!-- Run JSON below — do not edit -->",
    "```json",
    JSON.stringify(runs, null, 2),
    "```",
  ].join("\n");

  const params = new URLSearchParams({
    title,
    body,
    labels: "benchmark-submission",
  });

  return `https://github.com/${REPO}/issues/new?${params.toString()}`;
}
