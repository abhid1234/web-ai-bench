import { LessonShell, Prose, Callout, CardGrid, LabAnchor } from "../../components/LessonShell";
import { NPUDetectionLab } from "../../components/labs/NPUDetectionLab";

export function Component() {
  return (
    <LessonShell slug="npu">
      <Prose>
        <p>
          A Neural Processing Unit (NPU) is a chip built for one thing: matrix multiplication on
          low-precision integers. Not a CPU, not a GPU, not a TPU — silicon designed to run quantized
          neural networks at low power, on-device, with minimal heat. Every smartphone shipped in the
          last three years has one, and almost nothing on the web reaches it.
        </p>
        <p>The NPU landscape today, by vendor:</p>
      </Prose>

      <CardGrid
        cols={3}
        items={[
          {
            label: "Qualcomm",
            title: "Hexagon",
            body: "Snapdragon (Android phones, Snapdragon X Elite Windows laptops). The most-deployed NPU on the planet.",
          },
          {
            label: "Apple",
            title: "Neural Engine (ANE)",
            body: "Every iPhone since X (2017), every M-series Mac. Powers Face ID, Live Text, on-device Siri.",
          },
          {
            label: "Google",
            title: "Tensor TPU",
            body: "Pixel 6+ phones. Same lineage as the cloud TPU, shrunk for mobile.",
          },
          {
            label: "MediaTek",
            title: "APU (NeuroPilot)",
            body: "Dimensity SoCs — most non-Samsung non-Pixel Android phones globally.",
          },
          {
            label: "Intel",
            title: "Intel NPU",
            body: "Lunar Lake (Copilot+ PCs), part of Core Ultra.",
          },
          {
            label: "AMD",
            title: "Ryzen AI (XDNA)",
            body: "Strix Point laptops.",
          },
        ]}
      />

      <Prose>
        <p>
          Each vendor has its own SDK (CoreML, NNAPI, DirectML, NeuroPilot, OpenVINO). For a long time
          that meant shipping AI to a device required writing the same model six times. WebNN is the W3C
          standard that changed it — one browser API that routes to whichever NPU the OS exposes. The
          same JavaScript lights up Hexagon on Snapdragon, Tensor on a Pixel, AMD's NPU on Strix.
        </p>
      </Prose>

      <Callout>
        <strong>Detection on your device:</strong> the lab probes{" "}
        <code className="font-mono text-xs">navigator.ml.createContext({"{ deviceType: 'npu' }"})</code>{" "}
        and reports what the browser exposes. If you see "⚡ NPU" you're holding the path that powers
        Google Meet's segmentation. If not, the lab tells you which device + browser would.
      </Callout>

      <LabAnchor>
        <NPUDetectionLab />
      </LabAnchor>

      <Prose>
        <p>
          WebNN isn't the fastest backend everywhere — it isn't. What it is, is the only browser API that{" "}
          <em>can</em> reach the NPU. Without it, on-device AI in the browser tops out at GPU speed; with
          it, the same code that runs in Chrome on a Mac runs at native-app speed on a Pixel.
        </p>
      </Prose>
    </LessonShell>
  );
}
