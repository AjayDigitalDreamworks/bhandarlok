import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { COLORS, lightTheme } from './constants';

export default function RootLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <PaperProvider theme={lightTheme}>
        <View style={styles.container}>
          <Text style={styles.text}>Powered By Ajay Digital Dreamworks</Text>
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={lightTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  text: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
});
