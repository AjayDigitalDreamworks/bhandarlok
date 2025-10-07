import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Card, Switch, Title } from 'react-native-paper';
import { COLORS, SPACING } from '../constants';

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const darkMode = await AsyncStorage.getItem('darkMode');
      setIsDarkMode(darkMode === 'true');
    };
    loadSettings();
  }, []);

  const toggleDarkMode = async (value: boolean) => {
    setIsDarkMode(value);
    await AsyncStorage.setItem('darkMode', value.toString());
    // In a real app, update theme context here
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? COLORS.backgroundDark : COLORS.background }]}>
      <View style={styles.header}>
        <Ionicons name="settings" size={32} color={isDarkMode ? COLORS.primary : COLORS.primary} />
        <Text style={[styles.title, { color: isDarkMode ? COLORS.textDark : COLORS.primary }]}>Settings</Text>
      </View>
      <Card style={[styles.card, { backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.card }]}>
        <Card.Content>
          <Title style={{ color: isDarkMode ? COLORS.textDark : COLORS.text }}>Appearance</Title>
          <View style={styles.setting}>
            <Text style={[styles.settingText, { color: isDarkMode ? COLORS.textDark : COLORS.text }]}>Dark Mode</Text>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} color={COLORS.primary} />
          </View>
        </Card.Content>
      </Card>
      <Card style={[styles.card, { backgroundColor: isDarkMode ? COLORS.cardDark : COLORS.card }]}>
        <Card.Content>
          <Title style={{ color: isDarkMode ? COLORS.textDark : COLORS.text }}>About</Title>
          <Text style={[styles.aboutText, { color: isDarkMode ? COLORS.textLightDark : COLORS.textLight }]}>
            Bhandarlok v1.0.0
            {'\n'}Powered by Ajay Digital Dreamworks
          </Text>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.large, backgroundColor: COLORS.accent },
  title: { fontSize: 24, fontWeight: 'bold', marginLeft: SPACING.medium },
  card: { margin: SPACING.medium, borderRadius: 12, elevation: 4 },
  setting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.medium },
  settingText: { fontSize: 16 },
  aboutText: { fontSize: 14, marginTop: SPACING.small },
});
