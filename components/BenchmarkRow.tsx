import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, typography } from '@/constants/theme';
import { formatPrice, primaryScore, sourceLabel } from '@/lib/api';
import type { BenchmarkItem } from '@/lib/types';

type Props = {
  item: BenchmarkItem;
  rank: number;
  taskType?: string;
  onPress: () => void;
};

export function BenchmarkRow({ item, rank, taskType, onPress }: Props) {
  const score = primaryScore(item, taskType);
  const subtitle =
    item.source === 'design-arena'
      ? `${item.arena} · ${item.category}`
      : item.source === 'openrouter'
        ? item.benchmark_type.replace(/_/g, ' ')
        : item.model_permaslug;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.rankWrap}>
        <Text style={styles.rank}>{rank}</Text>
      </View>
      <View style={styles.main}>
        <Text style={styles.title} numberOfLines={1}>
          {item.display_name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {sourceLabel(item.source)} · {subtitle}
        </Text>
        {item.pricing ? (
          <Text style={styles.price}>
            Prompt {formatPrice(item.pricing.prompt)} · Completion {formatPrice(item.pricing.completion)}
          </Text>
        ) : null}
      </View>
      <View style={styles.scoreWrap}>
        <Text style={styles.score}>
          {score.value == null
            ? '—'
            : item.source === 'openrouter'
              ? `${(score.value * 100).toFixed(1)}%`
              : Number.isInteger(score.value)
                ? String(score.value)
                : score.value.toFixed(1)}
        </Text>
        <Text style={styles.scoreLabel}>{score.label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.line,
    backgroundColor: 'rgba(255,255,255,0.42)',
  },
  pressed: {
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  rankWrap: {
    width: 28,
    alignItems: 'center',
  },
  rank: {
    fontFamily: typography.mono,
    fontSize: 13,
    color: palette.slate,
  },
  main: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: palette.ink,
  },
  meta: {
    fontFamily: typography.body,
    fontSize: 12,
    color: palette.slate,
  },
  price: {
    fontFamily: typography.mono,
    fontSize: 11,
    color: palette.teal,
    marginTop: 2,
  },
  scoreWrap: {
    alignItems: 'flex-end',
    minWidth: 64,
  },
  score: {
    fontFamily: typography.display,
    fontSize: 18,
    color: palette.deep,
  },
  scoreLabel: {
    fontFamily: typography.body,
    fontSize: 11,
    color: palette.slate,
    textTransform: 'capitalize',
  },
});
