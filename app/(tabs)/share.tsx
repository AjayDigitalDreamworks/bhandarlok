import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button, TextInput } from 'react-native-paper';
import { API_BASE_URL, COLORS, SPACING } from '../constants';

export default function Share() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(false);

  // For modal picker visibility
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required to share bhandara location.');
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    Alert.alert('Location set', 'Your current location has been captured.');
  };

  const validateForm = () => {
    if (!title.trim()) return 'Title is required';
    if (!description.trim()) return 'Description is required';
    if (!location) return 'Location is required';
    if (startTime >= endTime) return 'End time must be after start time';
    return null;
  };

  const submit = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Authentication Error', 'Please login first');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('location', JSON.stringify({
      type: 'Point',
      coordinates: [location!.longitude, location!.latitude],
    }));
    formData.append('startTime', startTime.toISOString());
    formData.append('endTime', endTime.toISOString());
    formData.append('additionalDetails', additionalDetails.trim());
    if (image) {
      formData.append('image', {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any);
    }

    try {
      await axios.post(`${API_BASE_URL}/bhandara`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Success', 'Bhandara shared successfully!');
      setTitle('');
      setDescription('');
      setStartTime(new Date());
      setEndTime(new Date());
      setAdditionalDetails('');
      setImage(null);
      setLocation(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to share bhandara. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.ScrollView
          style={{ opacity: fadeAnim }}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.header}>
            <Ionicons name="add-circle" size={32} color={COLORS.primary} />
            <Text style={styles.title}>Share a Bhandara</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <TextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
              mode="outlined"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timing</Text>

            {/* Start Time Button */}
            <TouchableOpacity style={styles.dateButton} onPress={() => setStartPickerVisible(true)}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <Text style={styles.dateText}>Start: {startTime.toLocaleString()}</Text>
            </TouchableOpacity>

            {/* End Time Button */}
            <TouchableOpacity style={styles.dateButton} onPress={() => setEndPickerVisible(true)}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <Text style={styles.dateText}>End: {endTime.toLocaleString()}</Text>
            </TouchableOpacity>

            {/* Start DateTime Picker */}
            <DateTimePickerModal
              isVisible={isStartPickerVisible}
              mode="datetime"
              date={startTime}
              onConfirm={(date) => {
                setStartPickerVisible(false);
                setStartTime(date);
              }}
              onCancel={() => setStartPickerVisible(false)}
            />

            {/* End DateTime Picker */}
            <DateTimePickerModal
              isVisible={isEndPickerVisible}
              mode="datetime"
              date={endTime}
              onConfirm={(date) => {
                if (date <= startTime) {
                  Alert.alert('Invalid Date', 'End time must be after start time.');
                } else {
                  setEndTime(date);
                }
                setEndPickerVisible(false);
              }}
              onCancel={() => setEndPickerVisible(false)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            <TextInput
              label="Any additional information"
              value={additionalDetails}
              onChangeText={setAdditionalDetails}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={2}
              mode="outlined"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Media & Location</Text>
            <Button mode="contained" onPress={pickImage} style={styles.button}>
              <Ionicons name="image" size={20} color={COLORS.accent} />
              Pick Image
            </Button>
            <Button mode="contained" onPress={getLocation} style={styles.button}>
              <Ionicons name="location" size={20} color={COLORS.accent} />
              Get Location
            </Button>
          </View>

          <Button mode="contained" onPress={submit} loading={loading} style={styles.submitButton}>
            Share Bhandara
          </Button>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: { padding: SPACING.medium },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.large },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginLeft: SPACING.medium },
  section: { marginBottom: SPACING.large },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: SPACING.medium },
  input: { marginBottom: SPACING.medium },
  textArea: { height: 80 },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    padding: SPACING.medium,
    borderRadius: 8,
    marginBottom: SPACING.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateText: { fontSize: 16, color: COLORS.text, marginLeft: SPACING.small },
  button: { marginBottom: SPACING.medium },
  submitButton: { marginTop: SPACING.large, backgroundColor: COLORS.secondary },
});
