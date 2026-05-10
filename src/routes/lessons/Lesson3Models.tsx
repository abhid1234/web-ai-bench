import { LessonShell, Prose, Callout } from "../../components/LessonShell";
import { ModelCatalogLab } from "../../components/labs/ModelCatalogLab";
import { MODELS } from "../../lib/catalog";

export function Component() {
  return (
    <LessonShell slug="models">
      <Prose>
        <p>
          Picking a model for in-browser AI is a four-axis decision: <em>task</em> (what does it do), <em>size</em>{" "}
          (will it fit in browser memory), <em>quantization</em> (precision vs. speed/memory), and <em>format</em>{" "}
          (does Transformers.js understand it). Get any one wrong and the model either fails to load or runs
          unusably slowly. Lesson 6 goes deep on the quantization axis specifically.
        </p>
        <p>
          <span className="font-semibold">Task family</span> determines the pipeline. The catalog covers six:
          embedding (turns text into a vector), classification (text or image into a label),
          vision-classification (mobilenet-style), multimodal embedding (CLIP-style: image and text into the same
          vector space), ASR (speech-to-text), and generation (autoregressive text). Each has different inputs,
          different output shapes, and different performance characteristics.
        </p>
        <p>
          <span className="font-semibold">Size</span> is the number of bytes the model weighs on disk in the chosen
          dtype. A 100 MB model takes ~100 MB to download (cached after that), then ~150–300 MB of runtime memory
          once loaded into a backend's working buffers. Anything over 500 MB is risky on phone browsers.
        </p>
        <p>
          <span className="font-semibold">Quantization</span> trades precision for speed and memory. fp32 is the
          training-time precision; fp16 halves memory at minor accuracy cost; q8 (8-bit) and q4 (4-bit) shrink
          dramatically — and crucially, <em>NPUs only run quantized models</em>. The dtype recommendation per
          backend in the catalog reflects this: WebNN entries usually want q8, WebGPU and WASM can take fp32 or fp16.
        </p>
      </Prose>

      <Callout>
        <strong>Browse the catalog:</strong> {MODELS.length} models, each with the recommended dtype per backend, the
        Hugging Face source link, and any{" "}
        <code className="font-mono text-xs">freeDimensionOverrides</code> the model needs to compile in WebNN. The
        bench picker in Lesson 5 draws from this exact list.
      </Callout>

      <ModelCatalogLab />
    </LessonShell>
  );
}
