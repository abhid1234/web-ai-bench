import type { ModelEntry, RunResult } from "./types";
import modelsData from "../../data/models.json";
import seededRunsData from "../../data/runs.json";

export const MODELS = modelsData as ModelEntry[];
export const SEEDED_RUNS = seededRunsData as RunResult[];

export function getModelById(id: string): ModelEntry | undefined {
  return MODELS.find((m) => m.id === id);
}
