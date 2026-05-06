export interface Lesson {
  number: number;
  slug: string;
  path: string;
  title: string;
  oneLiner: string;
  kicker: string;
}

export const LESSONS: Lesson[] = [
  {
    number: 0,
    slug: "why",
    path: "/learn/why",
    title: "Why on-device AI",
    oneLiner: "The case for running models in the browser instead of the cloud.",
    kicker: "Privacy, latency, cost",
  },
  {
    number: 1,
    slug: "backends",
    path: "/learn/backends",
    title: "Three browser backends",
    oneLiner: "WebNN, WebGPU, and WASM — what each is, when each wins.",
    kicker: "WebNN · WebGPU · WASM",
  },
  {
    number: 2,
    slug: "npu",
    path: "/learn/npu",
    title: "NPUs and where they live",
    oneLiner: "Hexagon, Neural Engine, MediaTek APU, Tensor — and how WebNN routes to them.",
    kicker: "Hardware acceleration",
  },
  {
    number: 3,
    slug: "models",
    path: "/learn/models",
    title: "Picking a model",
    oneLiner: "Task families, model size, quantization, and dtype trade-offs per backend.",
    kicker: "Model catalog",
  },
  {
    number: 4,
    slug: "matrix",
    path: "/learn/matrix",
    title: "The compatibility matrix",
    oneLiner: "Every model × every backend in one grid — the documentation no one writes.",
    kicker: "Cross-device data",
  },
  {
    number: 5,
    slug: "run",
    path: "/learn/run",
    title: "Run your own bench",
    oneLiner: "Pick anything from the catalog, run it on your device, contribute to the dataset.",
    kicker: "The lab",
  },
];

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getNextLesson(slug: string): Lesson | undefined {
  const idx = LESSONS.findIndex((l) => l.slug === slug);
  if (idx === -1 || idx === LESSONS.length - 1) return undefined;
  return LESSONS[idx + 1];
}

export function getPrevLesson(slug: string): Lesson | undefined {
  const idx = LESSONS.findIndex((l) => l.slug === slug);
  if (idx <= 0) return undefined;
  return LESSONS[idx - 1];
}
