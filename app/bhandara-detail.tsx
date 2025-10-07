import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Card, Paragraph, Title } from 'react-native-paper';
import { API_BASE_URL, COLORS, SPACING } from './constants';

interface Bhandara {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  additionalDetails: string;
  image?: string;
  location: {
    coordinates: [number, number];
  };
  attendees: { _id: string; username: string }[];
  createdBy: { _id: string; username: string };
}

export default function BhandaraDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [bhandara, setBhandara] = useState<Bhandara | null>(null);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);
  const [attendeesCount, setAttendeesCount] = useState(0);

  useEffect(() => {
    fetchBhandara();
  }, [id]);

  const fetchBhandara = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !id) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/bhandara/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBhandara(res.data);
      setAttendeesCount(res.data.attendees.length);
      // Check if current user is attending
      const userId = await getUserId();
      setAttending(res.data.attendees.some((a: any) => a._id === userId));
    } catch (error) {
      Alert.alert('Error', 'Failed to load bhandara details');
    } finally {
      setLoading(false);
    }
  };

  const getUserId = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user._id;
    }
    return null;
  };

  const toggleAttendance = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token || !id) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/bhandara/${id}/attend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAttending(res.data.attending);
      setAttendeesCount(res.data.attendeesCount);
    } catch (error) {
      Alert.alert('Error', 'Failed to update attendance');
    }
  };

  const getDirections = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for directions.');
        return;
      }
      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude: userLat, longitude: userLng } = userLocation.coords;
      const [destLng, destLat] = bhandara!.location.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}`;
      Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Failed to get directions');
    }
  };

  const shareBhandara = async () => {
  if (!bhandara) return;
  
  try {
    // Format the message to include all relevant information
    const message = `
      🎉 **Bhandara Details** 🎉

      **Title:** ${bhandara.title}
      **Description:** ${bhandara.description}
      **Start Time:** ${new Date(bhandara.startTime).toLocaleString()}
      **End Time:** ${new Date(bhandara.endTime).toLocaleString()}

      ${bhandara.additionalDetails ? `**Additional Info:** ${bhandara.additionalDetails}` : ''}
      
      **Location:** [Get Directions](https://www.google.com/maps/dir/?api=1&origin=${bhandara.location.coordinates[1]},${bhandara.location.coordinates[0]})
      
      📲 **Download the app here:** [App Link - Play Store](https://play.google.com/store/apps/details?id=com.yourappname) or [App Link - App Store](https://apps.apple.com/us/app/yourappname/id123456789)
      
      📸 **Image:** ${bhandara.image ? bhandara.image : 'No Image Available'}

      Join me and attend the Bhandara! 🙌
    `;
    
    // Use Share API to share the formatted message
    await Share.share({ message });

  } catch (error) {
    Alert.alert('Error', 'Failed to share');
  }
};


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!bhandara) {
    return (
      <View style={styles.container}>
        <Text>Bhandara not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Bhandara Details</Text>
      </View>
      <Card style={styles.card}>
        {bhandara.image && <Card.Cover source={{ uri: bhandara.image }} style={styles.image} />}
        <Card.Content>
          <Title style={styles.cardTitle}>{bhandara.title}</Title>
          <Paragraph style={styles.description}>{bhandara.description}</Paragraph>
          <Text style={styles.details}>Start: {new Date(bhandara.startTime).toLocaleString()}</Text>
          <Text style={styles.details}>End: {new Date(bhandara.endTime).toLocaleString()}</Text>
          {bhandara.additionalDetails && <Text style={styles.details}>{bhandara.additionalDetails}</Text>}
          <Text style={styles.details}>Created by: {bhandara.createdBy.username}</Text>
          <Text style={styles.details}>Attendees: {attendeesCount}</Text>
        </Card.Content>
      </Card>
      <View style={styles.buttons}>
        <Button mode="contained" onPress={toggleAttendance} style={styles.button}>
          {attending ? 'Unattend' : 'Attend'}
        </Button>
        <Button mode="outlined" onPress={getDirections} style={styles.button}>
          Get Directions
        </Button>
        <Button mode="outlined" onPress={shareBhandara} style={styles.button}>
          Share
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.large, backgroundColor: COLORS.accent },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginLeft: SPACING.medium },
  card: { margin: SPACING.medium, borderRadius: 12, elevation: 6 },
  image: { height: 200, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.small },
  description: { fontSize: 16, color: COLORS.textLight, marginBottom: SPACING.small },
  details: { fontSize: 14, color: COLORS.textLight, marginBottom: SPACING.small },
  buttons: { padding: SPACING.medium },
  button: { marginBottom: SPACING.medium },
});
