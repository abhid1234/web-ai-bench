import { LessonShell, Prose, Callout } from "../../components/LessonShell";
import { MatrixLab } from "../../components/labs/MatrixLab";

export function Component() {
  return (
    <LessonShell slug="matrix">
      <Prose>
        <p>
          The compatibility matrix is the table that doesn't exist anywhere else: every model in the catalog crossed
          with every browser backend, populated with real data from real devices. It answers the question every
          developer evaluating in-browser AI has: <em>"will this model work on the backend I want, and how fast?"</em>
        </p>
        <p>
          Reading the grid: green cells passed and show the median inference time. Red cells failed — click for the
          full error message. Empty cells haven't been benchmarked yet on the contributing devices. The matrix mixes
          seeded data (runs from the maintainer's machines) with whatever you've personally added by clicking "Submit
          my run" on Lesson 5. As more people contribute, it gets denser.
        </p>
        <p>
          Why this matters: the Transformers.js documentation tells you what tasks the library supports, the WebNN
          spec tells you what the API looks like, but neither tells you which specific model works on which backend.
          That gap — the documentation that no one writes, but every developer needs — is what the matrix is for.
        </p>
      </Prose>

      <Callout>
        <strong>What you're looking at:</strong> the live data is below. If you don't see WebNN data, your browser
        doesn't expose it (the banner explains which devices do). Click any green cell for the full run record:
        cold load, p50/p95 inference, JS heap delta, output preview, error if any.
      </Callout>

      <MatrixLab />
    </LessonShell>
  );
}
