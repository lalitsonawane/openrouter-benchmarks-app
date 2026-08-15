import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette, typography } from '@/constants/theme';

const DOCS_URL = 'https://openrouter.ai/docs/api/api-reference/benchmarks/list-benchmarks';

const sections = [
  {
    title: 'Unified endpoint',
    body: 'GET /api/v1/benchmarks aggregates Artificial Analysis indices, Design Arena ELO standings, and OpenRouter evals such as GPQA and tau-bench.',
  },
  {
    title: 'Filter by workload',
    body: 'Use task_type=coding, intelligence, or agentic to find models suited for a specific job. Design Arena also supports arena and category filters.',
  },
  {
    title: 'Auth & limits',
    body: 'Any valid OpenRouter API key works. The endpoint is rate-limited to 30 requests/minute per key and 500 requests/day per account.',
  },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#123038', '#1F6F78', '#2A8A84']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}>
        <Animated.View entering={FadeInUp.duration(450)}>
          <Text style={styles.brand}>Benchline</Text>
          <Text style={styles.title}>How the rankings work</Text>
          <Text style={styles.lead}>
            This app is a mobile and web client for OpenRouter’s list-benchmarks API. Scores are evidence for model
            selection — always verify a model is currently routable before production use.
          </Text>
        </Animated.View>

        <View style={styles.stack}>
          {sections.map((section, index) => (
            <Animated.View
              key={section.title}
              entering={FadeInUp.delay(120 * (index + 1)).duration(450)}
              style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionBody}>{section.body}</Text>
            </Animated.View>
          ))}
        </View>

        <Text style={styles.link} onPress={() => Linking.openURL(DOCS_URL)}>
          Open the API reference →
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.deep,
  },
  content: {
    paddingHorizontal: 22,
    gap: 22,
  },
  brand: {
    fontFamily: typography.display,
    fontSize: 28,
    color: palette.amberSoft,
  },
  title: {
    fontFamily: typography.bodyBold,
    fontSize: 22,
    color: palette.foam,
    marginTop: 8,
  },
  lead: {
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(244,251,250,0.82)',
    marginTop: 10,
    maxWidth: 520,
  },
  stack: {
    gap: 14,
  },
  section: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.18)',
    paddingTop: 14,
    gap: 6,
  },
  sectionTitle: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: palette.foam,
  },
  sectionBody: {
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(244,251,250,0.78)',
  },
  link: {
    fontFamily: typography.bodyMedium,
    fontSize: 15,
    color: palette.amberSoft,
    marginTop: 8,
  },
});
