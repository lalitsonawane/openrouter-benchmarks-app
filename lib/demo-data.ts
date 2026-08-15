import type { ArtificialAnalysisItem, DesignArenaItem, OpenRouterItem, UnifiedBenchmarksResponse } from './types';

const sampleAA: ArtificialAnalysisItem[] = [
  {
    source: 'artificial-analysis',
    model_permaslug: 'openai/gpt-4o',
    display_name: 'GPT-4o',
    intelligence_index: 71.2,
    coding_index: 65.8,
    agentic_index: 58.3,
    pricing: { prompt: '0.0000025', completion: '0.00001' },
  },
  {
    source: 'artificial-analysis',
    model_permaslug: 'anthropic/claude-sonnet-4',
    display_name: 'Claude Sonnet 4',
    intelligence_index: 74.1,
    coding_index: 72.4,
    agentic_index: 66.9,
    pricing: { prompt: '0.000003', completion: '0.000015' },
  },
  {
    source: 'artificial-analysis',
    model_permaslug: 'google/gemini-2.5-pro',
    display_name: 'Gemini 2.5 Pro',
    intelligence_index: 76.0,
    coding_index: 70.2,
    agentic_index: 64.5,
    pricing: { prompt: '0.00000125', completion: '0.00001' },
  },
];

const sampleDA: DesignArenaItem[] = [
  {
    source: 'design-arena',
    model_permaslug: 'openai/gpt-4o',
    display_name: 'GPT-4o',
    arena: 'models',
    category: 'codecategories',
    elo: 1284,
    win_rate: 0.61,
    avg_generation_time_ms: 4200,
    tournament_stats: {
      first_place: 42,
      second_place: 31,
      third_place: 18,
      fourth_place: 9,
      total: 100,
    },
    pricing: { prompt: '0.0000025', completion: '0.00001' },
  },
];

const sampleOR: OpenRouterItem[] = [
  {
    source: 'openrouter',
    model_permaslug: 'openai/gpt-4o',
    display_name: 'GPT-4o',
    benchmark_type: 'gpqa_diamond',
    accuracy: 0.72,
    accuracy_stddev: 0.03,
    avg_cost_per_task: 0.002,
    last_run_timestamp: '2026-06-03T12:00:00Z',
    total_tasks: 300,
  },
];

export function getDemoBenchmarks(source?: string): UnifiedBenchmarksResponse {
  let data = [...sampleAA, ...sampleDA, ...sampleOR];
  if (source === 'artificial-analysis') data = sampleAA;
  if (source === 'design-arena') data = sampleDA;
  if (source === 'openrouter') data = sampleOR;

  return {
    data,
    meta: {
      as_of: new Date().toISOString(),
      citation: 'Demo data for offline preview — replace with live OpenRouter results.',
      model_count: data.length,
      source: (source as UnifiedBenchmarksResponse['meta']['source']) || null,
      source_url: 'https://openrouter.ai/docs/api/api-reference/benchmarks/list-benchmarks',
      task_type: null,
      version: 'v1',
    },
  };
}
