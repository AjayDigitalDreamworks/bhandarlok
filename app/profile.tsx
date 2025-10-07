import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Card, Paragraph, Title } from 'react-native-paper';
import { COLORS, SPACING } from './constants';

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const logout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          // Navigate to account or restart
          Alert.alert('Logged out', 'You have been logged out.');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Please login to view profile.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label={user.username.charAt(0).toUpperCase()} style={styles.avatar} />
        <Title style={styles.title}>{user.username}</Title>
        <Paragraph style={styles.email}>{user.email}</Paragraph>
      </View>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Account Settings</Title>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="person" size={24} color={COLORS.primary} />
            <Text style={styles.optionText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="list" size={24} color={COLORS.primary} />
            <Text style={styles.optionText}>My Bhandaras</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={logout}>
            <Ionicons name="log-out" size={24} color={COLORS.error} />
            <Text style={[styles.optionText, { color: COLORS.error }]}>Logout</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: 'center', padding: SPACING.xlarge, backgroundColor: COLORS.accent },
  avatar: { backgroundColor: COLORS.primary },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginTop: SPACING.medium },
  email: { fontSize: 16, color: COLORS.textLight },
  card: { margin: SPACING.medium, borderRadius: 12, elevation: 4 },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.medium },
  optionText: { fontSize: 16, marginLeft: SPACING.medium, color: COLORS.text },
});
