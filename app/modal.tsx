import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { palette, typography } from '@/constants/theme';
import { formatPrice, primaryScore, sourceLabel } from '@/lib/api';
import type { BenchmarkItem } from '@/lib/types';

export default function ModelDetailModal() {
  const { payload, taskType } = useLocalSearchParams<{ payload?: string; taskType?: string }>();

  let item: BenchmarkItem | null = null;
  try {
    item = payload ? (JSON.parse(payload) as BenchmarkItem) : null;
  } catch {
    item = null;
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No model selected.</Text>
      </View>
    );
  }

  const score = primaryScore(item, taskType || undefined);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <StatusBar style="dark" />
      <Text style={styles.brand}>Benchline</Text>
      <Text style={styles.title}>{item.display_name}</Text>
      <Text style={styles.slug}>{item.model_permaslug}</Text>

      <View style={styles.scoreCard}>
        <Text style={styles.scoreValue}>
          {score.value == null
            ? '—'
            : item.source === 'openrouter'
              ? `${(score.value * 100).toFixed(1)}%`
              : score.value.toFixed(1)}
        </Text>
        <Text style={styles.scoreLabel}>{score.label}</Text>
        <Text style={styles.source}>{sourceLabel(item.source)}</Text>
      </View>

      {item.source === 'artificial-analysis' ? (
        <View style={styles.grid}>
          <Metric label="Intelligence" value={item.intelligence_index} />
          <Metric label="Coding" value={item.coding_index} />
          <Metric label="Agentic" value={item.agentic_index} />
        </View>
      ) : null}

      {item.source === 'design-arena' ? (
        <View style={styles.grid}>
          <Metric label="ELO" value={item.elo} />
          <Metric label="Win rate" value={`${(item.win_rate * 100).toFixed(1)}%`} />
          <Metric
            label="Avg gen ms"
            value={item.avg_generation_time_ms == null ? '—' : item.avg_generation_time_ms}
          />
          <Metric label="Arena" value={item.arena} />
          <Metric label="Category" value={item.category} />
        </View>
      ) : null}

      {item.source === 'openrouter' ? (
        <View style={styles.grid}>
          <Metric label="Benchmark" value={item.benchmark_type.replace(/_/g, ' ')} />
          <Metric
            label="Accuracy"
            value={item.accuracy == null ? '—' : `${(item.accuracy * 100).toFixed(1)}%`}
          />
          <Metric label="Tasks" value={item.total_tasks ?? '—'} />
          <Metric
            label="Avg cost / task"
            value={item.avg_cost_per_task == null ? '—' : `$${item.avg_cost_per_task}`}
          />
        </View>
      ) : null}

      {item.pricing ? (
        <View style={styles.pricing}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <Text style={styles.pricingText}>
            Prompt {formatPrice(item.pricing.prompt)} · Completion {formatPrice(item.pricing.completion)}
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string | number | null }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value == null ? '—' : String(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.foam,
  },
  empty: {
    fontFamily: typography.body,
    color: palette.slate,
  },
  content: {
    padding: 22,
    gap: 12,
    backgroundColor: palette.foam,
  },
  brand: {
    fontFamily: typography.display,
    fontSize: 22,
    color: palette.ink,
  },
  title: {
    fontFamily: typography.bodyBold,
    fontSize: 28,
    color: palette.deep,
  },
  slug: {
    fontFamily: typography.mono,
    fontSize: 13,
    color: palette.slate,
  },
  scoreCard: {
    marginTop: 8,
    padding: 18,
    borderRadius: 18,
    backgroundColor: palette.deep,
    gap: 4,
  },
  scoreValue: {
    fontFamily: typography.display,
    fontSize: 36,
    color: palette.amberSoft,
  },
  scoreLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 14,
    color: palette.foam,
    textTransform: 'capitalize',
  },
  source: {
    fontFamily: typography.body,
    fontSize: 12,
    color: 'rgba(244,251,250,0.7)',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  metric: {
    width: '47%%,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  metricLabel: {
    fontFamily: typography.body,
    fontSize: 12,
    color: palette.slate,
  },
  metricValue: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: palette.ink,
    textTransform: 'capitalize',
  },
  pricing: {
    marginTop: 8,
    gap: 6,
  },
  sectionTitle: {
    fontFamily: typography.bodyBold,
    fontSize: 15,
    color: palette.ink,
  },
  pricingText: {
    fontFamily: typography.mono,
    fontSize: 13,
    color: palette.teal,
  },
});
