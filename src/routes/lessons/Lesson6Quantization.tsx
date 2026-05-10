import { LessonShell, Prose, Callout } from "../../components/LessonShell";
import { QuantizationLab } from "../../components/labs/QuantizationLab";

export function Component() {
  return (
    <LessonShell slug="quantization">
      <Prose>
        <p>
          Every weight in a neural network is a number. Train the model and you get hundreds of millions
          of those numbers, stored at 32 bits each. <em>Quantization</em> is the trick of throwing away
          most of those bits — keeping only enough precision to preserve the model's behavior — and
          getting back a model that's smaller, faster, and runs on hardware the original couldn't touch.
        </p>
        <p>
          For in-browser AI this isn't a polish step, it's the point. A 350M-parameter model at full fp32
          is 1.4 GB. No browser will download that, no NPU will accept it, no phone has the memory.
          Quantize the same model to int4 and it's 175 MB — small enough to ship, fast enough to feel
          interactive, eligible for the dedicated AI silicon you read about in Lesson 2.
        </p>
        <p>The dtype tour, from biggest to smallest:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <span className="font-semibold">Float32 (4 bytes/param)</span> — what the model trained as.
            Maximum precision, maximum size. Useful as the source of truth for accuracy comparisons,
            rarely the right choice for shipping in a browser.
          </li>
          <li>
            <span className="font-semibold">Float16 (2 bytes/param)</span> — half precision. Almost
            always a free win on WebGPU: half the memory, similar speed (modern GPUs run fp16
            natively), and accuracy loss small enough to be invisible on classification + embedding
            tasks. Generation models need a careful eye on attention math.
          </li>
          <li>
            <span className="font-semibold">Int8 (1 byte/param)</span> — post-training quantization.
            Each weight rounded to one of 256 integer values, with a per-tensor or per-channel scale
            factor. This is the dtype every NPU was designed for. Embeddings + classifiers come out
            essentially unchanged; generation models lose a little fluency but stay usable.
          </li>
          <li>
            <span className="font-semibold">Int4 (½ byte/param)</span> — aggressive. Two weights per
            byte. Without quant-aware training, generation models start to repeat themselves and lose
            coherence. With it (or with the q4f16 hybrid that keeps activations in fp16), even 1B+
            LLMs become viable in 100–200 MB. For embeddings + retrieval, int4 is shockingly cheap.
          </li>
        </ul>
        <p>
          The catalog encodes which dtype <em>this</em> harness ships per backend — that's the chip row
          on every model card. WebNN entries usually pick q8 because that's the dtype the NPU
          actually accelerates. WebGPU entries pick fp16 or q4f16 to take advantage of GPU-native
          half-precision math. WASM, running on the CPU, can take whatever's available; q8 is usually
          the sweet spot for cold-load + inference.
        </p>
      </Prose>

      <Callout>
        <strong>Feel the shrink:</strong> pick a model and watch the bar go from full-width fp32 down
        to a sliver at int4. The numbers are estimated from the model's parameter count — real on-disk
        sizes run a little higher because embeddings and layer-norms stay in higher precision.
      </Callout>

      <QuantizationLab />

      <Prose>
        <p>
          One last subtlety: <em>weight precision is not the same as activation precision</em>. The
          q4f16 dtype on Qwen2.5 means the weights are stored as int4 but the math during inference
          runs in fp16 — the weights are dequantized on the fly, which trades a little memory for
          accuracy. Pure q4 keeps everything in 4-bit space, which is faster but more lossy. WebGPU
          tends to prefer the hybrid; NPUs run pure low-precision because that's what the silicon
          natively does.
        </p>
        <p>
          The fastest way to internalize this: head back to <em>Lesson 5 — Run your own bench</em>, pick
          a model where the WebGPU dtype differs from the WebNN dtype (Qwen2.5 is the most dramatic),
          and run it. The cold load and inference numbers tell the story the bars above can only
          gesture at.
        </p>
        <p>
          That's the curriculum. You now know why on-device AI matters, how the browser exposes three
          backends, where NPUs live and how WebNN reaches them, how to pick a model, how to read the
          matrix, how to run your own bench, and how quantization makes any of it fit. Everything you
          ran was real code on your real device.
        </p>
        <p>
          If you want to take this further: the source is open at{" "}
          <a
            href="https://github.com/abhid1234/web-ai-bench"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            github.com/abhid1234/web-ai-bench
          </a>
          . The harness is a few hundred lines of TypeScript; the lessons are the README. Open an
          issue if a model fails on a backend you care about — that's the documentation no one writes,
          and we're writing it.
        </p>
      </Prose>
    </LessonShell>
  );
}
