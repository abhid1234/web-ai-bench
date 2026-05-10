import { LessonShell, Prose, Callout } from "../../components/LessonShell";
import { NPUDetectionLab } from "../../components/labs/NPUDetectionLab";

export function Component() {
  return (
    <LessonShell slug="npu">
      <Prose>
        <p>
          A Neural Processing Unit (NPU) is a chip built for one thing: matrix multiplication on low-precision
          integers. It's not a CPU, not a GPU, not a TPU — it's silicon designed specifically to run quantized
          neural networks at low power, on-device, with minimal heat. Every smartphone shipped in the last three
          years has one, and almost nothing on the web reaches it.
        </p>
        <p>The NPU landscape today, by vendor:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <span className="font-semibold">Qualcomm Hexagon</span> — ships in Snapdragon (Android phones, Snapdragon X
            Elite Windows laptops). The most-deployed NPU on the planet.
          </li>
          <li>
            <span className="font-semibold">Apple Neural Engine (ANE)</span> — every iPhone since X (2017), every M-series
            Mac. Powers Face ID, Live Text, on-device Siri.
          </li>
          <li>
            <span className="font-semibold">Google Tensor TPU</span> — Pixel 6+ phones. Same lineage as the cloud TPU,
            shrunk for mobile.
          </li>
          <li>
            <span className="font-semibold">MediaTek APU (NeuroPilot)</span> — Dimensity SoCs, in most non-Samsung
            non-Pixel Android phones globally.
          </li>
          <li>
            <span className="font-semibold">Intel NPU</span> — Lunar Lake (Copilot+ PCs), part of Core Ultra.
          </li>
          <li>
            <span className="font-semibold">AMD Ryzen AI</span> — XDNA NPU, Strix Point laptops.
          </li>
        </ul>
        <p>
          Each vendor has its own SDK (CoreML, NNAPI, DirectML, NeuroPilot, OpenVINO). For a long time, that meant
          shipping AI to a device required writing the same model six times. WebNN is the W3C standard that
          changed that — one browser API that routes to whichever NPU the OS exposes. The same JavaScript code lights up
          Hexagon on Snapdragon, NNAPI's underlying driver on Tensor, the AMD NPU on a Strix laptop.
        </p>
      </Prose>

      <Callout>
        <strong>Detection on your device, right now:</strong> the lab below probes <code className="font-mono text-xs">navigator.ml.createContext({"{ deviceType: 'npu' }"})</code>
        {" "}and reports what the browser actually exposes. If you see "⚡ NPU" you're holding the path that powers
        Google Meet's segmentation. If you don't, the lab tells you which device + browser combination would.
      </Callout>

      <NPUDetectionLab />

      <Prose>
        <p>
          WebNN isn't the fastest backend everywhere — it isn't. What it is, is the only browser API that{" "}
          <em>can</em> reach the NPU. Without it, on-device AI in the browser tops out at GPU speed; with it, the
          same code that runs in Chrome on a Mac runs at native-app speed on a Pixel. That's the step change.
        </p>
      </Prose>
    </LessonShell>
  );
}
