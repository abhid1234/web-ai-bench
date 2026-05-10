import { LessonShell, Prose, Callout, CardGrid, LabAnchor } from "../../components/LessonShell";
import { QuantizationLab } from "../../components/labs/QuantizationLab";

export function Component() {
  return (
    <LessonShell slug="quantization">
      <Prose>
        <p>
          Every weight in a neural network is a number. Train the model and you get hundreds of millions
          of those numbers, stored at 32 bits each. <em>Quantization</em> throws away most of those bits
          while keeping enough precision to preserve the model's behavior. You get back a model that's
          smaller, faster, and runs on hardware the original couldn't touch.
        </p>
        <p>
          For in-browser AI this isn't a polish step, it's the point. A 350M-param model at full fp32 is
          1.4 GB — no browser will download that, no NPU will accept it, no phone has the memory.
          Quantize to int4 and it's 175 MB: small enough to ship, fast enough to feel interactive,
          eligible for the dedicated AI silicon from Lesson 2.
        </p>
        <p>The dtype tour, biggest to smallest:</p>
      </Prose>

      <CardGrid
        cols={2}
        items={[
          {
            label: "fp32 · 4 B/param",
            labelColor: "var(--color-on-surface)",
            labelBg: "var(--color-surface-container)",
            title: "Float32 — training-time",
            body: "Maximum precision, maximum size. Useful as the source of truth for accuracy comparisons. Rarely the right choice for shipping in a browser.",
          },
          {
            label: "fp16 · 2 B/param",
            labelColor: "var(--color-webgpu)",
            labelBg: "var(--color-webgpu-bg)",
            title: "Float16 — half precision",
            body: "Almost always a free win on WebGPU: half the memory, similar speed (modern GPUs run fp16 natively), accuracy loss invisible on classify + embed. Generation needs a careful eye on attention math.",
          },
          {
            label: "int8 · 1 B/param",
            labelColor: "var(--color-webnn)",
            labelBg: "var(--color-webnn-bg)",
            title: "Int8 — post-training",
            body: "Each weight rounded to one of 256 integer values, with a per-tensor scale. The dtype every NPU was designed for. Embeddings + classifiers come out essentially unchanged; generation loses a little fluency but stays usable.",
          },
          {
            label: "int4 · ½ B/param",
            labelColor: "var(--color-tertiary)",
            labelBg: "var(--color-tertiary-container)",
            title: "Int4 — aggressive",
            body: "Two weights per byte. Without quant-aware training, generation models start to repeat themselves. With it (or the q4f16 hybrid), even 1B+ LLMs become viable in 100–200 MB. For embeddings + retrieval, int4 is shockingly cheap.",
          },
        ]}
      />

      <Prose>
        <p>
          The catalog encodes which dtype the harness ships per backend — that's the chip row on every
          model card. WebNN entries usually pick q8 because that's what NPUs accelerate. WebGPU picks
          fp16 or q4f16 to use GPU-native half precision. WASM, on the CPU, takes whatever's available;
          q8 is usually the cold-load + inference sweet spot.
        </p>
      </Prose>

      <Callout>
        <strong>Feel the shrink:</strong> pick a model and watch the bar go from full-width fp32 down to
        a sliver at int4. Numbers are estimated from parameter count — real on-disk sizes run a little
        higher because embeddings and layer-norms stay in higher precision.
      </Callout>

      <LabAnchor>
        <QuantizationLab />
      </LabAnchor>

      <Prose>
        <p>
          One last subtlety: <em>weight precision is not the same as activation precision</em>. The q4f16
          dtype on Qwen2.5 means weights are stored as int4 but inference math runs in fp16 — weights
          dequantize on the fly, trading a little memory for accuracy. Pure q4 keeps everything in 4-bit
          space: faster but more lossy. WebGPU prefers the hybrid; NPUs run pure low-precision because
          that's what the silicon natively does.
        </p>
        <p>
          Fastest way to internalize this: head back to <em>Lesson 5</em>, pick a model where the WebGPU
          dtype differs from the WebNN dtype (Qwen2.5 is the most dramatic), and run it. The cold load
          and inference numbers tell the story the bars only gesture at.
        </p>
        <p>
          That's the curriculum. You now know why on-device AI matters, the three backends, where NPUs
          live, how to pick a model, how to read the matrix, how to run your own bench, and how
          quantization makes any of it fit. Everything you ran was real code on your real device.
        </p>
        <p>
          Take it further: source is open at{" "}
          <a
            href="https://github.com/abhid1234/web-ai-bench"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            github.com/abhid1234/web-ai-bench
          </a>
          . The harness is a few hundred lines of TypeScript; the lessons are the README. Open an issue
          if a model fails on a backend you care about — that's the documentation no one writes, and
          we're writing it.
        </p>
      </Prose>
    </LessonShell>
  );
}
