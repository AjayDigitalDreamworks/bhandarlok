import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Card, FAB, Paragraph, Title } from 'react-native-paper';
import { API_BASE_URL, COLORS, SPACING } from './constants';

interface Bhandara {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  additionalDetails: string;
  image?: string;
}

export default function Home() {
  const [bhandaras, setBhandaras] = useState<Bhandara[]>([]);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchBhandaras = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/bhandara/nearby?lng=${loc.coords.longitude}&lat=${loc.coords.latitude}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBhandaras(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchBhandaras();
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBhandaras();
    setRefreshing(false);
  };

  const renderSkeleton = () => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonText} />
        <View style={styles.skeletonText} />
        <View style={styles.skeletonText} />
      </Card.Content>
    </Card>
  );

  const renderItem = ({ item }: { item: Bhandara }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Card style={styles.card}>
        <Card.Content>
          {item.image && <Card.Cover source={{ uri: item.image }} style={styles.image} />}
          <Title style={styles.cardTitle}>{item.title}</Title>
          <Paragraph style={styles.cardDescription}>{item.description}</Paragraph>
          <Text style={styles.cardDetails}>Start: {new Date(item.startTime).toLocaleString()}</Text>
          <Text style={styles.cardDetails}>End: {new Date(item.endTime).toLocaleString()}</Text>
          {item.additionalDetails && <Text style={styles.cardDetails}>{item.additionalDetails}</Text>}
        </Card.Content>
      </Card>
    </Animated.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="restaurant" size={32} color={COLORS.primary} />
          <Text style={styles.title}>Nearby Bhandaras</Text>
        </View>
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={(item) => item.toString()}
          renderItem={renderSkeleton}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="restaurant" size={32} color={COLORS.primary} />
        <Text style={styles.title}>Nearby Bhandaras</Text>
      </View>
      <FlatList
        data={bhandaras}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No bhandaras nearby. Share one!</Text>}
        contentContainerStyle={styles.listContainer}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {/* Navigate to share */}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.large, backgroundColor: COLORS.accent, elevation: 4 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginLeft: SPACING.medium },
  listContainer: { padding: SPACING.medium },
  card: { marginBottom: SPACING.medium, borderRadius: 12, elevation: 6 },
  image: { height: 200, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.small },
  cardDescription: { fontSize: 14, color: COLORS.textLight, marginBottom: SPACING.small },
  cardDetails: { fontSize: 12, color: COLORS.textLight },
  emptyText: { textAlign: 'center', fontSize: 16, color: COLORS.textLight, marginTop: SPACING.large },
  skeletonImage: { height: 200, backgroundColor: COLORS.border, borderRadius: 8, marginBottom: SPACING.medium },
  skeletonText: { height: 16, backgroundColor: COLORS.border, borderRadius: 4, marginBottom: SPACING.small },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: COLORS.primary },
});
