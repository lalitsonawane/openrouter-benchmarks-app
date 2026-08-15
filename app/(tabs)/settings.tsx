import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApiKey } from '@/components/ApiKeyProvider';
import { palette, typography } from '@/constants/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { apiKey, hasKey, setApiKey, clearKey } = useApiKey();
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(apiKey || '');
  }, [apiKey]);

  const save = async () => {
    if (!draft.trim()) {
      Alert.alert('API key required', 'Paste an OpenRouter API key to load live benchmarks.');
      return;
    }
    setSaving(true);
    try {
      await setApiKey(draft);
      Alert.alert('Saved', 'Your OpenRouter API key is stored on this device.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    await clearKey();
    setDraft('');
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#F4FBFA', '#E7F2F1', '#F7EFE2']} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}>
        <Text style={styles.brand}>Benchline</Text>
        <Text style={styles.title}>API access</Text>
        <Text style={styles.lead}>
          Authenticate with any valid OpenRouter API key. Keys stay on-device and are sent only to
          openrouter.ai/api/v1/benchmarks.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>OpenRouter API key</Text>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="sk-or-v1-..."
            placeholderTextColor={palette.slate}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <View style={styles.actions}>
          <Pressable onPress={save} style={styles.primaryButton} disabled={saving}>
            <Text style={styles.primaryButtonText}>{saving ? 'Saving…' : hasKey ? 'Update key' : 'Save key'}</Text>
          </Pressable>
          {hasKey ? (
            <Pressable onPress={remove} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Remove key</Text>
            </Pressable>
          ) : null}
        </View>

        <Text style={styles.hint}>
          Without a key, Rankings shows demo sample rows so you can explore the UI. Create a key at
          openrouter.ai/keys.
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.foam,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    gap: 16,
  },
  brand: {
    fontFamily: typography.display,
    fontSize: 28,
    color: palette.ink,
  },
  title: {
    fontFamily: typography.bodyBold,
    fontSize: 22,
    color: palette.deep,
  },
  lead: {
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 21,
    color: palette.slate,
    maxWidth: 480,
  },
  field: {
    gap: 8,
    marginTop: 8,
  },
  label: {
    fontFamily: typography.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: palette.slate,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: typography.mono,
    fontSize: 14,
    color: palette.ink,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: palette.deep,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryButtonText: {
    fontFamily: typography.bodyBold,
    color: palette.foam,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: palette.danger,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryButtonText: {
    fontFamily: typography.bodyMedium,
    color: palette.danger,
  },
  hint: {
    fontFamily: typography.body,
    fontSize: 13,
    lineHeight: 19,
    color: palette.slate,
    marginTop: 8,
  },
});
