import { LessonShell, Prose, Callout } from "../../components/LessonShell";
import { LiveDemo } from "../../components/LiveDemo";

export function Component() {
  return (
    <LessonShell slug="backends">
      <Prose>
        <p>
          When the browser runs a neural network, it has three real options for where to do the math. They've shipped
          at different times, they target different hardware, and they have very different performance shapes. You
          almost never pick one — you pick the model and let the runtime choose. But to read a benchmark, you have to
          know what each one is.
        </p>
        <p>
          <span className="font-semibold">WASM</span> (WebAssembly) runs on the CPU. It's the universal fallback —
          works in every modern browser, every device, no flags. ONNX Runtime Web compiles model operators to
          highly-tuned SIMD WASM. For small models (under ~50 MB) on a recent laptop CPU, WASM is often surprisingly
          competitive — the GPU has too much overhead to beat it.
        </p>
        <p>
          <span className="font-semibold">WebGPU</span> exposes the device's graphics processor — Apple's Metal, Nvidia's
          CUDA, Qualcomm's Adreno, all behind one cross-platform API. Shipped in Chrome 113 (May 2023). Wins on
          medium-and-larger models where the parallelism overcomes the CPU↔GPU buffer cost. Doesn't talk to NPUs.
        </p>
        <p>
          <span className="font-semibold">WebNN</span> is the newest of the three (W3C, ships in Chrome 130+ behind a
          flag, Edge by default on Copilot+ PCs). It's the one designed specifically for AI: it routes to whatever
          accelerator the OS exposes for ML — CPU, GPU, or <em>NPU</em>. On an Android Pixel, WebNN goes through
          NNAPI to the Tensor NPU. On a Snapdragon X Elite Windows machine, it goes through DirectML to the Hexagon
          NPU. That's the path that beats both WebGPU and WASM on tiny low-precision models — and the path that
          enables the demos in Google Meet's HD segmentation.
        </p>
      </Prose>

      <Callout>
        <strong>Run your own comparison:</strong> the live demo below picks a model and runs it across every backend
        your browser supports. Cards for backends your browser doesn't expose stay dashed with an explanation —
        understanding why a backend is missing is part of the lesson.
      </Callout>

      <LiveDemo />

      <Prose>
        <p>
          A few things to notice as you swap models:
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <span className="font-semibold">Cold load dominates.</span> The first inference also includes downloading
            the model weights and JIT-compiling shaders or kernels. Models cache after first load, so a refresh runs
            faster.
          </li>
          <li>
            <span className="font-semibold">The fastest backend isn't fixed.</span> WASM often wins for tiny models;
            WebGPU pulls ahead on bigger ones; WebNN+NPU wins on quantized models when the silicon exists.
          </li>
          <li>
            <span className="font-semibold">Failure is also a signal.</span> When a backend fails, the matrix in
            Lesson 4 captures the exact error so future visitors can see what doesn't work today — and what got fixed.
          </li>
        </ul>
      </Prose>
    </LessonShell>
  );
}
