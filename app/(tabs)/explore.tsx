import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Card, Paragraph, TextInput, Title } from 'react-native-paper';
import { API_BASE_URL, COLORS, SPACING } from '../constants';

interface Bhandara {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  additionalDetails: string;
  image?: string;
}

export default function Explore() {
  const [bhandaras, setBhandaras] = useState<Bhandara[]>([]);
  const [filteredBhandaras, setFilteredBhandaras] = useState<Bhandara[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBhandaras = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }
    try {
      const res = await axios.get(`${API_BASE_URL}/bhandara`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBhandaras(res.data);
      setFilteredBhandaras(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchBhandaras();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = bhandaras.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBhandaras(filtered);
    } else {
      setFilteredBhandaras(bhandaras);
    }
  }, [searchQuery, bhandaras]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBhandaras();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="search" size={32} color={COLORS.primary} />
          <Text style={styles.title}>Explore Bhandaras</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading bhandaras...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="search" size={32} color={COLORS.primary} />
        <Text style={styles.title}>Explore Bhandaras</Text>
      </View>
      <TextInput
        label="Search Bhandaras"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        mode="outlined"
        left={<TextInput.Icon icon="magnify" />}
      />
      <FlatList
        data={filteredBhandaras}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/bhandara-detail/${item._id}`)}>
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
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No bhandaras available.</Text>}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.large, backgroundColor: COLORS.accent, elevation: 4 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginLeft: SPACING.medium },
  searchInput: { margin: SPACING.medium },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: SPACING.medium, fontSize: 16, color: COLORS.text },
  listContainer: { padding: SPACING.medium },
  card: { marginBottom: SPACING.medium, borderRadius: 12, elevation: 6 },
  image: { height: 200, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.small },
  cardDescription: { fontSize: 14, color: COLORS.textLight, marginBottom: SPACING.small },
  cardDetails: { fontSize: 12, color: COLORS.textLight },
  emptyText: { textAlign: 'center', fontSize: 16, color: COLORS.textLight, marginTop: SPACING.large },
});
