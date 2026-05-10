import { LessonShell, Prose, Callout, CardGrid, LabAnchor } from "../../components/LessonShell";
import { LiveDemo } from "../../components/LiveDemo";

export function Component() {
  return (
    <LessonShell slug="backends">
      <Prose>
        <p>
          When the browser runs a neural network, it has three real options for where to do the math.
          Each shipped at a different time, targets different hardware, and has a different performance
          profile. You pick the model; the runtime picks the backend.
        </p>
      </Prose>

      <CardGrid
        cols={3}
        items={[
          {
            label: "WASM",
            labelColor: "var(--color-wasm)",
            labelBg: "var(--color-wasm-bg)",
            title: "WebAssembly · CPU",
            body: "The universal fallback. Every modern browser, every device, no flags. ONNX Runtime Web compiles operators to highly-tuned SIMD WASM. For tiny models on a recent laptop, often surprisingly competitive — GPU overhead can't beat it.",
          },
          {
            label: "WebGPU",
            labelColor: "var(--color-webgpu)",
            labelBg: "var(--color-webgpu-bg)",
            title: "Graphics processor",
            body: "Apple Metal, Nvidia CUDA, Qualcomm Adreno — one cross-platform API. Shipped Chrome 113 (May 2023). Wins on medium and larger models where parallelism overcomes the CPU↔GPU buffer cost. Doesn't talk to NPUs.",
          },
          {
            label: "WebNN",
            labelColor: "var(--color-webnn)",
            labelBg: "var(--color-webnn-bg)",
            title: "Neural Processing Unit",
            body: "W3C, Chrome 130+ behind a flag, Edge by default on Copilot+ PCs. Routes to whatever ML accelerator the OS exposes — including the NPU. Powers Google Meet's HD segmentation. The path that beats both WebGPU and WASM on tiny low-precision models.",
          },
        ]}
      />

      <Callout>
        <strong>Run your own comparison:</strong> the demo below runs the picked model across every backend
        your browser supports. Cards for unavailable backends stay dashed with an explanation —
        understanding why a backend is missing is part of the lesson.
      </Callout>

      <LabAnchor>
        <LiveDemo />
      </LabAnchor>

      <Prose>
        <p>What to notice as you swap models:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <span className="font-semibold">Cold load dominates.</span> First inference includes weight
            download + JIT-compile. Models cache after first load; refresh runs faster.
          </li>
          <li>
            <span className="font-semibold">The fastest backend isn't fixed.</span> WASM often wins for
            tiny models; WebGPU pulls ahead on bigger ones; WebNN+NPU wins on quantized models when the
            silicon exists.
          </li>
          <li>
            <span className="font-semibold">Failure is also a signal.</span> When a backend fails, the
            matrix in Lesson 4 captures the exact error so future visitors can see what doesn't work
            today — and what got fixed.
          </li>
        </ul>
      </Prose>
    </LessonShell>
  );
}
