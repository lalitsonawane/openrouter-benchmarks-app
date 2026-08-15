export type BenchmarkSource = 'artificial-analysis' | 'design-arena' | 'openrouter';
export type TaskType = 'coding' | 'intelligence' | 'agentic';
export type Arena = 'models' | 'builders' | 'agents';

export type BenchmarkFilters = {
  source?: BenchmarkSource | '';
  task_type?: TaskType | '';
  arena?: Arena | '';
  category?: string;
  max_results?: number;
};

export type Pricing = {
  prompt: string;
  completion: string;
} | null;

export type ArtificialAnalysisItem = {
  source: 'artificial-analysis';
  model_permaslug: string;
  display_name: string;
  intelligence_index: number | null;
  coding_index: number | null;
  agentic_index: number | null;
  pricing: Pricing;
};

export type DesignArenaItem = {
  source: 'design-arena';
  model_permaslug: string;
  display_name: string;
  arena: string;
  category: string;
  elo: number;
  win_rate: number;
  avg_generation_time_ms: number | null;
  tournament_stats: {
    first_place: number | null;
    second_place: number | null;
    third_place: number | null;
    fourth_place: number | null;
    total: number | null;
  };
  pricing: Pricing;
};

export type OpenRouterItem = {
  source: 'openrouter';
  model_permaslug: string;
  display_name: string;
  benchmark_type: string;
  accuracy: number | null;
  accuracy_stddev?: number | null;
  avg_cost_per_task?: number | null;
  last_run_timestamp?: string | null;
  total_tasks?: number | null;
  pricing?: Pricing;
};

export type BenchmarkItem =
  | ArtificialAnalysisItem
  | DesignArenaItem
  | OpenRouterItem;

export type UnifiedBenchmarksMeta = {
  as_of: string;
  citation: string | null;
  model_count: number;
  source: BenchmarkSource | null;
  source_url: string | null;
  task_type: string | null;
  version: string;
};

export type UnifiedBenchmarksResponse = {
  data: BenchmarkItem[];
  meta: UnifiedBenchmarksMeta;
};

export const DESIGN_ARENA_CATEGORIES = [
  'codecategories',
  'uicomponent',
  'gamedev',
  '3d',
  'dataviz',
  'image',
  'video',
  'svg',
] as const;
