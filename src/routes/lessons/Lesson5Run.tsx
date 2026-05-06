import { LessonShell, Prose, Callout } from "../../components/LessonShell";
import { BenchLab } from "../../components/labs/BenchLab";

export function Component() {
  return (
    <LessonShell slug="run">
      <Prose>
        <p>
          The five lessons before this one were the theory. This one is the lab — the same harness that produced the
          numbers in the matrix, exposed for you to drive. Pick any model from the catalog, click run, and watch the
          three backends race on your hardware.
        </p>
        <p>What happens when you click <em>Run All Backends</em>:</p>
        <ol className="ml-5 list-decimal space-y-1.5">
          <li>The harness detects which backends your browser exposes.</li>
          <li>
            For each backend, it loads the model fresh, warms up, then runs five inference passes. Cold load and
            p50/p95 inference latency are captured.
          </li>
          <li>JS heap before and after are diffed; the output preview is captured for sanity-checking.</li>
          <li>
            If a backend fails — version mismatch, OOM, missing op — the error message is captured and shown in red.
            Failures are valuable data.
          </li>
          <li>Each completed run is saved to your browser's IndexedDB and shown on Lesson 4's matrix.</li>
        </ol>
        <p>
          When the run finishes, click <em>Submit my run</em>. It opens a prefilled GitHub Issue with the run JSON in
          a code block. The maintainer reviews, merges good submissions into the seeded dataset, and your numbers
          start appearing on every visitor's matrix.
        </p>
      </Prose>

      <Callout kind="warning">
        <strong>Heads up on memory:</strong> running multiple models in a row builds up heap and GPU buffers that
        the browser doesn't always release. The "Free Browser Memory" button below reloads the page (your IndexedDB
        runs are kept). Use it between runs of large models if your tab feels sluggish.
      </Callout>

      <BenchLab />

      <Prose>
        <p>
          That's the curriculum. You now know why on-device AI matters, how the browser exposes three backends,
          where NPUs live and how WebNN reaches them, how to pick a model, how to read the matrix, and how to
          contribute back. Everything you ran was real code on your real device.
        </p>
        <p>
          If you want to take this further: the source is open at{" "}
          <a
            href="https://github.com/abhid1234/web-ai-bench"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            github.com/abhid1234/web-ai-bench
          </a>
          . The harness is a few hundred lines of TypeScript; the lessons are the README. Open an issue if a model
          fails on a backend you care about — that's the documentation no one writes, and we're writing it.
        </p>
      </Prose>
    </LessonShell>
  );
}
