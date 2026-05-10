import { LessonShell, Prose, Callout, LabAnchor } from "../../components/LessonShell";
import { MatrixLab } from "../../components/labs/MatrixLab";

export function Component() {
  return (
    <LessonShell slug="matrix">
      <Prose>
        <p>
          The compatibility matrix is every model in the catalog crossed with every browser backend,
          populated with real data from real devices. It answers the question every developer evaluating
          in-browser AI ends up asking: <em>"will this model work on the backend I want, and how fast?"</em>
        </p>
        <p>
          Reading the grid: green cells passed and show median inference time. Red cells failed — click
          for the full error. Empty cells haven't been benchmarked yet on contributing devices. Mixes
          maintainer-seeded data with whatever you've added by clicking <em>Submit my run</em> on Lesson
          5. As more people contribute, it gets denser.
        </p>
        <p>
          Why this matters: Transformers.js documents what the library supports, the WebNN spec documents
          the API, but neither tells you which specific model works on which backend. That gap — the
          documentation no one writes, but every developer needs — is what the matrix is for.
        </p>
      </Prose>

      <Callout>
        <strong>What you're looking at:</strong> live data below. If WebNN is missing, your browser
        doesn't expose it (banner explains which devices do). Click any green cell for the full run
        record: cold load, p50/p95, JS heap delta, output preview, error if any.
      </Callout>

      <LabAnchor>
        <MatrixLab />
      </LabAnchor>
    </LessonShell>
  );
}
