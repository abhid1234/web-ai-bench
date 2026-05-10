import { LessonShell, Prose, Callout, LabAnchor } from "../../components/LessonShell";
import { LiveDemo } from "../../components/LiveDemo";

export function Component() {
  return (
    <LessonShell slug="why">
      <Prose>
        <p>
          Most AI you've used in the last two years runs in someone else's data center. You type, it travels
          to a GPU cluster, an answer comes back. The model worked. The economics didn't — for the company
          paying GPU bills, for you waiting on round-trips, for anyone whose data shouldn't have left the
          device.
        </p>
        <p>
          On-device AI flips the question. Instead of <em>"how do we get the user's data to the model?"</em>{" "}
          you ask <em>"how do we get the model to the user?"</em> The browser is a great answer: already
          installed, sandboxed, talks to the CPU, GPU, and (on newer devices) the dedicated NPU. The model
          downloads once.
        </p>
        <p>The case is concrete:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <span className="font-semibold">Privacy.</span> Photo, voice, document never leaves the device.
            No audit, no compliance review, no breach surface.
          </li>
          <li>
            <span className="font-semibold">Latency.</span> 5–50 ms inference vs. 200–800 ms cloud
            round-trip. Real-time UX (live caption, segmentation, autocomplete) only works at the lower bound.
          </li>
          <li>
            <span className="font-semibold">Cost.</span> Inference cost is the user's electricity, not your
            GPU lease. The cloud bill stops scaling with users.
          </li>
          <li>
            <span className="font-semibold">Offline.</span> Works on a train, plane, basement, country where
            your cloud provider has no region.
          </li>
        </ul>
      </Prose>

      <Callout>
        <strong>Watch this:</strong> the card below loaded a 23 MB sentence-embedding model the moment you
        arrived and ran it across every backend your browser exposes. Pick a different model from the
        dropdown to feel the cost shape change.
      </Callout>

      <LabAnchor>
        <LiveDemo />
      </LabAnchor>

      <Prose>
        <p>
          Those numbers are real — actual median inference latency on your machine, not a marketing
          screenshot. The rest of the curriculum unpacks how: the three backends the browser exposes
          (Lesson 1), how those reach AI silicon (Lesson 2), how to pick a model (Lesson 3), how every
          model × backend looks across devices (Lesson 4), how to run your own bench (Lesson 5), and the
          quantization tricks that make any of it fit in a browser (Lesson 6).
        </p>
      </Prose>
    </LessonShell>
  );
}
