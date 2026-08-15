import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { palette, typography } from '@/constants/theme';
import type { Arena, BenchmarkFilters, BenchmarkSource, TaskType } from '@/lib/types';
import { DESIGN_ARENA_CATEGORIES } from '@/lib/types';

type Option<T extends string> = { label: string; value: T | '' };

const SOURCES: Option<BenchmarkSource>[] = [
  { label: 'All sources', value: '' },
  { label: 'Artificial Analysis', value: 'artificial-analysis' },
  { label: 'Design Arena', value: 'design-arena' },
  { label: 'OpenRouter', value: 'openrouter' },
];

const TASKS: Option<TaskType>[] = [
  { label: 'All tasks', value: '' },
  { label: 'Coding', value: 'coding' },
  { label: 'Intelligence', value: 'intelligence' },
  { label: 'Agentic', value: 'agentic' },
];

const ARENAS: Option<Arena>[] = [
  { label: 'Models', value: 'models' },
  { label: 'Builders', value: 'builders' },
  { label: 'Agents', value: 'agents' },
];

const LIMITS: Option<string>[] = [
  { label: '25', value: '25' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

type Props = {
  filters: BenchmarkFilters;
  onChange: (next: BenchmarkFilters) => void;
};

function ChipRow<T extends string>({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: Option<T>[];
  value: string;
  onSelect: (value: T | '') => void;
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={`${label}-${option.value || 'all'}`}
              onPress={() => onSelect(option.value)}
              style={[styles.chip, selected && styles.chipSelected]}>
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export function FilterBar({ filters, onChange }: Props) {
  const showDesignExtras = filters.source === 'design-arena';

  return (
    <View style={styles.container}>
      <ChipRow
        label="Source"
        options={SOURCES}
        value={filters.source || ''}
        onSelect={(source) =>
          onChange({
            ...filters,
            source,
            arena: source === 'design-arena' ? filters.arena || 'models' : '',
            category: source === 'design-arena' ? filters.category : '',
          })
        }
      />
      <ChipRow
        label="Task"
        options={TASKS}
        value={filters.task_type || ''}
        onSelect={(task_type) => onChange({ ...filters, task_type })}
      />
      {showDesignExtras ? (
        <>
          <ChipRow
            label="Arena"
            options={ARENAS}
            value={filters.arena || 'models'}
            onSelect={(arena) => onChange({ ...filters, arena })}
          />
          <ChipRow
            label="Category"
            options={[
              { label: 'All categories', value: '' },
              ...DESIGN_ARENA_CATEGORIES.map((category) => ({
                label: category,
                value: category,
              })),
            ]}
            value={filters.category || ''}
            onSelect={(category) => onChange({ ...filters, category })}
          />
        </>
      ) : null}
      <ChipRow
        label="Limit"
        options={LIMITS}
        value={String(filters.max_results || 50)}
        onSelect={(max) => onChange({ ...filters, max_results: Number(max) || 50 })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
    paddingBottom: 8,
  },
  group: {
    gap: 8,
  },
  groupLabel: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: palette.slate,
  },
  row: {
    gap: 8,
    paddingRight: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: 'rgba(255,255,255,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipSelected: {
    backgroundColor: palette.deep,
    borderColor: palette.deep,
  },
  chipText: {
    fontFamily: typography.bodyMedium,
    color: palette.ink,
    fontSize: 13,
  },
  chipTextSelected: {
    color: palette.foam,
  },
});
