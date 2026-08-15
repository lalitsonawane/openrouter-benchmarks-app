import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { IBMPlexSans_600SemiBold } from '@expo-google-fonts/ibm-plex-sans';
import { ThemeProvider, DefaultTheme } from 'expo-router';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { ApiKeyProvider } from '@/components/ApiKeyProvider';
import { palette } from '@/constants/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.teal,
    background: palette.foam,
    card: palette.foam,
    text: palette.ink,
    border: palette.line,
    notification: palette.amber,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    IBMPlexSans_600SemiBold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ApiKeyProvider>
      <ThemeProvider value={AppTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Model detail',
              headerStyle: { backgroundColor: palette.foam },
              headerTintColor: palette.ink,
            }}
          />
        </Stack>
      </ThemeProvider>
    </ApiKeyProvider>
  );
}
