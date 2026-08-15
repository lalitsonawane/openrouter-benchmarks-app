import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const API_KEY_STORAGE = 'openrouter_api_key';

async function canUseSecureStore(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function getApiKey(): Promise<string | null> {
  if (await canUseSecureStore()) {
    return SecureStore.getItemAsync(API_KEY_STORAGE);
  }
  return AsyncStorage.getItem(API_KEY_STORAGE);
}

export async function setApiKey(key: string): Promise<void> {
  const trimmed = key.trim();
  if (await canUseSecureStore()) {
    await SecureStore.setItemAsync(API_KEY_STORAGE, trimmed);
    return;
  }
  await AsyncStorage.setItem(API_KEY_STORAGE, trimmed);
}

export async function clearApiKey(): Promise<void> {
  if (await canUseSecureStore()) {
    await SecureStore.deleteItemAsync(API_KEY_STORAGE);
    return;
  }
  await AsyncStorage.removeItem(API_KEY_STORAGE);
}
