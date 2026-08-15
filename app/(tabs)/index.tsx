import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BenchmarkRow } from '@/components/BenchmarkRow';
import { FilterBar } from '@/components/FilterBar';
import { useApiKey } from '@/components/ApiKeyProvider';
import { palette, typography } from '@/constants/theme';
import { listBenchmarks, OpenRouterApiError, sourceLabel } from '@/lib/api';
import { getDemoBenchmarks } from '@/lib/demo-data';
import type { BenchmarkFilters, BenchmarkItem, UnifiedBenchmarksMeta } from '@/lib/types';

const DEFAULT_FILTERS: BenchmarkFilters = {
  source: 'artificial-analysis',
  task_type: 'coding',
  max_results: 50,
};

export default function RankingsScreen() {
  const insets = useSafeAreaInsets();
  const { apiKey, hasKey, ready } = useApiKey();
  const [filters, setFilters] = useState<BenchmarkFilters>(DEFAULT_FILTERS);
  const [items, setItems] = useState<BenchmarkItem[]>([]);
  const [meta, setMeta] = useState<UnifiedBenchmarksMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingDemo, setUsingDemo] = useState(false);

  const load = useCallback(async () => {
    if (!ready) return;
    setLoading(true);
    setError(null);

    try {
      if (!hasKey || !apiKey) {
        const demo = getDemoBenchmarks(filters.source || undefined);
        setItems(demo.data);
        setMeta(demo.meta);
        setUsingDemo(true);
        return;
      }

      const response = await listBenchmarks(apiKey, filters);
      setItems(response.data);
      setMeta(response.meta);
      setUsingDemo(false);
    } catch (err) {
      const message =
        err instanceof OpenRouterApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Unable to load benchmarks';
      setError(message);
      const demo = getDemoBenchmarks(filters.source || undefined);
      setItems(demo.data);
      setMeta(demo.meta);
      setUsingDemo(true);
    } finally {
      setLoading(false);
    }
  }, [apiKey, filters, hasKey, ready]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#F7EFE2', '#E7F2F1', '#D7EBE8']} style={StyleSheet.absoluteFill} />
      <View style={[styles.hero, { paddingTop: insets.top + 12 }]}>
        <Animated.View entering={FadeInDown.duration(500)}>
          <Text style={styles.brand}>Benchline</Text>
          <Text style={styles.headline}>OpenRouter model benchmarks</Text>
          <Text style={styles.subhead}>
            Rank Artificial Analysis, Design Arena, and OpenRouter evals from one endpoint.
          </Text>
        </Animated.View>
        <View style={styles.heroActions}>
          <Pressable onPress={load} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{loading ? 'Loading…' : 'Refresh'}</Text>
          </Pressable>
          {!hasKey ? (
            <Link href="/(tabs)/settings" asChild>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Add API key</Text>
              </Pressable>
            </Link>
          ) : null}
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item, index) => `${item.source}-${item.model_permaslug}-${index}`}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={palette.teal} />}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <FilterBar filters={filters} onChange={setFilters} />
            {meta ? (
              <View style={styles.metaBar}>
                <Text style={styles.metaText}>
                  {meta.model_count} models · as of {new Date(meta.as_of).toLocaleString()}
                  {meta.source ? ` · ${sourceLabel(meta.source)}` : ''}
                </Text>
                {usingDemo ? (
                  <Text style={styles.demoText}>Showing demo data until a valid API key is set.</Text>
                ) : null}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>
            ) : null}
            {loading && items.length === 0 ? (
              <ActivityIndicator color={palette.teal} style={{ marginVertical: 24 }} />
            ) : null}
          </View>
        }
        renderItem={({ item, index }) => (
          <BenchmarkRow
            item={item}
            rank={index + 1}
            taskType={filters.task_type || undefined}
            onPress={() =>
              router.push({
                pathname: '/modal',
                params: { payload: JSON.stringify(item), taskType: filters.task_type || '' },
              })
            }
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No benchmark rows</Text>
              <Text style={styles.emptyBody}>Try another source or task filter.</Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.foam,
  },
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    gap: 14,
  },
  brand: {
    fontFamily: typography.display,
    fontSize: 34,
    color: palette.ink,
    letterSpacing: -0.8,
  },
  headline: {
    fontFamily: typography.bodyMedium,
    fontSize: 16,
    color: palette.deep,
    marginTop: 4,
  },
  subhead: {
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: palette.slate,
    maxWidth: 420,
    marginTop: 6,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: palette.amber,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
  },
  primaryButtonText: {
    fontFamily: typography.bodyBold,
    color: palette.ink,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: palette.deep,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
  },
  secondaryButtonText: {
    fontFamily: typography.bodyMedium,
    color: palette.deep,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 10,
  },
  metaBar: {
    gap: 4,
    marginBottom: 8,
  },
  metaText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: palette.slate,
  },
  demoText: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    color: palette.amber,
  },
  errorText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: palette.danger,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: palette.ink,
  },
  emptyBody: {
    fontFamily: typography.body,
    fontSize: 13,
    color: palette.slate,
  },
});
