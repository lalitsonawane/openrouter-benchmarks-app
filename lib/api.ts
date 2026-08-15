import type {
  BenchmarkFilters,
  BenchmarkItem,
  UnifiedBenchmarksResponse,
} from './types';

const API_BASE = 'https://openrouter.ai/api/v1';

export class OpenRouterApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'OpenRouterApiError';
    this.status = status;
  }
}

function buildQuery(filters: BenchmarkFilters): string {
  const params = new URLSearchParams();
  if (filters.source) params.set('source', filters.source);
  if (filters.task_type) params.set('task_type', filters.task_type);
  if (filters.arena) params.set('arena', filters.arena);
  if (filters.category?.trim()) params.set('category', filters.category.trim());
  if (filters.max_results && filters.max_results > 0) {
    params.set('max_results', String(filters.max_results));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function listBenchmarks(
  apiKey: string,
  filters: BenchmarkFilters = {},
): Promise<UnifiedBenchmarksResponse> {
  const response = await fetch(`${API_BASE}/benchmarks${buildQuery(filters)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      'HTTP-Referer': 'https://github.com/lalitsonawane/openrouter-benchmarks-app',
      'X-Title': 'OpenRouter Benchmarks App',
    },
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body?.error?.message || body?.message || message;
    } catch {
      // ignore parse errors
    }
    throw new OpenRouterApiError(message, response.status);
  }

  return response.json() as Promise<UnifiedBenchmarksResponse>;
}

export function primaryScore(
  item: BenchmarkItem,
  taskType?: string,
): { label: string; value: number | null } {
  if (item.source === 'artificial-analysis') {
    if (taskType === 'coding') {
      return { label: 'Coding', value: item.coding_index };
    }
    if (taskType === 'agentic') {
      return { label: 'Agentic', value: item.agentic_index };
    }
    return { label: 'Intelligence', value: item.intelligence_index };
  }

  if (item.source === 'design-arena') {
    return { label: 'ELO', value: item.elo };
  }

  return {
    label: item.benchmark_type?.replace(/_/g, ' ') || 'Accuracy',
    value: item.accuracy,
  };
}

export function formatPrice(value: string | null | undefined): string {
  if (!value) return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  if (n === 0) return 'Free';
  return `$${n.toFixed(n < 0.001 ? 6 : 4)}`;
}

export function sourceLabel(source: string): string {
  switch (source) {
    case 'artificial-analysis':
      return 'Artificial Analysis';
    case 'design-arena':
      return 'Design Arena';
    case 'openrouter':
      return 'OpenRouter';
    default:
      return source;
  }
}
