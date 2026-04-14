/**
 * Dynamic CDN loader for Transformers.js. Never bundled — keeps the main
 * SPA chunk small and lets the visitor's browser cache the runtime across
 * sessions and across other Transformers.js sites.
 *
 * Pinned to an exact version so /matrix data is comparable across runs.
 * Version bump = new column in the matrix, not a silent regression.
 */

export const TRANSFORMERS_VERSION = "3.3.3";
const TRANSFORMERS_CDN = `https://cdn.jsdelivr.net/npm/@huggingface/transformers@${TRANSFORMERS_VERSION}/+esm`;

let cached: TransformersModule | null = null;
let loading: Promise<TransformersModule> | null = null;

export interface TransformersModule {
  pipeline: (
    task: string,
    model: string,
    options?: Record<string, unknown>,
  ) => Promise<TransformersPipeline>;
  env?: { allowRemoteModels?: boolean; allowLocalModels?: boolean };
}

export type TransformersPipeline = ((
  input: unknown,
  options?: Record<string, unknown>,
) => Promise<unknown>) & {
  dispose?: () => Promise<void>;
};

export async function loadTransformers(): Promise<TransformersModule> {
  if (cached) return cached;
  if (loading) return loading;

  loading = (async () => {
    // /* @vite-ignore */ keeps Vite from trying to bundle the URL.
    const mod = (await import(/* @vite-ignore */ TRANSFORMERS_CDN)) as TransformersModule;
    cached = mod;
    return mod;
  })();

  return loading;
}
