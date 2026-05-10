import { LessonShell, Prose, Callout, LabAnchor } from "../../components/LessonShell";
import { BenchLab } from "../../components/labs/BenchLab";

export function Component() {
  return (
    <LessonShell slug="run">
      <Prose>
        <p>
          The lessons before this one were the theory. This one is the lab — the same harness that
          produced the matrix numbers, exposed for you to run. Pick any model from the catalog, click
          run, watch the three backends race on your hardware.
        </p>
        <p>What happens when you click <em>Run All Backends</em>:</p>
        <ol className="ml-5 list-decimal space-y-1.5">
          <li>The harness detects which backends your browser exposes.</li>
          <li>For each backend: load model fresh, warm up, run five inference passes. Cold load + p50/p95 captured.</li>
          <li>JS heap before/after diffed. Output preview captured for sanity-checking.</li>
          <li>If a backend fails (version mismatch, OOM, missing op), the error is captured and shown in red. Failures are valuable data.</li>
          <li>Each completed run saves to your IndexedDB and shows on Lesson 4's matrix.</li>
        </ol>
        <p>
          When the run finishes, click <em>Submit my run</em>. It opens a prefilled GitHub Issue with the
          run JSON. The maintainer reviews, merges good submissions into the seeded dataset, and your
          numbers start appearing on every visitor's matrix.
        </p>
      </Prose>

      <Callout kind="warning">
        <strong>Heads up on memory:</strong> running multiple models in a row builds up heap and GPU
        buffers the browser doesn't always release. The "Free Browser Memory" button below reloads the
        page (your IndexedDB runs are kept). Use it between large runs if your tab feels sluggish.
      </Callout>

      <LabAnchor>
        <BenchLab />
      </LabAnchor>

      <Prose>
        <p>
          One axis is left to unpack: the <em>quantization</em> column on every model card. It's the
          reason any of this fits in a browser at all, and the reason WebNN routes int8 to the NPU but
          not fp32. That's Lesson 6.
        </p>
      </Prose>
    </LessonShell>
  );
}
