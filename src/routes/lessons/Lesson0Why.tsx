import { LessonShell, Prose, Callout } from "../../components/LessonShell";
import { LiveDemo } from "../../components/LiveDemo";

export function Component() {
  return (
    <LessonShell slug="why">
      <Prose>
        <p>
          Most AI you've used in the last two years runs in someone else's data center. You type a prompt in a browser
          tab; it travels to a GPU cluster; an answer comes back. That model worked. The economics didn't —
          for the company paying GPU bills, for you waiting on round-trips, for anyone whose data shouldn't have left the device.
        </p>
        <p>
          On-device AI flips the question. Instead of asking <em>"how do we get the user's data to the model?"</em>{" "}
          you ask <em>"how do we get the model to the user?"</em> The browser turns out to be a great answer:
          it's already installed, it's sandboxed, it talks to the CPU, GPU, and (on newer devices) the dedicated
          NPU, and the model only needs to be downloaded once.
        </p>
        <p>The case is concrete:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <span className="font-semibold">Privacy.</span> Your photo, voice, or document never leaves the device. No
            audit, no compliance review, no breach surface.
          </li>
          <li>
            <span className="font-semibold">Latency.</span> 5–50 ms inference vs. 200–800 ms for a cloud round-trip.
            Real-time UX (live captioning, video segmentation, autocomplete) only works at the lower bound.
          </li>
          <li>
            <span className="font-semibold">Cost.</span> Inference cost is the user's electricity, not your GPU lease.
            For high-volume features (search-as-you-type, transcription) the cloud bill stops scaling with users.
          </li>
          <li>
            <span className="font-semibold">Offline.</span> Works on the train, on a plane, in a basement, in a country
            where your cloud provider has no region.
          </li>
        </ul>
      </Prose>

      <Callout>
        <strong>Watch this:</strong> the card below loaded a 23 MB sentence-embedding model the moment you arrived on
        this page and ran it three times across every backend your browser exposes. That happened in your browser, on
        your CPU/GPU/NPU, with zero round-trips. Pick a different model from the dropdown to feel the cost shape change.
      </Callout>

      <LiveDemo />

      <Prose>
        <p>
          The numbers above are <em>real</em> — the actual median inference latency on your machine right now, not a
          marketing screenshot. The rest of this curriculum unpacks how that's possible: which APIs the browser
          exposes (Lesson 1), how those APIs reach the dedicated AI silicon on modern devices (Lesson 2), how to pick
          a model that actually fits (Lesson 3), how every model × every backend looks across the internet
          (Lesson 4), how to run your own bench (Lesson 5), and the quantization tricks that make any of this fit
          in a browser (Lesson 6).
        </p>
      </Prose>
    </LessonShell>
  );
}
