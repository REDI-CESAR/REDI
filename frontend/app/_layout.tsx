import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { Text, StyleSheet, View, useColorScheme } from 'react-native'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = 'light' || useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.wrapper}>
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>REDI - Redação Digital</Text>
        </View> */}

        <View style={styles.content}>
          <Stack screenOptions={{ title: 'REDI - Redação Digital' }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="home" />
            <Stack.Screen name="register" />
            <Stack.Screen name="scanner" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
      </View>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  header: {
    alignItems: 'center'
  },
  headerTitle: {
    color: '#2196f3',
    fontSize: 24
  },
  content: {
    minHeight: 200,
    width: '100%',
    marginHorizontal: 'auto',
    flex: 1,
    justifyContent: 'center'
  }
})
